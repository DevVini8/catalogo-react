import React, { createContext, useContext, useState, useCallback } from 'react';
import { PRODUCTS } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({
      id: Date.now(),
      message,
      type,
    });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  const selectProduct = useCallback((product) => {
    setSelectedProduct(product);
  }, []);

  return (
    <AppContext.Provider
      value={{
        selectedProduct,
        selectProduct,
        toast,
        showToast,
        closeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser utilizado dentro de AppProvider.');
  }
  return context;
}
