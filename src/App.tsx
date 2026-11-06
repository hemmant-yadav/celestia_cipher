import React, { useState, useEffect } from 'react';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { EmergencyScreen } from './screens/EmergencyScreen';
import { MapScreen } from './screens/MapScreen';
import { MySafetyScreen } from './screens/MySafetyScreen';
import { DevicesScreen } from './screens/DevicesScreen';
import { AdminScreen } from './screens/AdminScreen';
import { LoginScreen } from './screens/LoginScreen';
import { ProfileDrawer } from './components/ProfileDrawer';
import { LanguageModal } from './components/LanguageModal';
import { SafetyChatbot } from './components/SafetyChatbot';
import { arduinoSerial } from './services/arduinoSerial';
import { useAuth } from './context/AuthContext';
import type { TabType } from './types';
import './App.css';

export const App: React.FC = () => {
  const { user, loading: isAuthLoading } = useAuth();
  const [isGuestMode, setIsGuestMode] = useState<boolean>(() => {
    return localStorage.getItem('aura_guest') === 'true';
  });
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as TabType;
    return tabParam && ['home', 'map', 'safety', 'devices', 'admin'].includes(tabParam) ? tabParam : 'home';
  });
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);

  useEffect(() => {
    // When refreshing/reloading, always return to the home page
    arduinoSerial.cancelEmergency().catch(() => {});

    // Synchronize emergency mode live across all devices (laptop + phone)
    const unsubscribe = arduinoSerial.subscribe((status) => {
      setIsEmergencyActive(status.isSosActive);
    });
    return () => unsubscribe();
  }, []);

  const handleTriggerSos = async () => {
    // Write "SOS\n" to Arduino Uno over serial & sync all devices
    await arduinoSerial.sendSos();
  };

  const handleCancelEmergency = async () => {
    // End emergency mode & sync all devices
    await arduinoSerial.cancelEmergency();
  };

  return (
    <div className="app-desktop-stage">
      <div className="app-scale-container">
        {/* Mobile Application Viewport */}
        <main className="mobile-app-viewport" aria-label="Personal Safety Mobile Application">
          {/* Admin panel: separate view, no bottom nav, no emergency override */}
          {activeTab === 'admin' ? (
            <AdminScreen />
          ) : isEmergencyActive ? (
            <EmergencyScreen onCancelEmergency={handleCancelEmergency} />
          ) : !user && !isGuestMode && !isAuthLoading ? (
            <LoginScreen
              onContinueAsGuest={() => {
                setIsGuestMode(true);
                localStorage.setItem('aura_guest', 'true');
              }}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeScreen
                  onTriggerSos={handleTriggerSos}
                  onOpenSettings={() => setIsProfileOpen(true)}
                  onOpenChatbot={() => setIsChatbotOpen(true)}
                />
              )}
              {activeTab === 'map' && <MapScreen onBack={() => setActiveTab('home')} />}
              {activeTab === 'safety' && <MySafetyScreen />}
              {activeTab === 'devices' && <DevicesScreen />}

              {/* Four Primary Navigation Destinations */}
              <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

              {/* Minimal Profile/Settings Drawer */}
              <ProfileDrawer
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
              />

              {/* Global Multilingual Selector Modal (Renders above BottomNav with z-index: 100) */}
              <LanguageModal />

              {/* Dynamic Aura Safety AI Chatbot Drawer/Sheet (z-index: 90) */}
              <SafetyChatbot
                isOpen={isChatbotOpen}
                onClose={() => setIsChatbotOpen(false)}
                onNavigateToMap={() => {
                  setIsChatbotOpen(false);
                  setActiveTab('map');
                }}
                onTriggerSos={() => {
                  setIsChatbotOpen(false);
                  handleTriggerSos();
                }}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
