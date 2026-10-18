import React, { createContext, useContext, useEffect, useState } from 'react';
import { ModelStatus } from '../types';
import { api } from '../services/api';

interface ModelContextType {
  status: ModelStatus | null;
  isLoading: boolean;
  refreshStatus: () => Promise<void>;
  switchMode: (mode: 'local' | 'remote') => Promise<void>;
  updateConfig: (data: Partial<ModelStatus> & { remote_api_key?: string }) => Promise<void>;
  isConfigModalOpen: boolean;
  openConfigModal: () => void;
  closeConfigModal: () => void;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const ModelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<ModelStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const refreshStatus = async () => {
    setIsLoading(true);
    try {
      const res = await api.ai.getModelStatus();
      setStatus(res);
    } catch (err) {
      console.error('Failed to fetch model status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshStatus();
  }, []);

  const switchMode = async (mode: 'local' | 'remote') => {
    try {
      const updated = await api.ai.updateModelConfig({ active_mode: mode });
      setStatus(updated);
    } catch (err) {
      console.error('Failed to switch AI mode:', err);
      throw err;
    }
  };

  const updateConfig = async (data: Partial<ModelStatus> & { remote_api_key?: string }) => {
    try {
      const updated = await api.ai.updateModelConfig(data);
      setStatus(updated);
    } catch (err) {
      console.error('Failed to update model config:', err);
      throw err;
    }
  };

  return (
    <ModelContext.Provider
      value={{
        status,
        isLoading,
        refreshStatus,
        switchMode,
        updateConfig,
        isConfigModalOpen,
        openConfigModal: () => setIsConfigModalOpen(true),
        closeConfigModal: () => setIsConfigModalOpen(false)
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

export const useModel = () => {
  const context = useContext(ModelContext);
  if (!context) throw new Error('useModel must be used within ModelProvider');
  return context;
};
