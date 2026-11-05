import React, { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { EmergencyScreen } from './screens/EmergencyScreen';
import { MapScreen } from './screens/MapScreen';
import { MySafetyScreen } from './screens/MySafetyScreen';
import { DevicesScreen } from './screens/DevicesScreen';
import { ProfileDrawer } from './components/ProfileDrawer';
import type { TabType } from './types';
import './App.css';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  const handleTriggerSos = () => {
    setIsEmergencyActive(true);
  };

  const handleCancelEmergency = () => {
    setIsEmergencyActive(false);
  };

  return (
    <div className="app-desktop-stage">
      <div className="app-scale-container">
        {/* Mobile Application Viewport */}
        <main className="mobile-app-viewport" aria-label="Personal Safety Mobile Application">
          {isEmergencyActive ? (
            <EmergencyScreen onCancelEmergency={handleCancelEmergency} />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeScreen
                  onTriggerSos={handleTriggerSos}
                  onOpenSettings={() => setIsProfileOpen(true)}
                />
              )}
              {activeTab === 'map' && <MapScreen />}
              {activeTab === 'safety' && <MySafetyScreen />}
              {activeTab === 'devices' && <DevicesScreen />}

              {/* Four Primary Navigation Destinations */}
              <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

              {/* Minimal Profile/Settings Drawer */}
              <ProfileDrawer
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
