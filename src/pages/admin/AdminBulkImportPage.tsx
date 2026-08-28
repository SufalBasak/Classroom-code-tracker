import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionService } from '../../services/questionService';
import { Button } from '../../components/common/Button';
import { useToast } from '../../components/common/Toast';
import { PlatformBadge, DifficultyBadge } from '../../components/common/Badge';
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  FileText,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const AdminBulkImportPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [validationResult, setValidationResult] = useState<{ imported: number; errors: { row: number; reason: string }[] } | null>(null);

  const sampleCsvData = `title	platform	external_url	difficulty	topic	tags
Two Sum	LeetCode	https://leetcode.com/problems/two-sum/	Easy	Arrays	Hash Map,Array
Valid Parentheses	LeetCode	https://leetcode.com/problems/valid-parentheses/	Easy	Stack	Stack,String
Kadanes Algorithm	GeeksforGeeks	https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1	Medium	Arrays	DP,Array
Java If-Else	HackerRank	https://www.hackerrank.com/challenges/java-if-else/problem	Easy	Java	Conditionals
Watermelon	Codeforces	https://codeforces.com/problemset/problem/4/A	Easy	Math	Math`;

  const parseRawText = (text: string) => {
    setCsvText(text);
    if (!text.trim()) {
      setParsedRows([]);
      return;
    }
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) {
      setParsedRows([]);
      return;
    }

    // Auto-detect delimiter (tab \t for Excel, comma , for CSV)
    const firstLine = lines[0];
    const delimiter = firstLine.includes('\t') ? '\t' : ',';

    const rows = lines.slice(1).map((line) => {
      const parts = line.split(delimiter).map((p) => p.trim().replace(/^"|"$/g, ''));
      return {
        title: parts[0] || '',
        platform: parts[1] || 'LeetCode',
        external_url: parts[2] || '',
        difficulty: parts[3] || 'Easy',
        topic: parts[4] || 'General',
        tags: parts[5] || ''
      };
    });

    setParsedRows(rows.filter((r) => r.title || r.external_url));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        parseRawText(content);
        showToast(`✓ Loaded ${file.name} successfully!`, 'info');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (parsedRows.length === 0) return;
    const result = questionService.bulkImportFromCsvRows(parsedRows);
    setValidationResult(result);
    showToast(`✓ Bulk Import Completed! ${result.imported} questions added to inventory.`, 'success');
  };

  const handleDownloadErrorReport = () => {
    if (!validationResult) return;
    const content = validationResult.errors.map((e) => `Row ${e.row}: ${e.reason}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'import_error_report.txt';
    a.click();
  };

  return (
    <div className="space-y-6 animate-element max-w-5xl mx-auto">
      <button
        onClick={() => navigate('/admin/questions')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Questions
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">Bulk Excel / CSV Question Importer</h1>
        <p className="text-sm text-slate-500 mt-1">Upload spreadsheet files or copy-paste Excel rows to add bulk coding questions with external links.</p>
      </div>

      {/* File Upload Dropzone + Sample Button */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> Excel / CSV Upload Options
          </h3>
          <Button
            onClick={() => parseRawText(sampleCsvData)}
            variant="outline"
            size="sm"
            leftIcon={<Sparkles className="w-4 h-4 text-amber-500" />}
          >
            Load Sample Excel/CSV Dataset
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Option 1: File Upload Input */}
          <div className="p-5 border-2 border-dashed border-slate-200 hover:border-blue-500/60 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-2 transition-all">
            <Upload className="w-8 h-8 text-blue-600" />
            <div className="text-xs font-bold text-slate-900">Upload Spreadsheet File</div>
            <p className="text-[11px] text-slate-500">Supports .csv, .tsv, and Excel exported .txt files</p>
            <label className="mt-2 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-blue-700 transition-colors shadow-xs">
              Choose File
              <input type="file" accept=".csv,.tsv,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Option 2: Paste Raw Data */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">Or Paste Tab/Comma Raw Data</label>
            <textarea
              rows={5}
              value={csvText}
              onChange={(e) => parseRawText(e.target.value)}
              placeholder="Paste tab-delimited Excel rows or CSV text (title, platform, external_url, difficulty, topic)..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Formatted Excel Preview Table */}
      {parsedRows.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 animate-element">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Import Preview Table</h3>
              <p className="text-xs text-slate-500">{parsedRows.length} questions parsed ready for insertion</p>
            </div>
            <Button
              onClick={handleConfirmImport}
              variant="primary"
              size="md"
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Confirm Bulk Import ({parsedRows.length} Questions)
            </Button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Question Title</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Topic</th>
                  <th className="py-3 px-4">External URL Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {parsedRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 text-slate-400 font-mono">#{idx + 1}</td>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{row.title || 'Untitled'}</td>
                    <td className="py-2.5 px-4">
                      <PlatformBadge platform={row.platform || 'LeetCode'} />
                    </td>
                    <td className="py-2.5 px-4">
                      <DifficultyBadge difficulty={row.difficulty || 'Easy'} />
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 font-medium">{row.topic || 'General'}</td>
                    <td className="py-2.5 px-4">
                      {row.external_url ? (
                        <a
                          href={row.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-mono text-[11px] truncate max-w-xs block hover:underline inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{row.external_url}</span>
                        </a>
                      ) : (
                        <span className="text-rose-500 font-semibold">Missing Link</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Validation Results Card */}
      {validationResult && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 animate-element">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Bulk Import Summary</h3>
            {validationResult.errors.length > 0 && (
              <Button
                onClick={handleDownloadErrorReport}
                variant="outline"
                size="sm"
                leftIcon={<Download className="w-4 h-4" />}
              >
                Download Error Report
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-900">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div className="text-2xl font-extrabold">{validationResult.imported}</div>
                <div className="text-xs font-semibold text-emerald-700">Questions Added to Database</div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-900">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <div className="text-2xl font-extrabold">{validationResult.errors.length}</div>
                <div className="text-xs font-semibold text-amber-700">Rows Flagged with Errors</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
