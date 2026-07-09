import { createContext, useContext, useState } from 'react';

const PageTitleContext = createContext(null);

export function PageTitleProvider({ children }) {
  const [pageTitle, setPageTitle] = useState('Dashboard');
  return (
    <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}

export function usePageTitle() {
  const ctx = useContext(PageTitleContext);
  if (!ctx) throw new Error('usePageTitle must be used within PageTitleProvider');
  return ctx;
}
