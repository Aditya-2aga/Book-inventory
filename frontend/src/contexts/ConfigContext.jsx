import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const ConfigContext = createContext();

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export const ConfigProvider = ({ children }) => {
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkApiKeyConfiguration = async () => {
    try {
      const response = await api.get('/config/gemini_api_key');
      setApiKeyConfigured(response.data.hasValue || false);
    } catch (error) {
      setApiKeyConfigured(false);
    } finally {
      setLoading(false);
    }
  };

  const updateApiKeyStatus = (configured) => {
    setApiKeyConfigured(configured);
  };

  useEffect(() => {
    checkApiKeyConfiguration();
  }, []);

  const value = {
    apiKeyConfigured,
    loading,
    updateApiKeyStatus,
    checkApiKeyConfiguration
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};