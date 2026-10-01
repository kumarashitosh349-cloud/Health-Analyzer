// src/components/SavedReportsPanel.tsx
// Slide-in panel listing all Firestore-saved medical reports for the signed-in user

import React, { useEffect, useState } from 'react';
import { X, FileText, Trash2, Loader2, Database, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserReports, deleteReport, SavedReport } from '../firebase/dbService';
import type { MedicalReport } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onLoadReport: (report: MedicalReport) => void;
}

export function SavedReportsPanel({ open, onClose, onLoadReport }: Props) {
  const { user } = useAuth();
  const [reports, setReports]   = useState<SavedReport[]>([]);
  const [loading, setLoading]   = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError]       = useState('');

  useEffect(() => {
    if (open && user) fetchReports();
  }, [open, user]);

  const fetchReports = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const data = await getUserReports(user.uid);
      setReports(data);
    } catch {
      setError('Failed to load saved reports.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reportId: string) => {
    if (!user) return;
    setDeleting(reportId);
    try {
      await deleteReport(user.uid, reportId);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch {
      setError('Failed to delete report.');
    } finally {
      setDeleting(null);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#E0E5EC] shadow-[-12px_0_40px_rgba(0,0,0,0.15)] z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] flex items-center justify-center">
              <Database className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Saved Reports</h2>
              <p className="text-xs text-slate-400">Stored in Firebase Cloud</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#E0E5EC] shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] flex items-center justify-center hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-slate-500">Loading from Firestore…</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && reports.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <div className="w-16 h-16 rounded-3xl bg-[#E0E5EC] shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] flex items-center justify-center">
                <FileText className="w-7 h-7 text-slate-400" />
              </div>
              <div>
                <p className="font-bold text-slate-700">No saved reports yet</p>
                <p className="text-xs text-slate-400 mt-1">Generate a medical report and save it to your cloud account.</p>
              </div>
            </div>
          )}

          {/* Report Cards */}
          {!loading && reports.map((sr) => (
            <div
              key={sr.id}
              className="bg-[#E0E5EC] rounded-2xl shadow-[5px_5px_10px_#b8b9be,-5px_-5px_10px_#ffffff] border border-white/50 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <p className="text-sm font-bold text-slate-800 truncate">{sr.title}</p>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <span className="font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-[10px]">
                      {sr.report.reportNumber ?? sr.report.id}
                    </span>
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <Calendar className="w-3 h-3" />
                    {sr.savedAt?.toDate
                      ? sr.savedAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : sr.report.generatedDate}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => { onLoadReport(sr.report); onClose(); }}
                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDelete(sr.id)}
                    disabled={deleting === sr.id}
                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#E0E5EC] shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    {deleting === sr.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Diagnosis chip */}
              {sr.report.clinicalImpression?.primaryDiagnosis && (
                <div className="mt-2 pt-2 border-t border-slate-200/50">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full">
                    {sr.report.clinicalImpression.icd10Code} · {sr.report.clinicalImpression.primaryDiagnosis}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
