import React, { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    soundEnabled: true,
    darkMode: false,
  });

  const handleSettingChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-4">Settings</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="notifications" className="font-medium">Notifications</label>
            <p className="text-sm text-gray-500">Receive notifications for new messages</p>
          </div>
          <input
            type="checkbox"
            id="notifications"
            checked={settings.notifications}
            onChange={() => handleSettingChange('notifications')}
            className="w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="soundEnabled" className="font-medium">Sound Effects</label>
            <p className="text-sm text-gray-500">Play sound when messages are received</p>
          </div>
          <input
            type="checkbox"
            id="soundEnabled"
            checked={settings.soundEnabled}
            onChange={() => handleSettingChange('soundEnabled')}
            className="w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="darkMode" className="font-medium">Dark Mode</label>
            <p className="text-sm text-gray-500">Enable dark mode for the application</p>
          </div>
          <input
            type="checkbox"
            id="darkMode"
            checked={settings.darkMode}
            onChange={() => handleSettingChange('darkMode')}
            className="w-6 h-6 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
