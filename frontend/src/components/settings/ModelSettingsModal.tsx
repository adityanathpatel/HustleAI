import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Server,
  Cpu,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useModel } from '../../context/ModelContext';
import { useNotification } from '../common/Notification';

export const ModelSettingsModal: React.FC = () => {
  const { status, isLoading, isConfigModalOpen, closeConfigModal, switchMode, updateConfig, refreshStatus } = useModel();
  const { notify } = useNotification();

  const [activeMode, setActiveMode] = useState<'local' | 'remote'>(status?.active_mode || 'local');
  const [localEndpoint, setLocalEndpoint] = useState(status?.local_endpoint || 'http://localhost:11434');
  const [localModel, setLocalModel] = useState(status?.local_model || 'llama3.2:3b');
  const [remoteEndpoint, setRemoteEndpoint] = useState(status?.remote_endpoint || 'https://api.openai.com/v1');
  const [remoteModel, setRemoteModel] = useState(status?.remote_model || 'gpt-4o-mini');
  const [remoteApiKey, setRemoteApiKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const handleModeChange = async (mode: 'local' | 'remote') => {
    setActiveMode(mode);
    try {
      await switchMode(mode);
      notify(`Switched to ${mode === 'local' ? 'Local Air-Gapped Mode' : 'Remote API Mode'}`, 'success');
    } catch {
      notify('Failed to switch mode', 'error');
    }
  };

  const handleSaveConfig = async () => {
    try {
      await updateConfig({
        active_mode: activeMode,
        local_endpoint: localEndpoint,
        local_model: localModel,
        remote_endpoint: remoteEndpoint,
        remote_model: remoteModel,
        remote_api_key: remoteApiKey || undefined
      });
      notify('Model configuration updated successfully', 'success');
      closeConfigModal();
    } catch (err: any) {
      notify(err.message || 'Failed to update configuration', 'error');
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      await refreshStatus();
      notify('Connection health verified', 'success');
    } catch {
      notify('Failed to reach endpoint', 'error');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Modal
      isOpen={isConfigModalOpen}
      onClose={closeConfigModal}
      title="AI Engine & Privacy Configuration"
      maxWidth="xl"
    >
      <div className="space-y-6 text-sm">
        {/* Mode Selector Tabs */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Inference Privacy Architecture
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleModeChange('local')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeMode === 'local'
                  ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40 ring-2 ring-brand-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-navy-950/40'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-slate-900 dark:text-white">Local Air-Gapped</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Zero data leaves your machine. Connects to local Ollama or on-device engines.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleModeChange('remote')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                activeMode === 'remote'
                  ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40 ring-2 ring-amber-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-navy-950/40'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="font-bold text-slate-900 dark:text-white">Remote API Gateway</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Sends prompts to external endpoints. Requires API credentials.
              </p>
            </button>
          </div>
        </div>

        {/* Live Status Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              Engine Status: {status?.privacy_badge}
            </span>
            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="text-xs flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline font-medium disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
              Test Connection
            </button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
            {status?.status_message}
          </p>
          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
              Latency: {status?.latency_ms ? `${status.latency_ms} ms` : 'N/A'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
              Available Models: {status?.local_models_available?.join(', ') || 'Rule Engine'}
            </span>
          </div>
        </div>

        {/* Detailed Configuration Forms */}
        {activeMode === 'local' ? (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <CheckCircle className="w-4 h-4" />
              <span>Local Air-Gapped Mode Enabled. No prompts or files leave your computer.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Local Ollama Endpoint URL
              </label>
              <input
                type="text"
                value={localEndpoint}
                onChange={e => setLocalEndpoint(e.target.value)}
                placeholder="http://localhost:11434"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Standard default for Ollama is <code>http://localhost:11434</code>
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Local Model Tag
              </label>
              <input
                type="text"
                value={localModel}
                onChange={e => setLocalModel(e.target.value)}
                placeholder="llama3.2:3b"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Recommended open models: <code>llama3.2:3b</code> (lightweight, 2GB RAM), <code>mistral:7b</code>, <code>phi3:mini</code>
              </span>
            </div>

            <div className="p-3 rounded-xl bg-brand-50/50 dark:bg-brand-950/30 border border-brand-200/60 dark:border-brand-900/40 text-[11px] space-y-1">
              <span className="font-semibold text-brand-900 dark:text-brand-300 flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5" />
                Quick Setup with Ollama
              </span>
              <p className="text-brand-800 dark:text-brand-400">
                To run Llama 3.2 locally, install Ollama and run in your terminal:
              </p>
              <code className="block bg-white dark:bg-navy-950 p-1.5 rounded border border-brand-200 dark:border-brand-900 font-mono text-[11px] text-brand-700 dark:text-brand-300">
                ollama run llama3.2:3b
              </code>
              <p className="text-slate-500 dark:text-slate-400 pt-1">
                Even if Ollama is not yet running, HustleAI's built-in 100% on-device Local Rule Engine keeps you productive without breaking.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Privacy Notice: Remote Inference</p>
                <p className="text-[11px] mt-0.5">
                  Prompts and business data sent in Remote Mode will leave your local machine and be processed by the configured external API. Never claim remote inference is offline or completely private.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Remote Base URL (OpenAI-compatible)
              </label>
              <input
                type="text"
                value={remoteEndpoint}
                onChange={e => setRemoteEndpoint(e.target.value)}
                placeholder="https://api.openai.com/v1"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Remote Model Name
              </label>
              <input
                type="text"
                value={remoteModel}
                onChange={e => setRemoteModel(e.target.value)}
                placeholder="gpt-4o-mini"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Remote API Key
              </label>
              <input
                type="password"
                value={remoteApiKey}
                onChange={e => setRemoteApiKey(e.target.value)}
                placeholder={status?.remote_available ? '••••••••••••••••' : 'sk-...'}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                Stored securely on the local backend. Never exposed in frontend bundle.
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={closeConfigModal}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveConfig}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition-all"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </Modal>
  );
};
