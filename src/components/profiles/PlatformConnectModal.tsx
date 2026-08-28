import React, { useState } from 'react';
import { PlatformId } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ShieldCheck, Lock, AlertCircle } from 'lucide-react';

export interface PlatformConnectModalProps {
  isOpen: boolean;
  platform: PlatformId | null;
  onClose: () => void;
  onConnect: (platform: PlatformId, username: string) => Promise<void>;
}

export const PlatformConnectModal: React.FC<PlatformConnectModalProps> = ({
  isOpen,
  platform,
  onClose,
  onConnect
}) => {
  const [username, setUsername] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!platform) return null;

  const handleClose = () => {
    setUsername('');
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsConnecting(true);
    setError(null);
    try {
      await onConnect(platform, username.trim());
      setUsername('');
      onClose();
    } catch (err: any) {
      setError(err?.message || `Failed to connect ${platform}. Please try again.`);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Connect ${platform}`}
      description="Track public problem solving activity on CodeSnap"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={handleClose} disabled={isConnecting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} isLoading={isConnecting}>
            {isConnecting ? 'Connecting...' : 'Connect Account'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 block">
            {platform} Username
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={`Enter your ${platform} handle`}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200/80 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-normal">{error}</p>
          </div>
        )}

        <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-start gap-2.5 text-xs text-blue-800">
          <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-normal">
            CodeSnap only requires your public profile handle. We never ask for passwords, cookies, or session tokens.
          </p>
        </div>
      </form>
    </Modal>
  );
};
