import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FIRM_DATA, FirmProfile } from '../data/firmData';
import { adminStorage, FIRM_DATA_UPDATE_EVENT } from '../services/adminStorage';
import { isSafeUrl } from '../lib/markdown';

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
    if (settingsOverrides.googleMapsUrl && isSafeUrl(settingsOverrides.googleMapsUrl)) {
      base.contact.googleMapsUrl = settingsOverrides.googleMapsUrl;
    }
    if (settingsOverrides.whatsappLink && isSafeUrl(settingsOverrides.whatsappLink)) {
      base.contact.whatsappLink = settingsOverrides.whatsappLink;
    }

    // Merge service content overrides
    if (contentOverrides.services) {
      const deletedIds = new Set((contentOverrides.deletedServices || []).map(d => d.id));
      const existingIds = new Set(base.serviceCategories.map(c => c.id));

      // 1. Update existing baseline services
      const mergedExisting = base.serviceCategories
        .filter((cat) => {
          if (deletedIds.has(cat.id)) return false;
          const override = contentOverrides.services?.[cat.id];
          return override ? override.status !== 'draft' : true;
        })
        .map((cat) => {
          const override = contentOverrides.services?.[cat.id];
          if (override) {
            return {
              ...cat,
              title: override.title || cat.title,
              shortDescription: override.shortDescription || cat.shortDescription,
              fullDescription: override.fullDescription || cat.fullDescription,
              statutoryFramework: override.statutoryFramework ?? cat.statutoryFramework,
              targetClients: override.targetClients ?? cat.targetClients,
              typicalScenarios: override.typicalScenarios ?? cat.typicalScenarios,
              services: override.services ?? cat.services,
              iconName: override.iconName ?? cat.iconName,
              order: override.order ?? 999,
            };
          }
          return { ...cat, order: 999 };
        });

      // 2. Add new dynamically created published services
      const dynamicNew = Object.values(contentOverrides.services)
        .filter(s => s && s.id && !existingIds.has(s.id) && !deletedIds.has(s.id) && s.status === 'published')
        .map(s => ({
          id: s.id,
          title: s.title || s.id,
          shortDescription: s.shortDescription || '',
          fullDescription: s.fullDescription || '',
          iconName: s.iconName || 'Briefcase',
          statutoryFramework: s.statutoryFramework,
          targetClients: s.targetClients,
          typicalScenarios: s.typicalScenarios || [],
          services: s.services || [],
          order: s.order ?? 999,
        }));

      base.serviceCategories = [...mergedExisting, ...dynamicNew].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    // Merge FAQ content overrides
    if (contentOverrides.faqs) {
      const deletedFaqIds = new Set((contentOverrides.deletedFaqs || []).map(d => d.id));
      const existingFaqIds = new Set(base.faqs.map(f => f.id));

      // 1. Update existing baseline FAQs
      const mergedExistingFaqs = base.faqs
        .filter((faq) => {
          if (deletedFaqIds.has(faq.id)) return false;
          const override = contentOverrides.faqs?.[faq.id];
          return override ? override.status !== 'draft' : true;
        })
        .map((faq) => {
          const override = contentOverrides.faqs?.[faq.id];
          if (override) {
            return {
              ...faq,
              question: override.question || faq.question,
              answer: override.answer || faq.answer,
              statuteReference: override.statuteReference ?? faq.statuteReference,
              category: (override.category || faq.category) as any,
              serviceIds: override.serviceIds,
              order: override.order ?? 999,
            };
          }
          return { ...faq, order: 999 };
        });

      // 2. Add new dynamically created published FAQs
      const dynamicNewFaqs = Object.values(contentOverrides.faqs)
        .filter(f => f && f.id && !existingFaqIds.has(f.id) && !deletedFaqIds.has(f.id) && f.status === 'published')
        .map(f => ({
          id: f.id,
          category: (f.category || 'Audit & Assurance') as any,
          question: f.question || '',
          answer: f.answer || '',
          statuteReference: f.statuteReference || '',
          serviceIds: f.serviceIds,
          order: f.order ?? 999,
        }));

      base.faqs = [...mergedExistingFaqs, ...dynamicNewFaqs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    return { merged: base, modified: isModified };
  };

  const [{ merged, modified }, setState] = useState(computeMergedData);

  const reload = () => {
    setState(computeMergedData());
  };

  useEffect(() => {
    // Synchronize with shared database on startup
    Promise.all([
      adminStorage.fetchContentRemote(),
      adminStorage.fetchSettingsRemote()
    ]).then(() => {
      reload();
    }).catch(() => {});

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
