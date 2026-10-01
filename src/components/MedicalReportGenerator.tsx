import React, { useState } from 'react';
import { BodyRegion, PatientProfile, VitalSigns, LabBiomarker } from '../types';
import { 
  FileText, 
  Sparkles, 
  Activity, 
  User, 
  Heart, 
  Thermometer, 
  Wind, 
  Droplets, 
  Flame, 
  ChevronRight,
  Stethoscope,
  ClipboardList,
  AlertCircle,
  HelpCircle,
  Plus
} from 'lucide-react';

interface MedicalReportGeneratorProps {
  onGenerateReport: (input: {
    patient: PatientProfile;
    vitals: VitalSigns;
    symptoms: string[];
    bodyRegion: BodyRegion;
    clinicalNotes: string;
    labBiomarkers: LabBiomarker[];
  }) => void;
  isLoading: boolean;
  selectedRegion: BodyRegion;
  onSelectRegion: (region: BodyRegion) => void;
}

const PRESET_CASES = [
  {
    id: 'case-1',
    title: 'Acid Reflux & Heartburn',
    region: 'stomach_digestive' as BodyRegion,
    patient: {
      name: 'Alexander Hayes',
      age: 42,
      gender: 'Male' as const,
      bloodGroup: 'O+',
      weightKg: 84,
      heightCm: 178,
      allergies: ['Penicillin'],
      chiefComplaint: 'Burning chest pain after eating and sour taste in throat',
      historyOfPresentIllness: 'Worse when lying down after meals. Has lasted 3 weeks, especially after drinking coffee.',
      symptomsDuration: '3 Weeks'
    },
    vitals: {
      bloodPressure: '128/82 mmHg',
      heartRate: 76,
      respiratoryRate: 16,
      temperature: '98.6 °F',
      oxygenSaturation: 99,
      bloodGlucose: '96 mg/dL',
      bmi: 26.5
    },
    symptoms: ['Heartburn / Chest burning', 'Sour taste in mouth', 'Stomach bloating after meals', 'Throat irritation']
  },
  {
    id: 'case-2',
    title: 'Asthma & Breathing Tightness',
    region: 'chest_lungs' as BodyRegion,
    patient: {
      name: 'Elena Rostova',
      age: 29,
      gender: 'Female' as const,
      bloodGroup: 'A+',
      weightKg: 62,
      heightCm: 168,
      allergies: ['Dust Mites', 'Sulfa drugs'],
      chiefComplaint: 'Shortness of breath, tight chest, and wheezing at night',
      historyOfPresentIllness: 'Triggered by cold weather and pollen. Needed quick-relief inhaler multiple times today.',
      symptomsDuration: '4 Days'
    },
    vitals: {
      bloodPressure: '122/78 mmHg',
      heartRate: 98,
      respiratoryRate: 22,
      temperature: '99.1 °F',
      oxygenSaturation: 94,
      bloodGlucose: '102 mg/dL',
      bmi: 22.0
    },
    symptoms: ['Shortness of breath', 'Wheezing when breathing out', 'Chest tightness', 'Dry cough']
  },
  {
    id: 'case-3',
    title: 'Throbbing Migraine Headache',
    region: 'head' as BodyRegion,
    patient: {
      name: 'Marcus Vance',
      age: 35,
      gender: 'Male' as const,
      bloodGroup: 'B+',
      weightKg: 78,
      heightCm: 182,
      allergies: ['None known'],
      chiefComplaint: 'Severe throbbing headache on one side with bright light sensitivity',
      historyOfPresentIllness: 'Saw zigzag flashing lights for 20 minutes before the severe head pain started. Feeling nauseous.',
      symptomsDuration: '18 Hours'
    },
    vitals: {
      bloodPressure: '136/88 mmHg',
      heartRate: 84,
      respiratoryRate: 18,
      temperature: '98.4 °F',
      oxygenSaturation: 98,
      bloodGlucose: '92 mg/dL',
      bmi: 23.5
    },
    symptoms: ['Pulsing one-sided headache', 'Flashing light visual spots', 'Sensitive to light and sound', 'Nausea']
  },
  {
    id: 'case-4',
    title: 'High Blood Sugar & Frequent Thirst',
    region: 'whole_body' as BodyRegion,
    patient: {
      name: 'Sarah Jenkins',
      age: 54,
      gender: 'Female' as const,
      bloodGroup: 'AB+',
      weightKg: 91,
      heightCm: 165,
      allergies: ['Aspirin'],
      chiefComplaint: 'Constantly thirsty, frequent night bathroom trips, and feeling tired',
      historyOfPresentIllness: 'Noticed unexplained weight loss despite eating normally. Mild blurry vision.',
      symptomsDuration: '2 Months'
    },
    vitals: {
      bloodPressure: '138/86 mmHg',
      heartRate: 80,
      respiratoryRate: 16,
      temperature: '98.6 °F',
      oxygenSaturation: 98,
      bloodGlucose: '215 mg/dL',
      bmi: 33.4
    },
    symptoms: ['Excessive thirst', 'Frequent urination (especially at night)', 'Tiredness and low energy', 'Blurry vision']
  }
];

export const MedicalReportGenerator: React.FC<MedicalReportGeneratorProps> = ({
  onGenerateReport,
  isLoading,
  selectedRegion,
  onSelectRegion
}) => {
  // Form State
  const [patientName, setPatientName] = useState('Alexander Hayes');
  const [patientAge, setPatientAge] = useState(42);
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [weightKg, setWeightKg] = useState(84);
  const [heightCm, setHeightCm] = useState(178);
  const [allergies, setAllergies] = useState('Penicillin');
  const [chiefComplaint, setChiefComplaint] = useState('Burning chest pain after eating and sour taste in throat');
  const [symptomsDuration, setSymptomsDuration] = useState('3 Weeks');
  const [clinicalNotes, setClinicalNotes] = useState('Symptoms worsen after eating heavy meals and when lying flat. No trouble swallowing.');

  // Vitals State
  const [bloodPressure, setBloodPressure] = useState('128/82');
  const [heartRate, setHeartRate] = useState(76);
  const [respiratoryRate, setRespiratoryRate] = useState(16);
  const [temperature, setTemperature] = useState('98.6');
  const [oxygenSaturation, setOxygenSaturation] = useState(99);
  const [bloodGlucose, setBloodGlucose] = useState('96');

  // Symptoms Tags
  const [symptomsList, setSymptomsList] = useState<string[]>([
    'Heartburn / Chest burning',
    'Sour taste in mouth',
    'Stomach fullness'
  ]);
  const [newSymptomText, setNewSymptomText] = useState('');

  const handleAddSymptom = () => {
    if (newSymptomText.trim() && !symptomsList.includes(newSymptomText.trim())) {
      setSymptomsList([...symptomsList, newSymptomText.trim()]);
      setNewSymptomText('');
    }
  };

  const handleRemoveSymptom = (sym: string) => {
    setSymptomsList(symptomsList.filter((s) => s !== sym));
  };

  const handleApplyPreset = (preset: typeof PRESET_CASES[0]) => {
    setPatientName(preset.patient.name);
    setPatientAge(preset.patient.age);
    setPatientGender(preset.patient.gender);
    setBloodGroup(preset.patient.bloodGroup);
    setWeightKg(preset.patient.weightKg);
    setHeightCm(preset.patient.heightCm);
    setAllergies(preset.patient.allergies.join(', '));
    setChiefComplaint(preset.patient.chiefComplaint);
    setSymptomsDuration(preset.patient.symptomsDuration);
    setClinicalNotes(preset.patient.historyOfPresentIllness);

    setBloodPressure(preset.vitals.bloodPressure.replace(' mmHg', ''));
    setHeartRate(preset.vitals.heartRate);
    setRespiratoryRate(preset.vitals.respiratoryRate);
    setTemperature(preset.vitals.temperature.replace(' °F', ''));
    setOxygenSaturation(preset.vitals.oxygenSaturation);
    setBloodGlucose(preset.vitals.bloodGlucose?.replace(' mg/dL', '') || '100');

    setSymptomsList(preset.symptoms);
    onSelectRegion(preset.region);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const patient: PatientProfile = {
      name: patientName || 'Anonymous Patient',
      patientId: `PT-${Math.floor(100000 + Math.random() * 900000)}`,
      age: Number(patientAge) || 30,
      gender: patientGender,
      bloodGroup: bloodGroup || 'Unknown',
      weightKg: Number(weightKg) || 70,
      heightCm: Number(heightCm) || 170,
      allergies: allergies.split(',').map(a => a.trim()).filter(Boolean),
      chiefComplaint: chiefComplaint || 'General health evaluation',
      historyOfPresentIllness: clinicalNotes,
      symptomsDuration: symptomsDuration || 'Recent onset'
    };

    const vitals: VitalSigns = {
      bloodPressure: `${bloodPressure} mmHg`,
      heartRate: Number(heartRate) || 75,
      respiratoryRate: Number(respiratoryRate) || 16,
      temperature: `${temperature} °F`,
      oxygenSaturation: Number(oxygenSaturation) || 98,
      bloodGlucose: `${bloodGlucose} mg/dL`,
      bmi: Number((weightKg / Math.pow(heightCm / 100, 2)).toFixed(1))
    };

    const labBiomarkers: LabBiomarker[] = [
      {
        name: 'Blood Pressure',
        value: `${bloodPressure}`,
        unit: 'mmHg',
        referenceRange: '90-120 / 60-80',
        status: parseInt(bloodPressure) > 130 ? 'high' : 'normal',
        clinicalSignificance: 'Measures how hard your heart pumps blood through your blood vessels.'
      },
      {
        name: 'Heart Rate (Pulse)',
        value: `${heartRate}`,
        unit: 'bpm',
        referenceRange: '60 - 100',
        status: heartRate > 100 ? 'high' : heartRate < 60 ? 'low' : 'normal',
        clinicalSignificance: 'Your resting heartbeats per minute.'
      },
      {
        name: 'Oxygen Level (SpO2)',
        value: `${oxygenSaturation}`,
        unit: '%',
        referenceRange: '95 - 100',
        status: oxygenSaturation < 95 ? 'critical' : 'normal',
        clinicalSignificance: 'Percentage of oxygen in your bloodstream.'
      },
      {
        name: 'Blood Sugar (Glucose)',
        value: `${bloodGlucose}`,
        unit: 'mg/dL',
        referenceRange: '70 - 99',
        status: parseInt(bloodGlucose) > 140 ? 'critical' : parseInt(bloodGlucose) > 100 ? 'high' : 'normal',
        clinicalSignificance: 'Measures energy fuel (sugar) circulating in your blood.'
      }
    ];

    onGenerateReport({
      patient,
      vitals,
      symptoms: symptomsList,
      bodyRegion: selectedRegion,
      clinicalNotes,
      labBiomarkers
    });
  };

  return (
    <div id="medical-report-generator-form" className="w-full rounded-3xl bg-[#E0E5EC] shadow-[10px_10px_20px_#b8b9be,-10px_-10px_20px_#ffffff] border border-white/80 p-6 md:p-8 space-y-6">
      {/* Workstation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-300">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Create Your Health & Medication Report
            </h2>
            <p className="text-xs text-slate-600">
              Enter your symptoms, check your vitals, and get an easy-to-understand medical report with clear medicine instructions
            </p>
          </div>
        </div>

        {/* 1-Click Clinical Case Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
            Quick Cases:
          </span>
          {PRESET_CASES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              id={`btn-preset-${preset.id}`}
              onClick={() => handleApplyPreset(preset)}
              className="px-3 py-1.5 rounded-xl bg-[#E0E5EC] text-[11px] font-bold text-slate-700 shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] border border-white/60 hover:text-blue-600 hover:shadow-[1px_1px_3px_#b8b9be,-1px_-1px_3px_#ffffff] whitespace-nowrap transition"
            >
              {preset.title.split(' / ')[0]}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Patient Demographics */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider">
            <User className="w-4 h-4 text-blue-600" />
            <span>1. Patient Demographics & Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Patient Full Name</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Age (Years)</label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Gender</label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value as any)}
                  className="w-full px-2.5 py-2.5 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-xs font-bold text-slate-900 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Blood Group</label>
                <input
                  type="text"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Known Allergies</label>
              <input
                type="text"
                placeholder="e.g. Penicillin, NSAIDs"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-xs font-semibold text-rose-700 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Clinical Vitals & Hemodynamics Panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>2. Vital Signs & Diagnostic Biomarkers</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Calibrated in real-time</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="p-3 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] border border-white/60">
              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                <Heart className="w-3 h-3 text-rose-500" /> Blood Pressure
              </span>
              <input
                type="text"
                value={bloodPressure}
                onChange={(e) => setBloodPressure(e.target.value)}
                className="w-full font-black text-slate-900 bg-transparent text-sm focus:outline-none"
              />
              <span className="text-[10px] text-slate-500">mmHg</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] border border-white/60">
              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                <Activity className="w-3 h-3 text-red-500" /> Heart Rate
              </span>
              <input
                type="number"
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                className="w-full font-black text-slate-900 bg-transparent text-sm focus:outline-none"
              />
              <span className="text-[10px] text-slate-500">bpm</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] border border-white/60">
              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                <Wind className="w-3 h-3 text-cyan-500" /> Respiration
              </span>
              <input
                type="number"
                value={respiratoryRate}
                onChange={(e) => setRespiratoryRate(Number(e.target.value))}
                className="w-full font-black text-slate-900 bg-transparent text-sm focus:outline-none"
              />
              <span className="text-[10px] text-slate-500">/min</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] border border-white/60">
              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                <Thermometer className="w-3 h-3 text-amber-500" /> Temperature
              </span>
              <input
                type="text"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full font-black text-slate-900 bg-transparent text-sm focus:outline-none"
              />
              <span className="text-[10px] text-slate-500">°F</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] border border-white/60">
              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                <Droplets className="w-3 h-3 text-blue-500" /> SpO2 Oximetry
              </span>
              <input
                type="number"
                value={oxygenSaturation}
                onChange={(e) => setOxygenSaturation(Number(e.target.value))}
                className="w-full font-black text-slate-900 bg-transparent text-sm focus:outline-none"
              />
              <span className="text-[10px] text-slate-500">% Saturation</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] border border-white/60">
              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                <Flame className="w-3 h-3 text-purple-500" /> Blood Glucose
              </span>
              <input
                type="text"
                value={bloodGlucose}
                onChange={(e) => setBloodGlucose(e.target.value)}
                className="w-full font-black text-slate-900 bg-transparent text-sm focus:outline-none"
              />
              <span className="text-[10px] text-slate-500">mg/dL</span>
            </div>
          </div>
        </div>

        {/* Section 3: Chief Complaint, Symptoms & Presenting Illness */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-wider">
            <ClipboardList className="w-4 h-4 text-indigo-600" />
            <span>3. Clinical Presentation & Symptoms Checklist</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Chief Complaint</label>
              <input
                type="text"
                required
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Symptom Duration</label>
              <input
                type="text"
                value={symptomsDuration}
                onChange={(e) => setSymptomsDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-xs font-bold text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Interactive Symptoms Tags */}
          <div className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600">Active Symptom Tags ({symptomsList.length})</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {symptomsList.map((sym) => (
                <span
                  key={sym}
                  className="px-3 py-1 rounded-xl bg-[#E0E5EC] text-xs font-bold text-slate-800 shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] border border-white/60 flex items-center gap-1.5"
                >
                  {sym}
                  <button
                    type="button"
                    onClick={() => handleRemoveSymptom(sym)}
                    className="text-rose-500 hover:text-rose-700 ml-1 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="+ Add symptom"
                  value={newSymptomText}
                  onChange={(e) => setNewSymptomText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSymptom();
                    }
                  }}
                  className="px-2.5 py-1 text-xs rounded-xl bg-transparent border border-dashed border-slate-400 text-slate-800 focus:outline-none focus:border-blue-600"
                />
                <button
                  type="button"
                  onClick={handleAddSymptom}
                  className="p-1 rounded-lg bg-blue-600 text-white text-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">Clinical History & Doctor's Observations</label>
            <textarea
              rows={2}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40 text-xs text-slate-800 focus:outline-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            id="btn-generate-ai-report"
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-2.5 transition-all shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] ${
              isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3)]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Synthesizing 3D Anatomy, Diagnostics & Rx Column...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Generate Official 3D Medical Diagnostic Report</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
