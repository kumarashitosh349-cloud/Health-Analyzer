import React, { useState, useRef, useEffect } from 'react';
import { 
  MedicalReport, 
  UploadedMedicalImage, 
  PatientProfile, 
  VitalSigns, 
  BodyRegion 
} from '../types';
import { SAMPLE_MEDICAL_PRESETS, SampleMedicalImagePreset } from '../data/sampleMedicalImages';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  UploadCloud, 
  Image as ImageIcon, 
  Sparkles, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Trash2, 
  Eye, 
  RefreshCw, 
  ArrowRight, 
  Layers, 
  Stethoscope, 
  ShieldCheck, 
  Loader2, 
  ZoomIn, 
  X, 
  Plus, 
  Info,
  Maximize2
} from 'lucide-react';

interface ImageReportAnalyzerProps {
  onReportGenerated: (report: MedicalReport) => void;
  isLoading?: boolean;
}

export const ImageReportAnalyzer: React.FC<ImageReportAnalyzerProps> = ({
  onReportGenerated,
  isLoading: parentLoading = false
}) => {
  const [images, setImages] = useState<UploadedMedicalImage[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewModalImg, setPreviewModalImg] = useState<string | null>(null);
  
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Optional Patient Profile form
  const [patientName, setPatientName] = useState('Alexander Hayes');
  const [patientAge, setPatientAge] = useState(38);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [symptomsText, setSymptomsText] = useState('');
  const [durationText, setDurationText] = useState('3-5 Days');
  const [bodyRegionHint, setBodyRegionHint] = useState<string>('auto');
  const [showPatientDetails, setShowPatientDetails] = useState(false);

  // Analysis progress steps
  const ANALYSIS_STEPS = [
    'Scanning image visual features & contours...',
    'Detecting tissue texture, redness, and radiological densities...',
    'Matching with ICD-10 medical diagnostics database...',
    'Formulating medical report, 3D body map & prescription guide...'
  ];

  useEffect(() => {
    let timer: any;
    if (isAnalyzing) {
      setAnalysisStep(0);
      timer = setInterval(() => {
        setAnalysisStep((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
      }, 1400);
    }
    return () => clearInterval(timer);
  }, [isAnalyzing]);

  // Handle Drag & Drop / File Input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const processFiles = (files: File[]) => {
    setErrorMessage(null);
    setSelectedPreset(null);

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload standard image formats (JPG, PNG, WEBP).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        const resultUrl = loadEvt.target?.result as string;
        if (resultUrl) {
          const newImg: UploadedMedicalImage = {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            data: resultUrl,
            mimeType: file.type,
            name: file.name,
            sizeBytes: file.size,
            category: file.name.toLowerCase().includes('xray') ? 'xray_radiograph' : 'symptom_photo'
          };
          setImages((prev) => [...prev, newImg]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Preset Selection
  const handleSelectPreset = (preset: SampleMedicalImagePreset) => {
    setSelectedPreset(preset.id);
    setErrorMessage(null);
    setPatientName(preset.patientName);
    setPatientAge(preset.patientAge);
    setPatientGender(preset.patientGender);
    setSymptomsText(preset.sampleSymptom);
    setBodyRegionHint(preset.bodyRegion);

    const newImg: UploadedMedicalImage = {
      id: `img-preset-${preset.id}`,
      data: preset.imageDataUrl,
      mimeType: 'image/svg+xml',
      name: `${preset.title}.svg`,
      category: preset.category
    };

    setImages([newImg]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    if (images.length <= 1) {
      setSelectedPreset(null);
    }
  };

  // Camera Management
  const startCamera = async () => {
    try {
      setErrorMessage(null);
      setIsCameraActive(true);
      const constraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setIsCameraActive(false);
      setErrorMessage('Unable to access webcam or phone camera. Please check permissions or upload an image file instead.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

        const newImg: UploadedMedicalImage = {
          id: `img-cam-${Date.now()}`,
          data: dataUrl,
          mimeType: 'image/jpeg',
          name: `Camera_Capture_${new Date().toLocaleTimeString().replace(/:/g, '-')}.jpg`,
          category: 'symptom_photo'
        };

        setImages((prev) => [...prev, newImg]);
        stopCamera();
      }
    }
  };

  // Submit and Trigger Full Analysis Report
  const handleAnalyzeAndGenerateReport = async () => {
    if (images.length === 0) {
      setErrorMessage('Please upload at least one image or select a clinical preset to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const patient: PatientProfile = {
        name: patientName || 'Patient',
        patientId: `PT-${Math.floor(100000 + Math.random() * 900000)}`,
        age: Number(patientAge) || 35,
        gender: patientGender,
        bloodGroup: 'O+',
        weightKg: 70,
        heightCm: 172,
        allergies: ['None reported'],
        chiefComplaint: symptomsText || 'Visual image evaluation',
        historyOfPresentIllness: `Patient uploaded ${images.length} medical image(s) for clinical analysis. Symptoms: ${symptomsText || 'Visual presentation'}. Duration: ${durationText}.`,
        symptomsDuration: durationText
      };

      const vitals: VitalSigns = {
        bloodPressure: '120/80 mmHg',
        heartRate: 74,
        respiratoryRate: 16,
        temperature: '98.6 °F',
        oxygenSaturation: 99,
        bloodGlucose: '95 mg/dL',
        bmi: 23.5
      };

      const payload = {
        images: images.map((img) => ({
          id: img.id,
          data: img.data,
          mimeType: img.mimeType,
          name: img.name,
          category: img.category
        })),
        patient,
        vitals,
        symptoms: symptomsText ? [symptomsText] : [],
        clinicalNotes: `Patient notes: ${symptomsText}. Duration: ${durationText}.`,
        bodyRegionHint: bodyRegionHint === 'auto' ? undefined : bodyRegionHint
      };

      const res = await fetch('/api/analyze-medical-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Server returned error code ${res.status}`);
      }

      const reportData: MedicalReport = await res.json();
      
      // Ensure the report has the uploaded images attached
      reportData.uploadedImages = images;

      try {
        confetti({ particleCount: 50, spread: 70, origin: { y: 0.8 } });
      } catch (e) {}

      onReportGenerated(reportData);
    } catch (err: any) {
      console.error('Error generating image report:', err);
      setErrorMessage('Failed to complete AI vision analysis. Please check network connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#E0E5EC] shadow-[10px_10px_20px_#b8b9be,-10px_-10px_20px_#ffffff] border border-white/80 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
              <Camera className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                  Multimodal AI Vision
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Instant Diagnostic Report
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-1">
                Upload Medical Images & Scans
              </h2>
              <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl">
                Upload photos of skin rashes, eye redness, throat swelling, X-ray scans, or lab blood test sheets to receive an official Medical Report with 3D organ highlighting and prescription medicines.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <button
              id="btn-open-camera"
              onClick={startCamera}
              className="px-4 py-2.5 rounded-xl bg-[#E0E5EC] text-slate-800 text-xs font-bold flex items-center gap-2 shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] hover:text-blue-600 active:shadow-inner transition border border-white/70"
            >
              <Camera className="w-4 h-4 text-blue-600" />
              <span>Use Camera</span>
            </button>
            <button
              id="btn-browse-file"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Browse Photos</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Quick Sample Presets (For instant 1-click test drive!) */}
        <div className="pt-3 border-t border-slate-300/80">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Quick Test: Select a Sample Medical Case
            </span>
            <span className="text-[11px] text-slate-500 font-medium">Click to load image instantly</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {SAMPLE_MEDICAL_PRESETS.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  id={`preset-${preset.id}`}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-2xl text-left transition border ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 shadow-[inset_2px_2px_5px_#b8b9be,inset_-2px_-2px_5px_#ffffff]'
                      : 'bg-[#E0E5EC] border-white/60 shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-blue-700">{preset.badge}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </div>
                  <div className="text-xs font-black text-slate-900 mt-1 line-clamp-1">{preset.title}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{preset.description}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Upload Dropzone & Live Images Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dropzone & Uploaded Image Previews (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div
            id="image-dropzone"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer p-8 rounded-3xl text-center border-2 border-dashed transition flex flex-col items-center justify-center min-h-[220px] ${
              images.length > 0
                ? 'bg-slate-50/40 border-blue-400 shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff]'
                : 'bg-[#E0E5EC] border-slate-400/80 shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] hover:border-blue-500'
            }`}
          >
            <div className="p-4 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] text-blue-600 mb-3">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-black text-slate-800">
              Drag & Drop your medical photos or scans here
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Supports Skin Photos, Radiographs / X-Rays, Throat/Eye photos, Blood Test Sheets (PNG, JPG, WEBP)
            </p>
            <div className="mt-3 px-3 py-1 rounded-full bg-white/70 border border-slate-200 text-[11px] font-bold text-slate-600">
              or click anywhere to browse from your device
            </div>
          </div>

          {/* Uploaded Images List */}
          {images.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#E0E5EC] shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] border border-white/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-700 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  Attached Medical Images ({images.length})
                </span>
                <button
                  onClick={() => setImages([])}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative group p-2.5 rounded-xl bg-white/90 border border-slate-200 shadow-sm flex items-center gap-3 overflow-hidden"
                  >
                    <div
                      className="w-16 h-16 shrink-0 rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden cursor-pointer relative"
                      onClick={() => setPreviewModalImg(img.data)}
                      title="Click to zoom in"
                    >
                      <img
                        src={img.data}
                        alt={img.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{img.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {img.category ? img.category.replace('_', ' ').toUpperCase() : 'Medical Image'}
                      </div>
                      <button
                        onClick={() => setPreviewModalImg(img.data)}
                        className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1 mt-1"
                      >
                        <Maximize2 className="w-3 h-3" />
                        Full Preview
                      </button>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(img.id);
                      }}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Patient Details & Analysis Trigger (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-[#E0E5EC] shadow-[8px_8px_16px_#b8b9be,-8px_-8px_16px_#ffffff] border border-white/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                Clinical Context (Optional)
              </span>
              <button
                onClick={() => setShowPatientDetails(!showPatientDetails)}
                className="text-[11px] font-bold text-blue-600 hover:underline"
              >
                {showPatientDetails ? 'Hide details' : 'Edit details'}
              </button>
            </div>

            {/* Quick Symptom & Duration Note */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  What are you experiencing? / Description
                </label>
                <textarea
                  id="input-image-symptoms"
                  rows={2}
                  value={symptomsText}
                  onChange={(e) => setSymptomsText(e.target.value)}
                  placeholder="e.g. Red itchy rash on arm that started 3 days ago, or sharp throat pain"
                  className="w-full p-2.5 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Symptoms Duration</label>
                  <input
                    type="text"
                    value={durationText}
                    onChange={(e) => setDurationText(e.target.value)}
                    placeholder="e.g. 3 Days"
                    className="w-full p-2 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-slate-800 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Target Body Region</label>
                  <select
                    value={bodyRegionHint}
                    onChange={(e) => setBodyRegionHint(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-slate-800 text-xs focus:outline-none"
                  >
                    <option value="auto">✨ AI Auto-Detect</option>
                    <option value="skin">Skin / Dermatology</option>
                    <option value="chest_lungs">Chest & Lungs</option>
                    <option value="throat_neck">Throat & Neck</option>
                    <option value="eyes_ears">Eyes & Face</option>
                    <option value="head">Head & Brain</option>
                    <option value="stomach_digestive">Stomach & Digestive</option>
                    <option value="spine_back">Spine & Back</option>
                    <option value="joints_muscles">Joints & Muscles</option>
                    <option value="whole_body">Whole Body / Labs</option>
                  </select>
                </div>
              </div>

              {/* Extended Patient Details Collapsible */}
              {showPatientDetails && (
                <div className="pt-2 border-t border-slate-300 space-y-2 animate-fade-in">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Patient Name</label>
                      <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full p-2 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-slate-800 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 block mb-1">Age / Gender</label>
                      <div className="flex gap-1.5">
                        <input
                          type="number"
                          value={patientAge}
                          onChange={(e) => setPatientAge(Number(e.target.value))}
                          className="w-16 p-2 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-slate-800 text-xs focus:outline-none"
                        />
                        <select
                          value={patientGender}
                          onChange={(e) => setPatientGender(e.target.value as any)}
                          className="flex-1 p-2 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-slate-800 text-xs focus:outline-none"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              id="btn-analyze-generate-report"
              onClick={handleAnalyzeAndGenerateReport}
              disabled={isAnalyzing || images.length === 0}
              className={`w-full py-3.5 px-5 rounded-2xl text-xs md:text-sm font-black flex items-center justify-center gap-2 transition duration-200 shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] active:shadow-inner ${
                images.length === 0
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-70'
                  : isAnalyzing
                  ? 'bg-blue-700 text-white cursor-wait'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Analyzing Image & Synthesizing Report...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Analyze Image & Get Health Report</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            {/* Analysis Progress Steps */}
            {isAnalyzing && (
              <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2 animate-pulse">
                <div className="flex items-center justify-between text-[11px] font-bold text-blue-900">
                  <span>Gemini Vision Diagnostic Engine</span>
                  <span>Step {analysisStep + 1} of 4</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-blue-200 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${((analysisStep + 1) / 4) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-blue-700 font-medium">
                  {ANALYSIS_STEPS[analysisStep]}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Camera Snapshot Modal */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#E0E5EC] shadow-2xl border border-white/80 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-600" />
                Capture Symptom or Scan Photo
              </span>
              <button
                onClick={stopCamera}
                className="p-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  stopCamera();
                  setCameraFacing(cameraFacing === 'user' ? 'environment' : 'user');
                  setTimeout(startCamera, 200);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-[#E0E5EC] text-slate-700 text-xs font-bold shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] border border-white/60 hover:text-blue-600"
              >
                Flip Camera
              </button>

              <button
                id="btn-take-photo"
                onClick={capturePhoto}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black shadow-md hover:from-blue-700 hover:to-indigo-700 flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Snap Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Size Image Preview Modal */}
      {previewModalImg && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setPreviewModalImg(null)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-2xl p-2 cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewModalImg(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewModalImg}
              alt="Medical Scan Full Preview"
              className="max-w-full max-h-[80vh] object-contain rounded-xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
