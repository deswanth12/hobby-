import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FIRM_DATA, FirmProfile } from '../data/firmData';
import { adminStorage, FIRM_DATA_UPDATE_EVENT } from '../services/adminStorage';

interface FirmDataContextType {
  data: FirmProfile;
  reload: () => void;
  isModified: boolean;
}

const FirmDataContext = createContext<FirmDataContextType>({
  data: FIRM_DATA,
  reload: () => {},
  isModified: false,
});

export const FirmDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const computeMergedData = (): { merged: FirmProfile; modified: boolean } => {
    const contentOverrides = adminStorage.getContentOverrides();
    const settingsOverrides = adminStorage.getSettingsOverrides();

    const hasContentMod = Object.keys(contentOverrides.services || {}).length > 0 || Object.keys(contentOverrides.faqs || {}).length > 0;
    const hasSettingsMod = Object.keys(settingsOverrides).length > 0;
    const isModified = hasContentMod || hasSettingsMod;

    // Deep copy baseline
    const base: FirmProfile = JSON.parse(JSON.stringify(FIRM_DATA));

    // Merge settings
    if (settingsOverrides.primaryPhone) {
      base.contact.primaryPhone = settingsOverrides.primaryPhone;
      base.contact.primaryPhoneClean = settingsOverrides.primaryPhone.replace(/[^0-9]/g, '');
    }
    if (settingsOverrides.secondaryPhone) {
      base.contact.secondaryPhone = settingsOverrides.secondaryPhone;
      base.contact.secondaryPhoneClean = settingsOverrides.secondaryPhone.replace(/[^0-9]/g, '');
    }
    if (settingsOverrides.email) {
      base.contact.email = settingsOverrides.email;
    }
    if (settingsOverrides.primaryLocation) {
      base.contact.primaryLocation = settingsOverrides.primaryLocation;
    }
    if (settingsOverrides.googleMapsUrl) {
      base.contact.googleMapsUrl = settingsOverrides.googleMapsUrl;
    }
    if (settingsOverrides.whatsappLink) {
      base.contact.whatsappLink = settingsOverrides.whatsappLink;
    }

    // Merge service content overrides
    if (contentOverrides.services) {
      base.serviceCategories = base.serviceCategories.map((cat) => {
        const override = contentOverrides.services?.[cat.id];
        if (override) {
          return {
            ...cat,
            title: override.title || cat.title,
            shortDescription: override.shortDescription || cat.shortDescription,
            fullDescription: override.fullDescription || cat.fullDescription,
            statutoryFramework: override.statutoryFramework || cat.statutoryFramework,
            targetClients: override.targetClients || cat.targetClients,
          };
        }
        return cat;
      });
    }

    // Merge FAQ content overrides
    if (contentOverrides.faqs) {
      base.faqs = base.faqs.map((faq) => {
        const override = contentOverrides.faqs?.[faq.id];
        if (override) {
          return {
            ...faq,
            question: override.question || faq.question,
            answer: override.answer || faq.answer,
            statuteReference: override.statuteReference || faq.statuteReference,
          };
        }
        return faq;
      });
    }

    return { merged: base, modified: isModified };
  };

  const [{ merged, modified }, setState] = useState(computeMergedData);

  const reload = () => {
    setState(computeMergedData());
  };

  useEffect(() => {
    const handleUpdate = () => {
      reload();
    };

    window.addEventListener(FIRM_DATA_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(FIRM_DATA_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <FirmDataContext.Provider value={{ data: merged, reload, isModified: modified }}>
      {children}
    </FirmDataContext.Provider>
  );
};

export const useFirmData = (): FirmDataContextType => {
  return useContext(FirmDataContext);
};
