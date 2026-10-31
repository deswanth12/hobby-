import fs from 'fs';

// 1. UPDATE AdminContentPage.tsx
const contentPagePath = 'src/pages/admin/AdminContentPage.tsx';
let contentCode = fs.readFileSync(contentPagePath, 'utf8');

// Ensure useLocation is imported from react-router-dom
if (!contentCode.includes('useLocation')) {
  contentCode = contentCode.replace(
    /import React, { useState, useEffect, useMemo } from 'react';/,
    "import React, { useState, useEffect, useMemo } from 'react';\nimport { useLocation } from 'react-router-dom';"
  );
}

// Add interface and update component signature
if (!contentCode.includes('interface AdminContentPageProps')) {
  contentCode = contentCode.replace(
    'export const AdminContentPage: React.FC = () => {',
    `interface AdminContentPageProps {
  initialTab?: 'services' | 'faqs' | 'posts';
}

export const AdminContentPage: React.FC<AdminContentPageProps> = ({ initialTab }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const getInitialTab = (): 'services' | 'faqs' | 'posts' => {
    if (initialTab) return initialTab;
    if (location.pathname.includes('/articles')) return 'posts';
    const tabParam = searchParams.get('tab');
    if (tabParam === 'posts' || tabParam === 'articles') return 'posts';
    if (tabParam === 'faqs') return 'faqs';
    return 'services';
  };`
  );

  contentCode = contentCode.replace(
    "const [activeTab, setActiveTab] = useState<'services' | 'faqs' | 'posts'>('services');",
    "const [activeTab, setActiveTab] = useState<'services' | 'faqs' | 'posts'>(getInitialTab);"
  );

  // Add route sync effect
  const effectHook = `  useEffect(() => {
    if (location.pathname.includes('/articles') || searchParams.get('tab') === 'posts' || searchParams.get('tab') === 'articles') {
      setActiveTab('posts');
      if (searchParams.get('action') === 'new') {
        handleStartNewPost();
      }
    }
  }, [location.pathname, location.search]);\n\n`;

  contentCode = contentCode.replace(
    "const [saveMessage, setSaveMessage] = useState<string | null>(null);",
    `const [saveMessage, setSaveMessage] = useState<string | null>(null);\n\n${effectHook}`
  );

  // Update layout title
  contentCode = contentCode.replace(
    `title="Content & Services" \n      subtitle="Edit practice disciplines, statutory FAQs, and technical articles."`,
    `title={activeTab === 'posts' ? "Articles & Tax Insights" : "Content & Services"} \n      subtitle={activeTab === 'posts' ? "Write, edit, and publish statutory articles & technical commentary." : "Edit practice disciplines, statutory FAQs, and technical articles."}`
  );

  fs.writeFileSync(contentPagePath, contentCode, 'utf8');
  console.log('Updated AdminContentPage.tsx');
} else {
  console.log('AdminContentPage already updated');
}
