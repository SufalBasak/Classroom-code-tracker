import React, { useState } from 'react';
import { CodingProfile, PlatformId } from '../../types';
import { Button } from '../common/Button';
import { PlatformBadge } from '../common/Badge';
import { RefreshCw, CheckCircle2, AlertCircle, Link2, Unlink, Trophy } from 'lucide-react';
import { codingStatsService } from '../../services/codingStatsService';

export interface PlatformSyncCardProps {
  profile: CodingProfile;
  onOpenConnectModal: (platform: PlatformId) => void;
  onSync: (platform: PlatformId, username: string) => Promise<void>;
  onDisconnect: (platform: PlatformId) => Promise<void>;
}

export const PlatformSyncCard: React.FC<PlatformSyncCardProps> = ({
  profile,
  onOpenConnectModal,
  onSync,
  onDisconnect
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const autoSyncSupported = codingStatsService.isAutoSyncSupported(profile.platform);

  const handleSyncNow = async () => {
    if (!profile.username) return;
    setIsSyncing(true);
    setSyncError(null);
    try {
      await onSync(profile.platform, profile.username);
    } catch (err: any) {
      setSyncError(err?.message || 'Sync failed. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await onDisconnect(profile.platform);
    } finally {
      setIsDisconnecting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between gap-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <PlatformBadge platform={profile.platform} />
          {profile.connected ? (
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Connected
            </span>
          ) : (
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-xs font-semibold">
              Not Connected
            </span>
          )}
        </div>

        <div>
          <h4 className="font-bold text-slate-900 text-lg">{profile.platform}</h4>
          {profile.connected ? (
            <p className="text-xs text-slate-600 font-mono mt-0.5">Username: <strong className="text-slate-900">{profile.username}</strong></p>
          ) : (
            <p className="text-xs text-slate-500 mt-0.5">Connect handle to track problems solved.</p>
          )}
        </div>

        {profile.connected && (
          <div className="text-xs text-slate-500 space-y-2 pt-2 border-t border-slate-100">
            <p>Last synced: <strong className="text-slate-700">{profile.lastSynced || 'Never'}</strong></p>

            {autoSyncSupported ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-emerald-600 shrink-0" />
                <p className="text-sm">
                  <strong className="font-extrabold">{profile.solvedCount ?? 0}</strong> problems solved
                </p>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">Automatic sync isn't available for this platform yet.</p>
            )}

            {isSyncing && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2 text-blue-900 animate-element">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span className="text-xs font-semibold">Fetching latest stats from {profile.platform}...</span>
              </div>
            )}

            {syncError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-700 text-xs">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{syncError}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        {profile.connected ? (
          <>
            <Button
              onClick={handleSyncNow}
              variant="primary"
              size="sm"
              isLoading={isSyncing}
              disabled={!autoSyncSupported}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              className="flex-1"
            >
              Sync Now
            </Button>
            <Button
              onClick={handleDisconnect}
              variant="outline"
              size="sm"
              isLoading={isDisconnecting}
              leftIcon={<Unlink className="w-3.5 h-3.5" />}
            >
              Disconnect
            </Button>
          </>
        ) : (
          <Button
            onClick={() => onOpenConnectModal(profile.platform)}
            variant="outline"
            size="sm"
            className="w-full"
            leftIcon={<Link2 className="w-3.5 h-3.5" />}
          >
            Connect Account
          </Button>
        )}
      </div>
    </div>
  );
};
