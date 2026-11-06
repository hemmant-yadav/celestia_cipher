import { useState, useEffect } from 'react';

export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te' | 'kn';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.map': 'Map',
    'nav.safety': 'My Safety',
    'nav.devices': 'Devices',

    // Home Screen
    'home.sos': 'SOS',
    'home.holdSos': 'Hold for SOS',
    'home.releaseCancel': 'Release to Cancel',
    'home.systemReady': 'Emergency System Active • Hands-free Voice Protection',
    'home.selectLang': 'Select Language',
    'home.deviceReady': 'System Ready',

    // Emergency Screen
    'emergency.modeActive': 'Emergency Mode Active',
    'emergency.dispatchStatus': 'Dispatch Status',
    'emergency.smsSent': 'SMS Sent',
    'emergency.calling': 'Voice Calling',
    'emergency.initiating': 'Initiating',
    'emergency.sosSent': 'SOS Sent',
    'emergency.smsDispatched': 'SMS Dispatched',
    'emergency.voiceCall': 'Voice Call',
    'emergency.recipients': 'Notified Recipients',
    'emergency.delivered': 'Delivered',
    'emergency.broadcasted': 'Broadcasted',
    'emergency.sister': 'Sister',
    'emergency.partner': 'Partner',
    'emergency.police': 'Police Dispatch 112 / Central',
    'emergency.liveLocation': 'Live GPS Broadcast',
    'emergency.liveGps': 'Live GPS • 4m',
    'emergency.audioBuffer': 'Audio buffer recording',
    'emergency.battery': 'Battery 84%',
    'emergency.callContact': 'Call Contact',
    'emergency.call112': 'Call 112',
    'emergency.slideToCancel': 'Slide to Cancel Emergency ››',
    'emergency.cancelTitle': 'Cancel Emergency Alert',
    'emergency.enterPasscode': 'Enter your 4-digit passcode to cancel the emergency alert',
    'emergency.incorrectPasscode': 'Incorrect passcode. Please try again.',
    'emergency.verifiedStandingDown': 'Passcode verified. Standing down emergency...',
    'emergency.voiceTrigger': 'Voice',

    // Map Screen
    'map.routeTitle': 'RRCE ➔ Home (Kengeri)',
    'map.routeSubtitle': '5.2 km • 14 min via Mysore Rd / NH275',
    'map.safeRoute': 'Safe Route',
    'map.startNav': 'Start Navigation • 14 min',
    'map.exitNav': 'Exit Navigation',
    'map.turnRight': 'Turn right onto Mysore Rd (NH275)',
    'map.turnDetail': 'In 150 m • 5.2 km remaining (14 min)',
    'map.centerLocation': 'Center on Current Location',
    'map.safePoint': 'Verified Safe Point',
    'map.cautionPoint': 'Caution / Hazard Alert',
    'map.call': 'Call',
    'map.dismiss': 'Dismiss',
    'map.rrceStart': 'RRCE (Start)',
    'map.home': 'Home',

    // My Safety Screen
    'safety.title': 'My Safety',
    'safety.subtitle': 'Emergency configuration & trusted circle',
    'safety.trustedContacts': 'Trusted Contacts',
    'safety.manage': 'Manage',
    'safety.alertsActive': 'Alerts active',
    'safety.instantTriggers': 'Instant Triggers',
    'safety.voiceSos': 'Voice SOS',
    'safety.voiceActive': 'Active: "Help"',
    'safety.tapSetup': 'Tap to setup',
    'safety.shakeDetection': 'Shake Detection',
    'safety.criticalAlerts': 'Critical Alerts',
    'safety.highPriority': 'High priority override',
    'safety.safeguards': 'Personal Safeguards',
    'safety.safetyTimer': 'Safety Check-in Timer',
    'safety.fakeCall': 'Fake Call Decoy',
    'safety.pinProtection': 'Emergency PIN Protection',
    'safety.recordingPrefs': 'Recording Preferences',
    'safety.evidenceVault': 'Evidence Vault',
    'safety.incidentReports': 'Incident Reports',
    'safety.changeLang': 'Change App Language',
    'safety.recordsEvidence': 'Records & Evidence',
    'safety.ambientAudioGps': 'Ambient audio & GPS tracking',
    'safety.audioGps': 'Audio & GPS',
    'safety.historicalLogs': 'Historical emergency logs',
    'safety.noneLogged': 'None logged',
    'safety.encryptedRepo': 'Encrypted recordings repository',
    'safety.zeroRecordings': '0 recordings',
    'safety.autoCheckinAlert': 'Automatic check-in alert',
    'safety.off': 'Off',
    'safety.ready': 'Ready',
    'safety.active': 'Active',
    'safety.configured': 'Configured',
    'safety.fakeCallDesc': 'Simulate incoming call to exit safely',
    'safety.pinRequiredDesc': 'Required to cancel active SOS',
    'safety.sister': 'Sister',
    'safety.partner': 'Partner',
    'safety.done': 'Done',

    // Devices Screen
    'devices.title': 'Devices',
    'devices.subtitle': 'Connected safety devices',
    'devices.pairDevice': 'Pair Device',
    'devices.pairADevice': 'Pair a Device',
    'devices.noDevices': 'No devices connected',
    'devices.noDevicesDesc': 'Pair a smartwatch or dedicated safety beacon for instant tactile SOS triggers when your phone is out of reach.',
    'devices.pairedHardware': 'Paired Hardware',
    'devices.synced': 'Synced',
    'devices.justNow': 'Just now',
    'devices.twoMinAgo': '2m ago',
    'devices.connected': 'Connected',
    'devices.disconnected': 'Disconnected',
    'devices.notResponding': 'Not Responding',
    'devices.alerts': 'Device Alerts',
    'devices.lowBattery': 'Low Battery Warning',
    'devices.lowBatteryDesc': 'Alert when device battery drops below 20%',
    'devices.disconnectAlert': 'Disconnection Alert',
    'devices.disconnectAlertDesc': 'Notify if Bluetooth link drops unexpectedly',
    'devices.syncStatus': 'Sync Status Alerts',
    'devices.syncStatusDesc': 'Notify if beacon fails check-in over 1 hour',
    'devices.preferences': 'Device Preferences',
    'devices.primaryTrigger': 'Primary SOS Trigger',
    'devices.wearableHaptics': 'Wearable Haptics',
    'devices.wearableHapticsDesc': 'Vibrate device on alert confirmation',
    'devices.autoReconnect': 'Auto-Reconnect',
    'devices.autoReconnectDesc': 'Restore connection when in range',
    'devices.btLinked': 'Bluetooth 5.3 Low Energy • Linked',
    'devices.battery': 'Battery',
    'devices.charged': 'Charged',
    'devices.status': 'Status',
    'devices.setPrimary': 'Set as Primary SOS Trigger',
    'devices.unpair': 'Unpair Device',
    'devices.unpairConfirmTitle': 'Unpair',
    'devices.unpairDesc': 'This wearable will no longer be able to initiate emergency SOS alerts or transmit telemetry.',
    'devices.cancel': 'Cancel',
    'devices.pairSheetTitle': 'Pair Safety Device',
    'devices.scanning': 'Scanning for nearby hardware...',
    'devices.selectToConnect': 'Select a device to connect',
    'devices.readyToPair': 'Nearby • Ready to pair',
    'devices.beaconDiscovered': 'Nearby • Beacon discovered',
    'devices.connect': 'Connect',
    'devices.pairHint': 'Ensure your accessory has Bluetooth turned on and is within 1 meter.',
    'devices.auraWatch': 'Aura Watch Series 2',
    'devices.safetyTag': 'Safety Keychain Tag',
  },

  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.map': 'मैप',
    'nav.safety': 'मेरी सुरक्षा',
    'nav.devices': 'उपकरण',

    // Home Screen
    'home.sos': 'एसओएस',
    'home.holdSos': 'एसओएस के लिए दबाए रखें',
    'home.releaseCancel': 'रद्द करने के लिए छोड़ें',
    'home.systemReady': 'आपातकालीन प्रणाली सक्रिय • हैंड्स-फ्री आवाज सुरक्षा',
    'home.selectLang': 'भाषा चुनें',
    'home.deviceReady': 'डिवाइस तैयार है',

    // Emergency Screen
    'emergency.modeActive': 'आपातकालीन मोड सक्रिय',
    'emergency.dispatchStatus': 'प्रेषण स्थिति',
    'emergency.smsSent': 'एसएमएस भेजा गया',
    'emergency.calling': 'वॉयस कॉल जारी',
    'emergency.initiating': 'आरंभ हो रहा है',
    'emergency.sosSent': 'एसओएस भेजा गया',
    'emergency.smsDispatched': 'एसएमएस प्रेषित',
    'emergency.voiceCall': 'वॉयस कॉल',
    'emergency.recipients': 'अधिसूचित संपर्क',
    'emergency.delivered': 'वितरित',
    'emergency.broadcasted': 'प्रसारित',
    'emergency.sister': 'बहन',
    'emergency.partner': 'पार्टनर',
    'emergency.police': 'पुलिस नियंत्रण कक्ष 112',
    'emergency.liveLocation': 'लाइव जीपीएस प्रसारण',
    'emergency.liveGps': 'लाइव जीपीएस • 4 मी',
    'emergency.audioBuffer': 'ऑडियो साक्ष्य रिकॉर्डिंग',
    'emergency.battery': 'बैटरी 84%',
    'emergency.callContact': 'संपर्क को कॉल करें',
    'emergency.call112': '112 पर कॉल करें',
    'emergency.slideToCancel': 'आपातकाल रद्द करने के लिए स्लाइड करें ››',
    'emergency.cancelTitle': 'आपातकालीन चेतावनी रद्द करें',
    'emergency.enterPasscode': 'आपातकाल रद्द करने के लिए अपना 4-अंकीय पासकोड दर्ज करें',
    'emergency.incorrectPasscode': 'गलत पासकोड। कृपया पुनः प्रयास करें।',
    'emergency.verifiedStandingDown': 'पासकोड सत्यापित। आपातकाल समाप्त हो रहा है...',
    'emergency.voiceTrigger': 'आवाज़',

    // Map Screen
    'map.routeTitle': 'RRCE ➔ घर (केंगेरी)',
    'map.routeSubtitle': '5.2 किमी • 14 मिनट (मैसूर रोड / NH275)',
    'map.safeRoute': 'सुरक्षित मार्ग',
    'map.startNav': 'नेविगेशन शुरू करें • 14 मिनट',
    'map.exitNav': 'नेविगेशन से बाहर निकलें',
    'map.turnRight': 'मैसूर रोड (NH275) पर दाएं मुड़ें',
    'map.turnDetail': '150 मीटर में • 5.2 किमी शेष (14 मिनट)',
    'map.centerLocation': 'वर्तमान स्थान पर केंद्रित करें',
    'map.safePoint': 'सत्यापित सुरक्षित स्थल',
    'map.cautionPoint': 'सावधानी / खतरा चेतावनी',
    'map.call': 'कॉल करें',
    'map.dismiss': 'खारिज करें',
    'map.rrceStart': 'RRCE (प्रारंभ)',
    'map.home': 'घर',

    // My Safety Screen
    'safety.title': 'मेरी सुरक्षा',
    'safety.subtitle': 'आपातकालीन विन्यास एवं विश्वसनीय संपर्क',
    'safety.trustedContacts': 'विश्वसनीय संपर्क',
    'safety.manage': 'प्रबंधन',
    'safety.alertsActive': 'अलर्ट सक्रिय',
    'safety.instantTriggers': 'त्वरित ट्रिगर',
    'safety.voiceSos': 'वॉयस एसओएस',
    'safety.voiceActive': 'सक्रिय: "मदद"',
    'safety.tapSetup': 'सेटअप करने के लिए टैप करें',
    'safety.shakeDetection': 'शेक डिटेक्शन',
    'safety.criticalAlerts': 'महत्वपूर्ण अलर्ट',
    'safety.highPriority': 'उच्च प्राथमिकता ओवरराइड',
    'safety.safeguards': 'व्यक्तिगत सुरक्षा उपकरण',
    'safety.safetyTimer': 'सुरक्षा चेक-इन टाइमर',
    'safety.fakeCall': 'नकली कॉल डेकॉय',
    'safety.pinProtection': 'आपातकालीन पिन सुरक्षा',
    'safety.recordingPrefs': 'रिकॉर्डिंग प्राथमिकताएं',
    'safety.evidenceVault': 'साक्ष्य वॉल्ट',
    'safety.incidentReports': 'घटना रिपोर्ट',
    'safety.changeLang': 'ऐप की भाषा बदलें',
    'safety.recordsEvidence': 'रिकॉर्ड एवं साक्ष्य',
    'safety.ambientAudioGps': 'परिवेश ऑडियो एवं जीपीएस ट्रैकिंग',
    'safety.audioGps': 'ऑडियो एवं जीपीएस',
    'safety.historicalLogs': 'ऐतिहासिक आपातकालीन लॉग',
    'safety.noneLogged': 'कोई लॉग नहीं',
    'safety.encryptedRepo': 'एन्क्रिप्टेड रिकॉर्डिंग रिपॉजिटरी',
    'safety.zeroRecordings': '0 रिकॉर्डिंग',
    'safety.autoCheckinAlert': 'स्वचालित चेक-इन चेतावनी',
    'safety.off': 'बंद',
    'safety.ready': 'तैयार',
    'safety.active': 'सक्रिय',
    'safety.configured': 'कॉन्फ़िगर किया गया',
    'safety.fakeCallDesc': 'सुरक्षित निकलने के लिए नकली कॉल प्राप्त करें',
    'safety.pinRequiredDesc': 'सक्रिय एसओएस रद्द करने के लिए आवश्यक',
    'safety.sister': 'बहन',
    'safety.partner': 'पार्टनर',
    'safety.done': 'संपन्न',

    // Devices Screen
    'devices.title': 'उपकरण',
    'devices.subtitle': 'संबद्ध सुरक्षा उपकरण',
    'devices.pairDevice': 'उपकरण जोड़ें',
    'devices.pairADevice': 'एक उपकरण जोड़ें',
    'devices.noDevices': 'कोई उपकरण कनेक्ट नहीं है',
    'devices.noDevicesDesc': 'फोन पहुंच से दूर होने पर तत्काल स्पर्शनीय एसओएस ट्रिगर के लिए स्मार्टवॉच या सुरक्षा बीकन जोड़ें।',
    'devices.pairedHardware': 'संबद्ध हार्डवेयर',
    'devices.synced': 'सिंक किया गया',
    'devices.justNow': 'अभी-अभी',
    'devices.twoMinAgo': '2 मिनट पहले',
    'devices.connected': 'कनेक्टेड',
    'devices.disconnected': 'डिस्कनेक्टेड',
    'devices.notResponding': 'उत्तर नहीं दे रहा',
    'devices.alerts': 'उपकरण अलर्ट',
    'devices.lowBattery': 'कम बैटरी चेतावनी',
    'devices.lowBatteryDesc': 'जब उपकरण की बैटरी 20% से कम हो तो सचेत करें',
    'devices.disconnectAlert': 'डिस्कनेक्शन अलर्ट',
    'devices.disconnectAlertDesc': 'ब्लूटूथ कनेक्शन अप्रत्याशित रूप से टूटने पर सूचित करें',
    'devices.syncStatus': 'सिंक स्थिति अलर्ट',
    'devices.syncStatusDesc': 'यदि बीकन 1 घंटे से अधिक समय तक चेक-इन करने में विफल रहता है तो सूचित करें',
    'devices.preferences': 'उपकरण प्राथमिकताएं',
    'devices.primaryTrigger': 'प्राथमिक एसओएस ट्रिगर',
    'devices.wearableHaptics': 'वियरेबल हैप्टिक्स',
    'devices.wearableHapticsDesc': 'अलर्ट पुष्टिकरण पर उपकरण को कंपन कराएं',
    'devices.autoReconnect': 'ऑटो-पुनः कनेक्ट',
    'devices.autoReconnectDesc': 'रेंज में आने पर कनेक्शन स्वतः पुनर्स्थापित करें',
    'devices.btLinked': 'ब्लूटूथ 5.3 लो एनर्जी • लिंक किया गया',
    'devices.battery': 'बैटरी',
    'devices.charged': 'चार्ज किया गया',
    'devices.status': 'स्थिति',
    'devices.setPrimary': 'प्राथमिक एसओएस ट्रिगर के रूप में सेट करें',
    'devices.unpair': 'उपकरण अनपेयर करें',
    'devices.unpairConfirmTitle': 'अनपेयर करें',
    'devices.unpairDesc': 'यह वियरेबल अब आपातकालीन एसओएस अलर्ट शुरू करने या डेटा भेजने में सक्षम नहीं होगा।',
    'devices.cancel': 'रद्द करें',
    'devices.pairSheetTitle': 'सुरक्षा उपकरण जोड़ें',
    'devices.scanning': 'आस-पास के हार्डवेयर की खोज जारी है...',
    'devices.selectToConnect': 'कनेक्ट करने के लिए एक उपकरण चुनें',
    'devices.readyToPair': 'आस-पास • पेयर करने के लिए तैयार',
    'devices.beaconDiscovered': 'आस-पास • बीकन मिला',
    'devices.connect': 'कनेक्ट करें',
    'devices.pairHint': 'सुनिश्चित करें कि आपके उपकरण का ब्लूटूथ चालू है और 1 मीटर के दायरे में है।',
    'devices.auraWatch': 'ऑरा वॉच सीरीज़ 2',
    'devices.safetyTag': 'सुरक्षा कीचेन टैग',
  },

  kn: {
    // Navigation
    'nav.home': 'ಮುಖಪುಟ',
    'nav.map': 'ನಕ್ಷೆ',
    'nav.safety': 'ನನ್ನ ಸುರಕ್ಷತೆ',
    'nav.devices': 'ಸಾಧನಗಳು',

    // Home Screen
    'home.sos': 'SOS',
    'home.holdSos': 'SOS ಗಾಗಿ ಹಿಡಿದುಕೊಳ್ಳಿ',
    'home.releaseCancel': 'ರದ್ದುಗೊಳಿಸಲು ಬಿಡಿ',
    'home.systemReady': 'ತುರ್ತು ವ್ಯವಸ್ಥೆ ಸಕ್ರಿಯವಾಗಿದೆ • ಹ್ಯಾಂಡ್ಸ್-ಫ್ರೀ ಧ್ವನಿ ರಕ್ಷಣೆ',
    'home.selectLang': 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    'home.deviceReady': 'ಸಾಧನ ಸಿದ್ಧವಾಗಿದೆ',

    // Emergency Screen
    'emergency.modeActive': 'ತುರ್ತು ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ',
    'emergency.dispatchStatus': 'ರವಾನೆ ಸ್ಥಿತಿ',
    'emergency.smsSent': 'SMS ಕಳುಹಿಸಲಾಗಿದೆ',
    'emergency.calling': 'ಧ್ವನಿ ಕರೆ ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿದೆ',
    'emergency.initiating': 'ಪ್ರಾರಂಭಿಸಲಾಗುತ್ತಿದೆ',
    'emergency.sosSent': 'SOS ಕಳುಹಿಸಲಾಗಿದೆ',
    'emergency.smsDispatched': 'SMS ರವಾನಿಸಲಾಗಿದೆ',
    'emergency.voiceCall': 'ಧ್ವನಿ ಕರೆ',
    'emergency.recipients': 'ತಿಳಿಸಲಾದ ಸಂಪರ್ಕಗಳು',
    'emergency.delivered': 'ತಲುಪಿಸಲಾಗಿದೆ',
    'emergency.broadcasted': 'ಪ್ರಸಾರ ಮಾಡಲಾಗಿದೆ',
    'emergency.sister': 'ಸಹೋದರಿ',
    'emergency.partner': 'ಜೊತೆಗಾರ',
    'emergency.police': 'ಪೊಲೀಸ್ ನಿಯಂತ್ರಣ ಕೊಠಡಿ 112',
    'emergency.liveLocation': 'ಲೈವ್ GPS ಪ್ರಸಾರ',
    'emergency.liveGps': 'ಲೈವ್ GPS • 4 ಮೀ',
    'emergency.audioBuffer': 'ಆಡಿಯೋ ಸಾಕ್ಷಿ ಧ್ವನಿಮುದ್ರಣ',
    'emergency.battery': 'ಬ್ಯಾಟರಿ 84%',
    'emergency.callContact': 'ಸಂಪರ್ಕಕ್ಕೆ ಕರೆ ಮಾಡಿ',
    'emergency.call112': '112 ಗೆ ಕರೆ ಮಾಡಿ',
    'emergency.slideToCancel': 'ತುರ್ತು ರದ್ದುಗೊಳಿಸಲು ಸ್ಲೈಡ್ ಮಾಡಿ ››',
    'emergency.cancelTitle': 'ತುರ್ತು ಎಚ್ಚರಿಕೆಯನ್ನು ರದ್ದುಗೊಳಿಸಿ',
    'emergency.enterPasscode': 'ಆಪತ್ಕಾಲ ರದ್ದುಗೊಳಿಸಲು ನಿಮ್ಮ 4-ಅಂಕಿಯ ಪಾಸ್‌ಕೋಡ್ ನಮೂದಿಸಿ',
    'emergency.incorrectPasscode': 'ತಪ್ಪು ಪಾಸ್‌ಕೋಡ್. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ.',
    'emergency.verifiedStandingDown': 'ಪಾಸ್‌ಕೋಡ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ತುರ್ತು ಮುಕ್ತಾಯಗೊಳ್ಳುತ್ತಿದೆ...',
    'emergency.voiceTrigger': 'ಧ್ವನಿ',

    // Map Screen
    'map.routeTitle': 'RRCE ➔ ಮನೆ (ಕೆಂಗೇರಿ)',
    'map.routeSubtitle': '5.2 ಕಿಮೀ • 14 ನಿಮಿಷ (ಮೈಸೂರು ರಸ್ತೆ / NH275)',
    'map.safeRoute': 'ಸುರಕ್ಷಿತ ಮಾರ್ಗ',
    'map.startNav': 'ನ್ಯಾವಿಗೇಷನ್ ಪ್ರಾರಂಭಿಸಿ • 14 ನಿಮಿಷ',
    'map.exitNav': 'ನ್ಯಾವಿಗೇಷನ್‌ನಿಂದ ನಿರ್ಗಮಿಸಿ',
    'map.turnRight': 'ಮೈಸೂರು ರಸ್ತೆಯಲ್ಲಿ ಬಲಕ್ಕೆ ತಿರುಗಿ (NH275)',
    'map.turnDetail': '150 ಮೀಟರ್‌ನಲ್ಲಿ • 5.2 ಕಿಮೀ ಬಾಕಿ (14 ನಿಮಿಷ)',
    'map.centerLocation': 'ಪ್ರಸ್ತುತ ಸ್ಥಳಕ್ಕೆ ಕೇಂದ್ರೀಕರಿಸಿ',
    'map.safePoint': 'ಪರಿಶೀಲಿಸಲಾದ ಸುರಕ್ಷಿತ ಸ್ಥಳ',
    'map.cautionPoint': 'ಎಚ್ಚರಿಕೆ / ಅಪಾಯದ ಸೂಚನೆ',
    'map.call': 'ಕರೆ ಮಾಡಿ',
    'map.dismiss': 'ತೆಗೆದುಹಾಕಿ',
    'map.rrceStart': 'RRCE (ಪ್ರಾರಂಭ)',
    'map.home': 'ಮನೆ',

    // My Safety Screen
    'safety.title': 'ನನ್ನ ಸುರಕ್ಷತೆ',
    'safety.subtitle': 'ತುರ್ತು ಸಂರಚನೆ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹ ವಲಯ',
    'safety.trustedContacts': 'ವಿಶ್ವಾಸಾರ್ಹ ಸಂಪರ್ಕಗಳು',
    'safety.manage': 'ನಿರ್ವಹಿಸಿ',
    'safety.alertsActive': 'ಎಚ್ಚರಿಕೆ ಸಕ್ರಿಯ',
    'safety.instantTriggers': 'ತ್ವರಿತ ಪ್ರಚೋದಕಗಳು',
    'safety.voiceSos': 'ಧ್ವನಿ SOS',
    'safety.voiceActive': 'ಸಕ್ರಿಯ: "ಕಾಪಾಡಿ"',
    'safety.tapSetup': 'ಹೊಂದಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
    'safety.shakeDetection': 'ಶೇಕ್ ಪತ್ತೆ',
    'safety.criticalAlerts': 'ನಿರ್ಣಾಯಕ ಎಚ್ಚರಿಕೆಗಳು',
    'safety.highPriority': 'ಹೆಚ್ಚಿನ ಆದ್ಯತೆಯ ಓವರ್‌ರೈಡ್',
    'safety.safeguards': 'ವೈಯಕ್ತಿಕ ಸುರಕ್ಷತಾ ಸಾಧನಗಳು',
    'safety.safetyTimer': 'ಸುರಕ್ಷತಾ ಚೆಕ್-ಇನ್ ಟೈಮರ್',
    'safety.fakeCall': 'ನಕಲಿ ಕರೆ ಸೋಗು',
    'safety.pinProtection': 'ತುರ್ತು PIN ರಕ್ಷಣೆ',
    'safety.recordingPrefs': 'ರೆಕಾರ್ಡಿಂಗ್ ಆದ್ಯತೆಗಳು',
    'safety.evidenceVault': 'ಸಾಕ್ಷಿ ವಾಲ್ಟ್',
    'safety.incidentReports': 'ಘಟನೆ ವರದಿಗಳು',
    'safety.changeLang': 'ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆ ಬದಲಾಯಿಸಿ',
    'safety.recordsEvidence': 'ದಾಖಲೆಗಳು ಮತ್ತು ಸಾಕ್ಷ್ಯಗಳು',
    'safety.ambientAudioGps': 'ಪರಿಸರ ಆಡಿಯೋ ಮತ್ತು GPS ಟ್ರ್ಯಾಕಿಂಗ್',
    'safety.audioGps': 'ಆಡಿಯೋ ಮತ್ತು GPS',
    'safety.historicalLogs': 'ಹಿಂದಿನ ತುರ್ತು ದಾಖಲೆಗಳು',
    'safety.noneLogged': 'ಯಾವುದೂ ದಾಖಲಾಗಿಲ್ಲ',
    'safety.encryptedRepo': 'ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾದ ರೆಕಾರ್ಡಿಂಗ್‌ಗಳ ಸಂಗ್ರಹ',
    'safety.zeroRecordings': '0 ರೆಕಾರ್ಡಿಂಗ್‌ಗಳು',
    'safety.autoCheckinAlert': 'ಸ್ವಯಂಚಾಲಿತ ಚೆಕ್-ಇನ್ ಎಚ್ಚರಿಕೆ',
    'safety.off': 'ಆಫ್',
    'safety.ready': 'ಸಿದ್ಧ',
    'safety.active': 'ಸಕ್ರಿಯ',
    'safety.configured': 'ಕಾನ್ಫಿಗರ್ ಮಾಡಲಾಗಿದೆ',
    'safety.fakeCallDesc': 'ಸುರಕ್ಷಿತವಾಗಿ ನಿರ್ಗಮಿಸಲು ಒಳಬರುವ ಕರೆಯನ್ನು ಅನುಕರಿಸಿ',
    'safety.pinRequiredDesc': 'ಸಕ್ರಿಯ SOS ರದ್ದುಗೊಳಿಸಲು ಅಗತ್ಯವಿದೆ',
    'safety.sister': 'ಸಹೋದರಿ',
    'safety.partner': 'ಜೊತೆಗಾರ',
    'safety.done': 'ಮುಗಿದಿದೆ',

    // Devices Screen
    'devices.title': 'ಸಾಧನಗಳು',
    'devices.subtitle': 'ಸಂಪರ್ಕಿತ ಸುರಕ್ಷತಾ ಸಾಧನಗಳು',
    'devices.pairDevice': 'ಸಾಧನ ಜೋಡಿಸಿ',
    'devices.pairADevice': 'ಸಾಧನವನ್ನು ಜೋಡಿಸಿ',
    'devices.noDevices': 'ಯಾವುದೇ ಸಾಧನ ಸಂಪರ್ಕಗೊಂಡಿಲ್ಲ',
    'devices.noDevicesDesc': 'ಫೋನ್ ದೂರವಿದ್ದಾಗ ತಕ್ಷಣದ ಸ್ಪರ್ಶ SOS ಪ್ರಚೋದನೆಗಾಗಿ ಸ್ಮಾರ್ಟ್‌ವಾಚ್ ಅಥವಾ ಸುರಕ್ಷತಾ ಬೀಕನ್ ಜೋಡಿಸಿ.',
    'devices.pairedHardware': 'ಜೋಡಿಸಲಾದ ಯಂತ್ರಾಂಶ',
    'devices.synced': 'ಸಿಂಕ್ ಮಾಡಲಾಗಿದೆ',
    'devices.justNow': 'ಈಗಷ್ಟೇ',
    'devices.twoMinAgo': '2 ನಿಮಿಷಗಳ ಹಿಂದೆ',
    'devices.connected': 'ಸಂಪರ್ಕಗೊಂಡಿದೆ',
    'devices.disconnected': 'ಸಂಪರ್ಕ ಕಡಿತಗೊಂಡಿದೆ',
    'devices.notResponding': 'ಪ್ರತಿಕ್ರಿಯಿಸುತ್ತಿಲ್ಲ',
    'devices.alerts': 'ಸಾಧನ ಎಚ್ಚರಿಕೆಗಳು',
    'devices.lowBattery': 'ಕಡಿಮೆ ಬ್ಯಾಟರಿ ಎಚ್ಚರಿಕೆ',
    'devices.lowBatteryDesc': 'ಸಾಧನದ ಬ್ಯಾಟರಿ 20% ಕ್ಕಿಂತ ಕಡಿಮೆಯಾದಾಗ ಎಚ್ಚರಿಸಿ',
    'devices.disconnectAlert': 'ಸಂಪರ್ಕ ಕಡಿತ ಎಚ್ಚರಿಕೆ',
    'devices.disconnectAlertDesc': 'ಬ್ಲೂಟೂತ್ ಸಂಪರ್ಕ ಅನಿರೀಕ್ಷಿತವಾಗಿ ಕಡಿತಗೊಂಡರೆ ತಿಳಿಸಿ',
    'devices.syncStatus': 'ಸಿಂಕ್ ಸ್ಥಿತಿ ಎಚ್ಚರಿಕೆಗಳು',
    'devices.syncStatusDesc': 'ಬೀಕನ್ 1 ಗಂಟೆಗೂ ಹೆಚ್ಚು ಕಾಲ ಸಿಂಕ್ ಆಗದಿದ್ದರೆ ತಿಳಿಸಿ',
    'devices.preferences': 'ಸಾಧನ ಆದ್ಯತೆಗಳು',
    'devices.primaryTrigger': 'ಪ್ರಾಥಮಿಕ SOS ಪ್ರಚೋದಕ',
    'devices.wearableHaptics': 'ಧರಿಸಬಹುದಾದ ಕಂಪನಗಳು',
    'devices.wearableHapticsDesc': 'ಎಚ್ಚರಿಕೆ ದೃಢೀಕರಣದಲ್ಲಿ ಸಾಧನವನ್ನು ಕಂಪಿಸಿ',
    'devices.autoReconnect': 'ಸ್ವಯಂ-ಮರುಸಂಪರ್ಕ',
    'devices.autoReconnectDesc': 'ವ್ಯಾಪ್ತಿಗೆ ಬಂದಾಗ ಸಂಪರ್ಕವನ್ನು ಮರುಸ್ಥಾಪಿಸಿ',
    'devices.btLinked': 'ಬ್ಲೂಟೂತ್ 5.3 ಕಡಿಮೆ ಶಕ್ತಿ • ಲಿಂಕ್ ಮಾಡಲಾಗಿದೆ',
    'devices.battery': 'ಬ್ಯಾಟರಿ',
    'devices.charged': 'ಚಾರ್ಜ್ ಆಗಿದೆ',
    'devices.status': 'ಸ್ಥಿತಿ',
    'devices.setPrimary': 'ಪ್ರಾಥಮಿಕ SOS ಪ್ರಚೋದಕವಾಗಿ ಹೊಂದಿಸಿ',
    'devices.unpair': 'ಸಾಧನ ಸಂಪರ್ಕ ಕಡಿತಗೊಳಿಸಿ',
    'devices.unpairConfirmTitle': 'ಅನ್‌ಪೇರ್ ಮಾಡಿ',
    'devices.unpairDesc': 'ಈ ಧರಿಸಬಹುದಾದ ಸಾಧನವು ಇನ್ನು ಮುಂದೆ ತುರ್ತು SOS ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪ್ರಾರಂಭಿಸಲು ಸಾಧ್ಯವಾಗುವುದಿಲ್ಲ.',
    'devices.cancel': 'ರದ್ದುಮಾಡಿ',
    'devices.pairSheetTitle': 'ಸುರಕ್ಷತಾ ಸಾಧನ ಜೋಡಿಸಿ',
    'devices.scanning': 'ಹತ್ತಿರದ ಯಂತ್ರಾಂಶಕ್ಕಾಗಿ ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
    'devices.selectToConnect': 'ಸಂಪರ್ಕಿಸಲು ಸಾಧನವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    'devices.readyToPair': 'ಹತ್ತಿರದಲ್ಲಿದೆ • ಜೋಡಿಸಲು ಸಿದ್ಧ',
    'devices.beaconDiscovered': 'ಹತ್ತಿರದಲ್ಲಿದೆ • ಬೀಕನ್ ಪತ್ತೆಯಾಗಿದೆ',
    'devices.connect': 'ಸಂಪರ್ಕಿಸಿ',
    'devices.pairHint': 'ನಿಮ್ಮ ಸಾಧನದಲ್ಲಿ ಬ್ಲೂಟೂತ್ ಆನ್ ಆಗಿರುವುದನ್ನು ಮತ್ತು 1 ಮೀಟರ್ ಒಳಗೆ ಇರುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
    'devices.auraWatch': 'ಔರಾ ವಾಚ್ ಸರಣಿ 2',
    'devices.safetyTag': 'ಸುರಕ್ಷತಾ ಕೀಚೈನ್ ಟ್ಯಾಗ್',
  },

  te: {
    // Navigation
    'nav.home': 'హోమ్',
    'nav.map': 'మ్యాప్',
    'nav.safety': 'నా రక్షణ',
    'nav.devices': 'పరికరాలు',

    // Home Screen
    'home.sos': 'SOS',
    'home.holdSos': 'SOS కోసం పట్టి ఉంచండి',
    'home.releaseCancel': 'రద్దు చేయడానికి విడుదల చేయండి',
    'home.systemReady': 'అత్యవసర వ్యవస్థ సక్రియంగా ఉంది • హ్యాండ్స్-ఫ్రీ వాయిస్ రక్షణ',
    'home.selectLang': 'భాషను ఎంచుకోండి',
    'home.deviceReady': 'పరికరం సిద్ధంగా ఉంది',

    // Emergency Screen
    'emergency.modeActive': 'అత్యవసర మోడ్ సక్రియంగా ఉంది',
    'emergency.dispatchStatus': 'డిస్పాచ్ స్థితి',
    'emergency.smsSent': 'SMS పంపబడింది',
    'emergency.calling': 'వాయిస్ కాల్ జరుగుతోంది',
    'emergency.initiating': 'ప్రారంభిస్తోంది',
    'emergency.sosSent': 'SOS పంపబడింది',
    'emergency.smsDispatched': 'SMS పంపబడింది',
    'emergency.voiceCall': 'వాయిస్ కాల్',
    'emergency.recipients': 'సమాచారం అందించిన పరిచయాలు',
    'emergency.delivered': 'డెలివరీ అయింది',
    'emergency.broadcasted': 'ప్రసారం చేయబడింది',
    'emergency.sister': 'సోదరి',
    'emergency.partner': 'భాగస్వామి',
    'emergency.police': 'పోలీస్ కంట్రోల్ రూమ్ 112',
    'emergency.liveLocation': 'లైవ్ GPS ప్రసారం',
    'emergency.liveGps': 'లైవ్ GPS • 4 మీ',
    'emergency.audioBuffer': 'ఆడియో సాక్ష్య రికార్డింగ్',
    'emergency.battery': 'బ్యాటరీ 84%',
    'emergency.callContact': 'పరిచయానికి కాల్ చేయండి',
    'emergency.call112': '112 కు కాల్ చేయండి',
    'emergency.slideToCancel': 'అత్యవసర పరిస్థితిని రద్దు చేయడానికి స్లైడ్ చేయండి ››',
    'emergency.cancelTitle': 'అత్యవసర హెచ్చరికను రద్దు చేయండి',
    'emergency.enterPasscode': 'ఎమర్జెన్సీ రద్దు చేయడానికి మీ 4-అంకెల పాస్‌కోడ్‌ను నమోదు చేయండి',
    'emergency.incorrectPasscode': 'తప్పు పాస్‌కోడ్. దయచేసి మళ్ళీ ప్రయత్నించండి.',
    'emergency.verifiedStandingDown': 'పాస్‌కోడ్ ధృవీకరించబడింది. ముగుస్తోంది...',
    'emergency.voiceTrigger': 'వాయిస్',

    // Map Screen
    'map.routeTitle': 'RRCE ➔ ఇల్లు (కెంగేరి)',
    'map.routeSubtitle': '5.2 కి.మీ • 14 నిమిషాలు (మైసూర్ రోడ్ / NH275)',
    'map.safeRoute': 'రక్షిత మార్గం',
    'map.startNav': 'నావిగేషన్ ప్రారంభించండి • 14 నిమిషాలు',
    'map.exitNav': 'నావిగేషన్ నుండి నిష్క్రమించండి',
    'map.turnRight': 'మైసూర్ రోడ్ (NH275) పై కుడివైపు తిరగండి',
    'map.turnDetail': '150 మీటర్లలో • 5.2 కి.మీ మిగిలి ఉంది (14 నిమిషాలు)',
    'map.centerLocation': 'ప్రస్తుత స్థానానికి కేంద్రీకరించండి',
    'map.safePoint': 'ధృవీకరించబడిన సురక్షిత స్థానం',
    'map.cautionPoint': 'హెచ్చరిక / ప్రమాద సూచన',
    'map.call': 'కాల్ చేయండి',
    'map.dismiss': 'తీసివేయండి',
    'map.rrceStart': 'RRCE (ప్రారంభం)',
    'map.home': 'ఇల్లు',

    // My Safety Screen
    'safety.title': 'నా రక్షణ',
    'safety.subtitle': 'అత్యవసర కాన్ఫిగరేషన్ మరియు విశ్వసనీయ పరిచయాలు',
    'safety.trustedContacts': 'విశ్వసనీయ పరిచయాలు',
    'safety.manage': 'నిర్వహించండి',
    'safety.alertsActive': 'హెచ్చరికలు సక్రియంగా ఉన్నాయి',
    'safety.instantTriggers': 'తక్షణ ట్రిగ్గర్లు',
    'safety.voiceSos': 'వాయిస్ SOS',
    'safety.voiceActive': 'సక్రియం: "సహాయం"',
    'safety.tapSetup': 'సెటప్ చేయడానికి నొక్కండి',
    'safety.shakeDetection': 'షేక్ డిటెక్షన్',
    'safety.criticalAlerts': 'కీలకమైన హెచ్చరికలు',
    'safety.highPriority': 'అధిక ప్రాధాన్యత ఓవర్‌రైడ్',
    'safety.safeguards': 'వ్యక్తిగత భద్రతా సాధనాలు',
    'safety.safetyTimer': 'భద్రతా చెక్-ఇన్ టైమర్',
    'safety.fakeCall': 'నకిలీ కాల్ మోసపూరిత సాధనం',
    'safety.pinProtection': 'అత్యవసర PIN రక్షణ',
    'safety.recordingPrefs': 'రికార్డింగ్ ప్రాధాన్యతలు',
    'safety.evidenceVault': 'సాక్ష్యాల వాల్ట్',
    'safety.incidentReports': 'సంఘటన నివేదికలు',
    'safety.changeLang': 'యాప్ భాషను మార్చండి',
    'safety.recordsEvidence': 'రికార్డులు మరియు సాక్ష్యాలు',
    'safety.ambientAudioGps': 'పరిసర ఆడియో మరియు GPS ట్రాకింగ్',
    'safety.audioGps': 'ఆడియో మరియు GPS',
    'safety.historicalLogs': 'గత అత్యవసర లాగ్‌లు',
    'safety.noneLogged': 'ఏదీ నమోదు కాలేదు',
    'safety.encryptedRepo': 'ఎన్‌క్రిప్ట్ చేయబడిన రికార్డింగ్‌ల నిల్వ',
    'safety.zeroRecordings': '0 రికార్డింగ్‌లు',
    'safety.autoCheckinAlert': 'ఆటోమేటిక్ చెక్-ఇన్ హెచ్చరిక',
    'safety.off': 'ఆఫ్',
    'safety.ready': 'సిద్ధం',
    'safety.active': 'సక్రియం',
    'safety.configured': 'కాన్ఫిగర్ చేయబడింది',
    'safety.fakeCallDesc': 'సురక్షితంగా బయటపడటానికి నకిలీ కాల్‌ను అనుకరించండి',
    'safety.pinRequiredDesc': 'సక్రియ SOS రద్దు చేయడానికి అవసరం',
    'safety.sister': 'సోదరి',
    'safety.partner': 'భాగస్వామి',
    'safety.done': 'పూర్తయింది',

    // Devices Screen
    'devices.title': 'పరికరాలు',
    'devices.subtitle': 'కనెక్ట్ చేయబడిన భద్రతా పరికరాలు',
    'devices.pairDevice': 'పరికరాన్ని జత చేయండి',
    'devices.pairADevice': 'పరికరాన్ని జత చేయండి',
    'devices.noDevices': 'పరికరాలు ఏవీ కనెక్ట్ కాలేదు',
    'devices.noDevicesDesc': 'ఫోన్ దూరంగా ఉన్నప్పుడు తక్షణ SOS కోసం స్మార్ట్‌వాచ్ లేదా భద్రతా బీకన్‌ను జత చేయండి.',
    'devices.pairedHardware': 'జత చేయబడిన హార్డ్‌వేర్',
    'devices.synced': 'సింక్ చేయబడింది',
    'devices.justNow': 'ఇప్పుడే',
    'devices.twoMinAgo': '2 నిమిషాల క్రితం',
    'devices.connected': 'కనెక్ట్ అయింది',
    'devices.disconnected': 'డిస్‌కనెక్ట్ అయింది',
    'devices.notResponding': 'స్పందించడం లేదు',
    'devices.alerts': 'పరికర హెచ్చరికలు',
    'devices.lowBattery': 'తక్కువ బ్యాటరీ హెచ్చరిక',
    'devices.lowBatteryDesc': 'పరికర బ్యాటరీ 20% కంటే తగ్గితే హెచ్చరించండి',
    'devices.disconnectAlert': 'డిస్‌కనెక్ట్ హెచ్చరిక',
    'devices.disconnectAlertDesc': 'బ్లూటూత్ కనెక్షన్ అనుకోకుండా తెగిపోతే తెలియజేయండి',
    'devices.syncStatus': 'సింక్ స్థితి హెచ్చరికలు',
    'devices.syncStatusDesc': 'బీకన్ 1 గంట దాటినా చెక్-ఇన్ కాకపోతే తెలియజేయండి',
    'devices.preferences': 'పరికర ప్రాధాన్యతలు',
    'devices.primaryTrigger': 'ప్రాథమిక SOS ట్రిగ్గర్',
    'devices.wearableHaptics': 'ధరించగలిగే హాప్టిక్స్',
    'devices.wearableHapticsDesc': 'హెచ్చరిక నిర్ధారణపై పరికరాన్ని వైబ్రేట్ చేయండి',
    'devices.autoReconnect': 'ఆటో-రీకనెక్ట్',
    'devices.autoReconnectDesc': 'పరిధిలోకి వచ్చినప్పుడు కనెక్షన్‌ను పునరుద్ధరించండి',
    'devices.btLinked': 'బ్లూటూత్ 5.3 లో ఎనర్జీ • లింక్ చేయబడింది',
    'devices.battery': 'బ్యాటరీ',
    'devices.charged': 'ఛార్జ్ అయింది',
    'devices.status': 'స్థితి',
    'devices.setPrimary': 'ప్రాథమిక SOS ట్రిగ్గర్‌గా సెట్ చేయండి',
    'devices.unpair': 'పరికరాన్ని అన్‌పెయిర్ చేయండి',
    'devices.unpairConfirmTitle': 'అన్‌పెయిర్ చేయండి',
    'devices.unpairDesc': 'ఈ ధరించదగిన పరికరం ఇకపై అత్యవసర SOS హెచ్చరికలను పంపదు.',
    'devices.cancel': 'రద్దు చేయండి',
    'devices.pairSheetTitle': 'భద్రతా పరికరాన్ని జత చేయండి',
    'devices.scanning': 'సమీపంలోని హార్డ్‌వేర్ కోసం స్కాన్ చేస్తోంది...',
    'devices.selectToConnect': 'కనెక్ట్ చేయడానికి పరికరాన్ని ఎంచుకోండి',
    'devices.readyToPair': 'సమీపంలో ఉంది • జత చేయడానికి సిద్ధం',
    'devices.beaconDiscovered': 'సమీపంలో ఉంది • బీకన్ కనుగొనబడింది',
    'devices.connect': 'కనెక్ట్ చేయండి',
    'devices.pairHint': 'మీ అనుబంధ పరికరంలో బ్లూటూత్ ఆన్‌లో ఉందని, 1 మీటరు లోపల ఉందని నిర్ధారించుకోండి.',
    'devices.auraWatch': 'ఆరా వాచ్ సిరీస్ 2',
    'devices.safetyTag': 'భద్రతా కీచైన్ ట్యాగ్',
  },

  ta: {
    // Navigation
    'nav.home': 'முகப்பு',
    'nav.map': 'வரைபடம்',
    'nav.safety': 'என் பாதுகாப்பு',
    'nav.devices': 'சாதனங்கள்',

    // Home Screen
    'home.sos': 'SOS',
    'home.holdSos': 'SOSக்கு அழுத்திப் பிடிக்கவும்',
    'home.releaseCancel': 'ரத்து செய்ய விடுங்கள்',
    'home.systemReady': 'அவசர அமைப்பு செயலில் உள்ளது • ஹேண்ட்ஸ்-ஃப்ரீ குரல் பாதுகாப்பு',
    'home.selectLang': 'மொழியைத் தேர்ந்தெடுக்கவும்',
    'home.deviceReady': 'சாதனம் தயார்',

    // Emergency Screen
    'emergency.modeActive': 'அவசர நிலை செயலில் உள்ளது',
    'emergency.dispatchStatus': 'அனுப்பும் நிலை',
    'emergency.smsSent': 'SMS அனுப்பப்பட்டது',
    'emergency.calling': 'குரல் அழைப்பு நடக்கிறது',
    'emergency.initiating': 'தொடங்குகிறது',
    'emergency.sosSent': 'SOS அனுப்பப்பட்டது',
    'emergency.smsDispatched': 'SMS அனுப்பப்பட்டது',
    'emergency.voiceCall': 'குரல் அழைப்பு',
    'emergency.recipients': 'அறிவிக்கப்பட்ட தொடர்புகள்',
    'emergency.delivered': 'வழங்கப்பட்டது',
    'emergency.broadcasted': 'ஒளிபரப்பப்பட்டது',
    'emergency.sister': 'சகோதரி',
    'emergency.partner': 'துணைவர்',
    'emergency.police': 'காவல்துறை கட்டுப்பாட்டு அறை 112',
    'emergency.liveLocation': 'நேரலை GPS ஒளிபரப்பு',
    'emergency.liveGps': 'நேரலை GPS • 4 மீ',
    'emergency.audioBuffer': 'ஆடியோ சான்று பதிவு',
    'emergency.battery': 'பேட்டரி 84%',
    'emergency.callContact': 'தொடர்பை அழைக்கவும்',
    'emergency.call112': '112 ஐ அழைக்கவும்',
    'emergency.slideToCancel': 'அவசரநிலையை ரத்து செய்ய ஸ்லைடு செய்யவும் ››',
    'emergency.cancelTitle': 'அவசர எச்சரிக்கையை ரத்துசெய்',
    'emergency.enterPasscode': 'அவசரநிலையை ரத்து செய்ய உங்கள் 4-இலக்க கடவுக்குறியீட்டை உள்ளிடவும்',
    'emergency.incorrectPasscode': 'தவறான கடவுக்குறியீடு. மீண்டும் முயற்சிக்கவும்.',
    'emergency.verifiedStandingDown': 'கடவுக்குறியீடு சரிபார்க்கப்பட்டது. முடிகிறது...',
    'emergency.voiceTrigger': 'குரல்',

    // Map Screen
    'map.routeTitle': 'RRCE ➔ வீடு (கெங்கேரி)',
    'map.routeSubtitle': '5.2 கிமீ • 14 நிமிடம் (மைசூர் சாலை / NH275)',
    'map.safeRoute': 'பாதுகாப்பான பாதை',
    'map.startNav': 'வழிகாட்டலைத் தொடங்கு • 14 நிமிடம்',
    'map.exitNav': 'வழிகாட்டலில் இருந்து வெளியேறு',
    'map.turnRight': 'மைசூர் சாலையில் வலதுபுறம் திரும்பவும் (NH275)',
    'map.turnDetail': '150 மீட்டரில் • 5.2 கிமீ மீதமுள்ளது (14 நிமிடம்)',
    'map.centerLocation': 'தற்போதைய இடத்தில் நிலைநிறுத்து',
    'map.safePoint': 'சரிபார்க்கப்பட்ட பாதுகாப்பான புள்ளி',
    'map.cautionPoint': 'எச்சரிக்கை / ஆபத்து அறிவிப்பு',
    'map.call': 'அழைக்கவும்',
    'map.dismiss': 'நீக்கு',
    'map.rrceStart': 'RRCE (தொடக்க)',
    'map.home': 'வீடு',

    // My Safety Screen
    'safety.title': 'என் பாதுகாப்பு',
    'safety.subtitle': 'அவசர கட்டமைப்பு மற்றும் நம்பகமான தொடர்புகள்',
    'safety.trustedContacts': 'நம்பகமான தொடர்புகள்',
    'safety.manage': 'நிர்வகி',
    'safety.alertsActive': 'எச்சரிக்கைகள் செயலில் உள்ளன',
    'safety.instantTriggers': 'உடனடி தூண்டுதல்கள்',
    'safety.voiceSos': 'குரல் SOS',
    'safety.voiceActive': 'செயலில்: "காப்பாத்து"',
    'safety.tapSetup': 'அமைக்க தட்டவும்',
    'safety.shakeDetection': 'அதிர்வு கண்டறிதல்',
    'safety.criticalAlerts': 'முக்கிய எச்சரிக்கைகள்',
    'safety.highPriority': 'உயர் முன்னுரிமை மேலெழுத்து',
    'safety.safeguards': 'தனிப்பட்ட பாதுகாப்பு அம்சங்கள்',
    'safety.safetyTimer': 'பாதுகாப்பு செக்-இன் டைமர்',
    'safety.fakeCall': 'போலி அழைப்பு ஏமாற்று சாதனம்',
    'safety.pinProtection': 'அவசர PIN பாதுகாப்பு',
    'safety.recordingPrefs': 'பதிவு விருப்பத்தேர்வுகள்',
    'safety.evidenceVault': 'சான்று பெட்டகம்',
    'safety.incidentReports': 'சம்பவ அறிக்கைகள்',
    'safety.changeLang': 'பயன்பாட்டு மொழியை மாற்றவும்',
    'safety.recordsEvidence': 'பதிவுகள் மற்றும் சான்றுகள்',
    'safety.ambientAudioGps': 'சுற்றுப்புற ஆடியோ மற்றும் GPS கண்காணிப்பு',
    'safety.audioGps': 'ஆடியோ மற்றும் GPS',
    'safety.historicalLogs': 'வரலாற்று அவசர பதிவுகள்',
    'safety.noneLogged': 'பதிவுகள் இல்லை',
    'safety.encryptedRepo': 'குறியாக்கம் செய்யப்பட்ட பதிவுகளின் களஞ்சியம்',
    'safety.zeroRecordings': '0 பதிவுகள்',
    'safety.autoCheckinAlert': 'தானியங்கி செக்-இன் எச்சரிக்கை',
    'safety.off': 'முடக்கம்',
    'safety.ready': 'தயார்',
    'safety.active': 'செயலில்',
    'safety.configured': 'கட்டமைக்கப்பட்டது',
    'safety.fakeCallDesc': 'பாதுகாப்பாக வெளியேற போலி அழைப்பை உருவகப்படுத்தவும்',
    'safety.pinRequiredDesc': 'செயலில் உள்ள SOSஐ ரத்து செய்ய தேவை',
    'safety.sister': 'சகோதரி',
    'safety.partner': 'துணைவர்',
    'safety.done': 'முடிந்தது',

    // Devices Screen
    'devices.title': 'சாதனங்கள்',
    'devices.subtitle': 'இணைக்கப்பட்ட பாதுகாப்பு சாதனங்கள்',
    'devices.pairDevice': 'சாதனத்தை இணைக்கவும்',
    'devices.pairADevice': 'ஒரு சாதனத்தை இணைக்கவும்',
    'devices.noDevices': 'சாதனங்கள் எதுவும் இணைக்கப்படவில்லை',
    'devices.noDevicesDesc': 'தொலைபேசி எட்டாதபோது உடனடி SOS தூண்டுதலுக்கு ஸ்மார்ட்வாட்ச் அல்லது பாதுகாப்பு பீக்கானை இணைக்கவும்.',
    'devices.pairedHardware': 'இணைக்கப்பட்ட வன்பொருள்',
    'devices.synced': 'ஒத்திசைக்கப்பட்டது',
    'devices.justNow': 'இப்போதுதான்',
    'devices.twoMinAgo': '2 நிமிடங்களுக்கு முன்',
    'devices.connected': 'இணைக்கப்பட்டது',
    'devices.disconnected': 'துண்டிக்கப்பட்டது',
    'devices.notResponding': 'பதிலளிக்கவில்லை',
    'devices.alerts': 'சாதன எச்சரிக்கைகள்',
    'devices.lowBattery': 'குறைந்த பேட்டரி எச்சரிக்கை',
    'devices.lowBatteryDesc': 'சாதன பேட்டரி 20%க்குக் குறையும்போது எச்சரிக்கவும்',
    'devices.disconnectAlert': 'துண்டிப்பு எச்சரிக்கை',
    'devices.disconnectAlertDesc': 'புளூடூத் இணைப்பு எதிர்பாராமல் துண்டிக்கப்பட்டால் அறிவிக்கவும்',
    'devices.syncStatus': 'ஒத்திசைவு நிலை எச்சரிக்கைகள்',
    'devices.syncStatusDesc': 'பீக்கான் 1 மணி நேரத்திற்கு மேல் சரிபார்க்கத் தவறினால் அறிவிக்கவும்',
    'devices.preferences': 'சாதன விருப்பத்தேர்வுகள்',
    'devices.primaryTrigger': 'முதன்மை SOS தூண்டுதல்',
    'devices.wearableHaptics': 'அணியக்கூடிய அதிர்வுகள்',
    'devices.wearableHapticsDesc': 'எச்சரிக்கை உறுதிப்படுத்தலில் சாதனத்தை அதிர்வு செய்யவும்',
    'devices.autoReconnect': 'தானியங்கி மறுஇணைப்பு',
    'devices.autoReconnectDesc': 'வரம்பிற்குள் வரும்போது இணைப்பை மீட்டமைக்கவும்',
    'devices.btLinked': 'புளூடூத் 5.3 குறைந்த ஆற்றல் • இணைக்கப்பட்டது',
    'devices.battery': 'பேட்டரி',
    'devices.charged': 'மின்னூட்டப்பட்டது',
    'devices.status': 'நிலை',
    'devices.setPrimary': 'முதன்மை SOS தூண்டுதலாக அமை',
    'devices.unpair': 'சாதன இணைப்பை நீக்கு',
    'devices.unpairConfirmTitle': 'இணைப்பை நீக்கு',
    'devices.unpairDesc': 'இந்த அணியக்கூடிய சாதனம் இனி அவசர SOS எச்சரிக்கைகளை அனுப்ப முடியாது.',
    'devices.cancel': 'ரத்துசெய்',
    'devices.pairSheetTitle': 'பாதுகாப்பு சாதனத்தை இணைக்கவும்',
    'devices.scanning': 'அருகிலுள்ள வன்பொருளைத் தேடுகிறது...',
    'devices.selectToConnect': 'இணைக்க ஒரு சாதனத்தைத் தேர்ந்தெடுக்கவும்',
    'devices.readyToPair': 'அருகில் • இணைக்க தயார்',
    'devices.beaconDiscovered': 'அருகில் • பீக்கான் கண்டறியப்பட்டது',
    'devices.connect': 'இணைக்கவும்',
    'devices.pairHint': 'உங்கள் சாதனத்தில் புளூடூத் இயக்கத்தில் இருப்பதையும் 1 மீட்டருக்குள் இருப்பதையும் உறுதிசெய்யவும்.',
    'devices.auraWatch': 'ஆரா வாட்ச் தொடர் 2',
    'devices.safetyTag': 'பாதுகாப்பு சாவிக்கொத்து டேக்',
  },
};

const STORAGE_KEY_LANG = 'safealert_user_language';

type LanguageListener = (lang: SupportedLanguage) => void;

class I18nService {
  private currentLanguage: SupportedLanguage = 'en';
  private listeners = new Set<LanguageListener>();
  private isModalOpen = false;
  private modalListeners = new Set<(isOpen: boolean) => void>();

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_LANG) as SupportedLanguage;
        if (saved && TRANSLATIONS[saved]) {
          this.currentLanguage = saved;
        }
      } catch {}
    }
  }

  public getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  public setLanguage(lang: SupportedLanguage) {
    if (this.currentLanguage === lang) return;
    this.currentLanguage = lang;
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch {}
    this.notify();
  }

  public t(key: string, fallback?: string): string {
    const dict = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.en;
    if (dict && dict[key]) {
      return dict[key];
    }
    const fallbackDict = TRANSLATIONS.en;
    if (fallbackDict && fallbackDict[key]) {
      return fallbackDict[key];
    }
    return fallback || key;
  }

  public getModalOpen(): boolean {
    return this.isModalOpen;
  }

  public openModal(): void {
    this.isModalOpen = true;
    this.notifyModal();
  }

  public closeModal(): void {
    this.isModalOpen = false;
    this.notifyModal();
  }

  public subscribeModal(listener: (isOpen: boolean) => void): () => void {
    this.modalListeners.add(listener);
    listener(this.isModalOpen);
    return () => {
      this.modalListeners.delete(listener);
    };
  }

  private notifyModal() {
    this.modalListeners.forEach((cb) => {
      try {
        cb(this.isModalOpen);
      } catch (e) {
        console.error('[I18N] Modal listener error:', e);
      }
    });
  }

  public subscribe(listener: LanguageListener): () => void {
    this.listeners.add(listener);
    listener(this.currentLanguage);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb(this.currentLanguage);
      } catch (e) {
        console.error('[I18N] Listener error:', e);
      }
    });
  }
}

export const i18n = new I18nService();

export function useTranslation() {
  const [lang, setLang] = useState<SupportedLanguage>(i18n.getLanguage());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(i18n.getModalOpen());

  useEffect(() => {
    const unsubscribeLang = i18n.subscribe((newLang) => {
      setLang(newLang);
    });
    const unsubscribeModal = i18n.subscribeModal((isOpen) => {
      setIsModalOpen(isOpen);
    });
    return () => {
      unsubscribeLang();
      unsubscribeModal();
    };
  }, []);

  const t = (key: string, fallback?: string) => i18n.t(key, fallback);
  const setLanguage = (newLang: SupportedLanguage) => i18n.setLanguage(newLang);
  const openLanguageModal = () => i18n.openModal();
  const closeLanguageModal = () => i18n.closeModal();

  return {
    t,
    language: lang,
    setLanguage,
    languages: SUPPORTED_LANGUAGES,
    isLanguageModalOpen: isModalOpen,
    openLanguageModal,
    closeLanguageModal,
  };
}

