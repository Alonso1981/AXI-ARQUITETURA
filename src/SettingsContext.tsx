import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { SiteSettings } from './types';
import { INITIAL_SETTINGS } from './constants';

interface SettingsContextType extends SiteSettings {
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  ...INITIAL_SETTINGS,
  updateSettings: async () => {}
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'settings', 'global'), 
      (doc) => {
        if (doc.exists()) {
          setSettings({ ...INITIAL_SETTINGS, ...doc.data() } as SiteSettings);
        }
      },
      (error) => {
        console.error("Error listening to settings:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      const { updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'settings', 'global'), newSettings);
    } catch (error) {
      console.error("Error updating settings:", error);
      throw error;
    }
  };

  return (
    <SettingsContext.Provider value={{ ...settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
