import React, { useState } from 'react';
import { platformService } from '../../services/platformService';
import { PlatformBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Shield, Link2, CheckCircle2 } from 'lucide-react';
import { PlatformId } from '../../types';

export const AdminPlatformsPage: React.FC = () => {
  const platforms = platformService.getPlatforms();
  const [testUrl, setTestUrl] = useState('https://leetcode.com/problems/two-sum/');
  const [detected, setDetected] = useState<PlatformId | null>('LeetCode');

  const handleTestUrlChange = (url: string) => {
    setTestUrl(url);
    setDetected(platformService.detectPlatformFromUrl(url));
  };

  return (
    <div className="space-y-6 animate-element max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">External Platform Configurations</h1>
        <p className="text-sm text-slate-500 mt-1">Manage platform base URLs, status, and test auto-detection rules.</p>
      </div>

      {/* Platform Auto-Detection Live Demo Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Link2 className="w-5 h-5 text-blue-600" /> Platform URL Auto-Detector Demo
        </h3>
        <p className="text-xs text-slate-500">Paste any problem URL to test platform matching logic:</p>

        <div className="space-y-2">
          <input
            type="text"
            value={testUrl}
            onChange={(e) => handleTestUrlChange(e.target.value)}
            placeholder="Paste URL (e.g. leetcode.com, geeksforgeeks.org, hackerrank.com, codeforces.com)..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-blue-500 font-mono"
          />
          {detected ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Detected Platform: <strong className="font-bold">{detected}</strong></span>
            </div>
          ) : (
            <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500">
              No platform pattern matched. Default fallback will be applied.
            </div>
          )}
        </div>
      </div>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((plat) => (
          <div key={plat.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <PlatformBadge platform={plat.id} />
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
                Active Integration
              </span>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-lg">{plat.name}</h4>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{plat.baseUrl}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-600">
              <span>Platform Inventory:</span>
              <strong className="text-slate-900">{plat.totalQuestionsOnPlatform}+ Problems</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
