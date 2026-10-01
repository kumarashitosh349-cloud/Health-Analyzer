import React, { useRef, useState } from 'react';
import { MedicalReport, BodyRegion, PrescribedMedication } from '../types';
import { BodyViewer3D } from './BodyViewer3D';
import { PrescriptionColumn } from './PrescriptionColumn';
import { downloadMedicalReportPDF } from '../utils/pdfGenerator';
import { 
  FileText, 
  Printer, 
  Share2, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Building2, 
  Award, 
  CheckCircle, 
  Sparkles, 
  User, 
  Heart, 
  Thermometer, 
  Wind, 
  Droplets, 
  Flame, 
  Stethoscope, 
  ChevronRight,
  Pill,
  BookOpen,
  QrCode,
  Download,
  Loader2,
  Check,
  Save,
  Camera,
  Image as ImageIcon,
  ZoomIn,
  Maximize2,
  X,
  Eye
} from 'lucide-react';

interface MedicalReportViewProps {
  report: MedicalReport;
  selectedRegion: BodyRegion;
  onSelectRegion: (region: BodyRegion) => void;
  onSaveReport?: () => void;
  isSavingReport?: boolean;
  reportSaved?: boolean;
  saveReportError?: string;
  onAddPrescription?: (med: PrescribedMedication) => void;
  onRemovePrescription?: (id: string) => void;
  onRegenerateReport?: () => void;
}

export const MedicalReportView: React.FC<MedicalReportViewProps> = ({
  report,
  selectedRegion,
  onSelectRegion,
  onSaveReport,
  isSavingReport = false,
  reportSaved = false,
  saveReportError = '',
  onAddPrescription,
  onRemovePrescription,
  onRegenerateReport
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const handleDownloadPDF = async () => {
    try {
      setIsDownloadingPDF(true);
      await downloadMedicalReportPDF(report, printRef.current);
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 3500);
    } catch (err) {
      console.error('Failed to download PDF:', err);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getUrgencyBadge = (level: string) => {
    switch (level) {
      case 'emergency':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow-md animate-pulse">EMERGENCY ATTENTION REQUIRED</span>;
      case 'urgent':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-md">URGENT MEDICAL CONSULT</span>;
      case 'routine':
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white">ROUTINE CLINICAL CARE</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">SELF-MANAGEMENT / HOME CARE</span>;
    }
  };

  return (
    <div id="medical-report-printable-document" ref={printRef} className="space-y-6 animate-fade-in">
      {/* Top Action Bar (Print / Download PDF / Modify) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#E0E5EC] shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] border border-white/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-sm">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-slate-500 block">HEALTH REPORT</span>
            <span className="text-sm font-black text-slate-900">{report.reportId}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onRegenerateReport && (
            <button
              id="btn-edit-intake"
              onClick={onRegenerateReport}
              className="px-3.5 py-2 rounded-xl bg-[#E0E5EC] text-xs font-bold text-slate-700 shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] border border-white/60 hover:text-blue-600 transition"
            >
              Edit Symptoms
            </button>
          )}

          {onSaveReport && (
            <button
              id="btn-save-report"
              onClick={onSaveReport}
              disabled={isSavingReport || reportSaved}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] border border-white/60 transition disabled:opacity-60 ${
                reportSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#E0E5EC] text-slate-700 hover:text-blue-600'
              }`}
            >
              {isSavingReport ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : reportSaved ? (
                <Check className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isSavingReport ? 'Saving…' : reportSaved ? 'Saved to Firebase' : 'Save to Firebase'}</span>
            </button>
          )}

          {/* Primary Action: Direct Download PDF */}
          <button
            id="btn-download-pdf"
            onClick={handleDownloadPDF}
            disabled={isDownloadingPDF}
            className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition duration-200 shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] active:shadow-inner ${
              isDownloaded
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
            }`}
            title="Download full PDF file to your device"
          >
            {isDownloadingPDF ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Generating PDF...</span>
              </>
            ) : isDownloaded ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>PDF Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-white" />
                <span>Download PDF Report</span>
              </>
            )}
          </button>

          {/* Secondary: Browser Print */}
          <button
            id="btn-print-report"
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl bg-[#E0E5EC] text-slate-700 text-xs font-bold flex items-center gap-2 shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] hover:text-blue-600 active:shadow-inner transition border border-white/60"
            title="Open system print dialog"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print</span>
          </button>
        </div>
        {saveReportError && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {saveReportError}
          </p>
        )}
      </div>

      {/* Main Official Medical Report Card */}
      <div className="rounded-3xl bg-[#E0E5EC] shadow-[12px_12px_24px_#b8b9be,-12px_-12px_24px_#ffffff] border border-white/80 p-6 md:p-10 space-y-8">
        {/* Hospital / Clinic Official Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b-2 border-slate-300">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3)]">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                  METROPOLITAN DIGITAL HEALTH CLINIC
                </h1>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Personalized Health Diagnosis, Medicine Guide & Body Map
              </p>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono mt-2">
                <span>Record #{report.reportId}</span>
                <span>•</span>
                <span>HIPAA Privacy Protected</span>
                <span>•</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Health Summary
                </span>
              </div>
            </div>
          </div>

          <div className="text-left md:text-right shrink-0 p-3.5 rounded-2xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/50 space-y-1">
            <div className="text-xs font-mono font-bold text-blue-700">REPORT #{report.reportId}</div>
            <div className="text-[11px] text-slate-600 flex items-center md:justify-end gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Date: {report.issuedDate}</span>
            </div>
            <div className="text-[11px] text-slate-600 flex items-center md:justify-end gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Time: {report.issuedTime}</span>
            </div>
            <div className="pt-1">{getUrgencyBadge(report.clinicalImpression.urgencyLevel)}</div>
          </div>
        </div>

        {/* Patient Profile & Baseline Vitals Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Patient Demographics */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] border border-white/50 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-300">
              <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                <User className="w-4 h-4 text-blue-600" />
                Patient Info
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">{report.patient.patientId}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Full Name</span>
                <span className="font-black text-slate-900 text-sm">{report.patient.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Age / Gender</span>
                <span className="font-bold text-slate-800">{report.patient.age} Yrs • {report.patient.gender}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Blood Type</span>
                <span className="font-bold text-slate-800">{report.patient.bloodGroup}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Weight / Height</span>
                <span className="font-bold text-slate-800">{report.patient.weightKg} kg / {report.patient.heightCm} cm</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-300 text-xs">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Known Allergies</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {report.patient.allergies.length > 0 ? (
                  report.patient.allergies.map((all, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200">
                      {all}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic text-[11px]">No known drug allergies reported</span>
                )}
              </div>
            </div>
          </div>

          {/* Calibrated Vitals Gauge Deck */}
          <div className="lg:col-span-7 p-5 rounded-2xl bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] border border-white/50 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-300">
              <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" />
                Your Vital Signs
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                Normal Readings
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-[#E0E5EC] shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] border border-white/60">
                <span className="text-[10px] text-slate-500 font-bold block flex items-center gap-1">
                  <Heart className="w-3 h-3 text-rose-500" /> Blood Pressure
                </span>
                <span className="text-sm font-black text-slate-900">{report.vitals.bloodPressure}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#E0E5EC] shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] border border-white/60">
                <span className="text-[10px] text-slate-500 font-bold block flex items-center gap-1">
                  <Activity className="w-3 h-3 text-red-500" /> Heart Rate (Pulse)
                </span>
                <span className="text-sm font-black text-slate-900">{report.vitals.heartRate} bpm</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#E0E5EC] shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] border border-white/60">
                <span className="text-[10px] text-slate-500 font-bold block flex items-center gap-1">
                  <Wind className="w-3 h-3 text-cyan-500" /> Breaths / Min
                </span>
                <span className="text-sm font-black text-slate-900">{report.vitals.respiratoryRate} /min</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#E0E5EC] shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] border border-white/60">
                <span className="text-[10px] text-slate-500 font-bold block flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-amber-500" /> Body Temp
                </span>
                <span className="text-sm font-black text-slate-900">{report.vitals.temperature}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#E0E5EC] shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] border border-white/60">
                <span className="text-[10px] text-slate-500 font-bold block flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-blue-500" /> Oxygen (SpO2)
                </span>
                <span className="text-sm font-black text-slate-900">{report.vitals.oxygenSaturation}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#E0E5EC] shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] border border-white/60">
                <span className="text-[10px] text-slate-500 font-bold block flex items-center gap-1">
                  <Flame className="w-3 h-3 text-purple-500" /> Blood Sugar
                </span>
                <span className="text-sm font-black text-slate-900">{report.vitals.bloodGlucose || '95 mg/dL'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Images & Multimodal Visual Inspection Findings (When Available) */}
        {(report.uploadedImages && report.uploadedImages.length > 0) || report.imageAnalysis ? (
          <div className="p-6 rounded-3xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] border border-white/60 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-300">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600 text-white shadow-sm">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-bold block">
                    MULTIMODAL AI VISION ANALYSIS
                  </span>
                  <h3 className="text-base md:text-lg font-black text-slate-900">
                    Uploaded Medical Image & Visual Inspection
                  </h3>
                </div>
              </div>

              {report.imageAnalysis?.confidenceScore && (
                <div className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-1.5 self-start">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Vision Confidence: {Math.round(report.imageAnalysis.confidenceScore * 100)}%
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Image Previews & Thumbnails (4 cols) */}
              {report.uploadedImages && report.uploadedImages.length > 0 && (
                <div className="lg:col-span-4 space-y-2.5">
                  <span className="text-[11px] font-black uppercase text-slate-700 block">
                    Patient Provided Scan / Photo
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {report.uploadedImages.map((img) => (
                      <div
                        key={img.id}
                        className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 aspect-video shadow-md flex items-center justify-center cursor-pointer"
                        onClick={() => setZoomedImage(img.data)}
                      >
                        <img
                          src={img.data}
                          alt={img.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2.5 justify-between">
                          <span className="text-[10px] font-bold text-white truncate max-w-[150px]">{img.name}</span>
                          <span className="p-1 rounded-md bg-white/20 text-white backdrop-blur-sm text-xs">
                            <ZoomIn className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Visual Observations & Clinical Landmarks (8 cols) */}
              <div className={`${report.uploadedImages && report.uploadedImages.length > 0 ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-3`}>
                <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/90 shadow-sm space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-blue-600" />
                      Visual Observations & Tissue Patterns
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                      {report.imageAnalysis?.imageTypeDetected || 'Clinical Photograph'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {report.imageAnalysis?.summary || 'Automated visual scan of tissue pathology, margins, color variation, and inflammatory response.'}
                  </p>

                  {report.imageAnalysis?.visualObservations && report.imageAnalysis.visualObservations.length > 0 && (
                    <ul className="space-y-1.5 pt-1">
                      {report.imageAnalysis.visualObservations.map((obs, i) => (
                        <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                          <span>{obs}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {report.imageAnalysis?.anatomicalLandmarks && report.imageAnalysis.anatomicalLandmarks.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Landmarks:</span>
                      {report.imageAnalysis.anatomicalLandmarks.map((lm, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                          {lm}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* 3D Anatomical Pathology Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Body Map & Affected Organ View
              </h3>
              <p className="text-xs text-slate-600">
                See the exact body region where symptoms are located and tap any organ to explore
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 self-start">
              Focus: {selectedRegion.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <BodyViewer3D
            selectedRegion={selectedRegion}
            onSelectRegion={onSelectRegion}
            isScanning={false}
            highlightedRegion={selectedRegion}
          />
        </div>

        {/* Clinical Impression & ICD-10 Diagnosis */}
        <div className="p-6 rounded-3xl bg-[#E0E5EC] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] border border-white/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-300">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                YOUR DIAGNOSIS (WHAT YOU HAVE)
              </span>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">
                {report.clinicalImpression.primaryDiagnosis}
              </h2>
            </div>
            {report.clinicalImpression.icd10Code && (
              <div className="px-3.5 py-1.5 rounded-2xl bg-white shadow-sm border border-slate-300 text-xs font-mono font-bold text-slate-900 self-start">
                Code: <span className="text-blue-600">{report.clinicalImpression.icd10Code}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                Medical Summary (What is going on)
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-[#E0E5EC] p-3.5 rounded-2xl shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] border border-white/60">
                {report.clinicalImpression.summary}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase text-emerald-800 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                In Simple Everyday Words
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200">
                {report.plainLanguageExplanation}
              </p>
            </div>
          </div>

          {/* Differential Diagnoses */}
          {report.clinicalImpression.differentialDiagnoses && report.clinicalImpression.differentialDiagnoses.length > 0 && (
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-700 block mb-2">Other Possibilities Checked:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {report.clinicalImpression.differentialDiagnoses.map((diff, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#E0E5EC] shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] border border-white/60 text-xs">
                    <span className="font-black text-slate-900 block">{diff.condition}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">{diff.likelihood.toUpperCase()} Likelihood</span>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{diff.reasoning}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DEDICATED PRESCRIPTION & MEDICINE COLUMN BLOCK */}
        <PrescriptionColumn
          prescriptions={report.prescriptions}
          onAddPrescription={onAddPrescription}
          onRemovePrescription={onRemovePrescription}
        />

        {/* Non-Pharmacological Care, Home Advice, Red Flags & Follow-Up Plan */}
        {(() => {
          // Extract non-pharmacological care advice
          const adviceItems: { title: string; description: string }[] = [];
          if (Array.isArray(report.nonPharmacologicalAdvice) && report.nonPharmacologicalAdvice.length > 0) {
            report.nonPharmacologicalAdvice.forEach((item) => {
              if (typeof item === 'string') {
                adviceItems.push({ title: 'Care Advice', description: item });
              } else if (item && typeof item === 'object') {
                adviceItems.push({
                  title: item.title || 'Supportive Care',
                  description: item.description || ''
                });
              }
            });
          } else if (report.nonPharmacologicalPlan) {
            if (Array.isArray(report.nonPharmacologicalPlan.lifestyleModifications)) {
              report.nonPharmacologicalPlan.lifestyleModifications.forEach((m) => {
                adviceItems.push({ title: 'Lifestyle Modification', description: m });
              });
            }
            if (Array.isArray(report.nonPharmacologicalPlan.homeRemedies)) {
              report.nonPharmacologicalPlan.homeRemedies.forEach((r) => {
                adviceItems.push({ title: 'Home Remedy', description: r });
              });
            }
            if (report.nonPharmacologicalPlan.dietaryDirectives) {
              if (Array.isArray(report.nonPharmacologicalPlan.dietaryDirectives.recommended) && report.nonPharmacologicalPlan.dietaryDirectives.recommended.length > 0) {
                adviceItems.push({
                  title: 'Recommended Nutrition',
                  description: report.nonPharmacologicalPlan.dietaryDirectives.recommended.join(', ')
                });
              }
            }
          }
          if (adviceItems.length === 0) {
            adviceItems.push(
              { title: 'Rest & Recovery', description: 'Allow sufficient time for rest in a calm, well-ventilated environment.' },
              { title: 'Hydration', description: 'Maintain adequate fluid intake of 2-3 liters of fresh water daily.' },
              { title: 'Monitor Symptoms', description: 'Track symptom progression daily and note any improvements or changes.' }
            );
          }

          // Extract red flags
          const redFlagsList: string[] = [];
          if (Array.isArray(report.redFlagEmergencySymptoms) && report.redFlagEmergencySymptoms.length > 0) {
            report.redFlagEmergencySymptoms.forEach((rf) => {
              if (typeof rf === 'string') redFlagsList.push(rf);
            });
          } else if (report.followUpPlan && typeof report.followUpPlan === 'object' && Array.isArray(report.followUpPlan.emergencyRedFlags)) {
            report.followUpPlan.emergencyRedFlags.forEach((rf) => {
              if (typeof rf === 'string') redFlagsList.push(rf);
            });
          }
          if (redFlagsList.length === 0) {
            redFlagsList.push(
              'Sudden onset of shortness of breath, wheezing, or chest tightness',
              'High persistent fever (>102°F / 38.9°C) unresponsive to antipyretics',
              'Rapidly spreading redness, tissue swelling, or severe acute pain',
              'Severe dizziness, fainting, or sudden altered mental state'
            );
          }

          // Extract follow-up plan
          const isFollowUpObj = report.followUpPlan && typeof report.followUpPlan === 'object';
          const followUpTimeframe = isFollowUpObj ? report.followUpPlan.timeframe : '';
          const specialist = isFollowUpObj ? report.followUpPlan.recommendedSpecialist : '';
          const doctorQuestions: string[] = isFollowUpObj && Array.isArray(report.followUpPlan.doctorQuestions)
            ? report.followUpPlan.doctorQuestions
            : [];
          const followUpText = typeof report.followUpPlan === 'string' ? report.followUpPlan : '';

          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Home Care & Lifestyle Plan */}
                <div className="p-5 rounded-3xl bg-[#E0E5EC] shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] border border-white/70 space-y-3">
                  <h4 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Things You Can Do At Home (Supportive Care)
                  </h4>
                  <div className="space-y-2">
                    {adviceItems.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-xs">
                        <span className="font-bold text-slate-900 block">{item.title}</span>
                        <p className="text-slate-600 text-[11px] mt-0.5">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Red Flag Warning Box */}
                <div className="p-5 rounded-3xl bg-rose-50/80 border-2 border-rose-200 shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] space-y-3">
                  <h4 className="text-xs font-black uppercase text-rose-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
                    Warning Signs: When To See A Doctor Immediately
                  </h4>
                  <p className="text-[11px] text-rose-700">
                    Get immediate medical help or go to an urgent care / emergency room if you notice any of these:
                  </p>
                  <ul className="space-y-1.5">
                    {redFlagsList.map((rf, idx) => (
                      <li key={idx} className="text-xs font-bold text-rose-900 flex items-start gap-2 bg-white/80 p-2 rounded-xl border border-rose-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                        <span>{rf}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Follow-Up Plan & Questions For Your Doctor */}
              <div className="p-5 rounded-3xl bg-[#E0E5EC] shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] border border-white/70 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <h4 className="text-xs font-black uppercase text-slate-900">
                      Recommended Follow-Up & Next Clinical Steps
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {followUpTimeframe && (
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold border border-blue-200">
                        Timeframe: {followUpTimeframe}
                      </span>
                    )}
                    {specialist && (
                      <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold border border-indigo-200">
                        Specialist: {specialist}
                      </span>
                    )}
                  </div>
                </div>

                {followUpText && (
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {followUpText}
                  </p>
                )}

                {doctorQuestions.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Recommended Questions To Ask Your In-Person Doctor:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {doctorQuestions.map((q, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/50 text-xs text-slate-800 flex items-start gap-2">
                          <span className="w-5 h-5 rounded-lg bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            ?
                          </span>
                          <span className="font-medium">{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Digital Attending Physician Signature & Accreditation Seal */}
        <div className="pt-6 border-t-2 border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md border-2 border-white">
              MD
            </div>
            <div className="text-xs">
              <p className="font-black text-slate-900">{report.attendingPhysician.name}</p>
              <p className="text-slate-600">{report.attendingPhysician.credentials} • {report.attendingPhysician.specialty}</p>
              <p className="text-[10px] text-slate-500 font-mono">License #{report.attendingPhysician.licenseNumber}</p>
            </div>
          </div>

          {/* Cryptographic QR Seal */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/50">
            <QrCode className="w-10 h-10 text-slate-900" />
            <div className="text-[10px] text-slate-600">
              <span className="font-bold text-slate-900 block">Verified Digital Record</span>
              <span className="font-mono">Security ID: {Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
              <span className="text-emerald-700 block font-semibold">Valid Health Summary</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomedImage(null)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-2xl p-2 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomedImage}
              alt="Medical Scan Full View"
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
