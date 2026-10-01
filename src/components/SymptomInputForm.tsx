import React, { useState } from 'react';
import { BodyRegion, SymptomAnalysisRequest } from '../types';
import { COMMON_SYMPTOMS } from '../data/sampleDiseases';
import { 
  Sparkles, 
  Plus, 
  X, 
  Sliders, 
  Zap,
  Activity
} from 'lucide-react';

interface SymptomInputFormProps {
  selectedRegion: BodyRegion;
  onSelectRegion: (region: BodyRegion) => void;
  onSubmit: (request: SymptomAnalysisRequest) => void;
  isLoading: boolean;
}

export const SymptomInputForm: React.FC<SymptomInputFormProps> = ({
  selectedRegion,
  onSelectRegion,
  onSubmit,
  isLoading
}) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Throbbing Headache', 'Nausea & Queasiness']);
  const [customDescription, setCustomDescription] = useState('');
  const [customInputText, setCustomInputText] = useState('');
  const [age, setAge] = useState<number>(32);
  const [gender, setGender] = useState<string>('Not Specified');
  const [duration, setDuration] = useState<string>('2-3 Days');
  const [severityScale, setSeverityScale] = useState<number>(6);
  const [existingConditions] = useState<string[]>([]);

  const toggleSymptom = (name: string) => {
    if (selectedSymptoms.includes(name)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== name));
    } else {
      setSelectedSymptoms([...selectedSymptoms, name]);
    }
  };

  const handleAddCustomSymptom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInputText.trim() && !selectedSymptoms.includes(customInputText.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customInputText.trim()]);
      setCustomInputText('');
    }
  };

  const handleLoadPreset = (preset: {
    region: BodyRegion;
    symptoms: string[];
    description: string;
    severity: number;
    duration: string;
  }) => {
    onSelectRegion(preset.region);
    setSelectedSymptoms(preset.symptoms);
    setCustomDescription(preset.description);
    setSeverityScale(preset.severity);
    setDuration(preset.duration);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0 && !customDescription.trim()) return;

    onSubmit({
      symptoms: selectedSymptoms,
      customDescription,
      bodyRegion: selectedRegion,
      age,
      gender,
      duration,
      severityScale,
      existingConditions
    });
  };

  // Filter symptoms matching current body region or whole body
  const relevantSymptoms = COMMON_SYMPTOMS.filter(
    (s) => s.category === selectedRegion || s.category === 'whole_body'
  );

  return (
    <form id="symptom-input-form" onSubmit={handleSubmit} className="space-y-6">
      {/* Quick Demo Presets Banner */}
      <div className="bg-[#E0E5EC] rounded-3xl p-5 sm:p-6 shadow-[10px_10px_20px_#b8b9be,-10px_-10px_20px_#ffffff] border border-white/70">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Quick Case Presets (1-Click Load)</span>
          </span>
          <span className="text-[11px] text-slate-500 font-medium">Instant AI Diagnosis Test</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() =>
              handleLoadPreset({
                region: 'head',
                symptoms: ['Throbbing Headache', 'Nausea & Queasiness', 'Dizziness & Lightheadedness'],
                description: 'Severe pulsating right-sided headache with flashing zig-zag aura in vision and light sensitivity.',
                severity: 7,
                duration: '12 Hours'
              })
            }
            className="p-3 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#b8b9be,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/60 text-left transition group"
          >
            <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600">Migraine & Aura</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Head • Throbbing</p>
          </button>

          <button
            type="button"
            onClick={() =>
              handleLoadPreset({
                region: 'stomach_digestive',
                symptoms: ['Burning Chest Pain / Heartburn', 'Sharp Abdominal Pain & Bloating'],
                description: 'Burning fiery feeling behind breastbone after heavy dinner, sour acidic regurgitation when lying down.',
                severity: 6,
                duration: '1 Week'
              })
            }
            className="p-3 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#b8b9be,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/60 text-left transition group"
          >
            <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600">Acid Reflux (GERD)</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Stomach • Heartburn</p>
          </button>

          <button
            type="button"
            onClick={() =>
              handleLoadPreset({
                region: 'chest_lungs',
                symptoms: ['Chest Tightness / Wheezing', 'Persistent Dry Cough'],
                description: 'High-pitched wheezing whistle when breathing out, tight chest during cold morning air, nocturnal coughing.',
                severity: 6,
                duration: '3-4 Days'
              })
            }
            className="p-3 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#b8b9be,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/60 text-left transition group"
          >
            <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600">Asthma Wheezing</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Lungs • Airway Spasm</p>
          </button>

          <button
            type="button"
            onClick={() =>
              handleLoadPreset({
                region: 'whole_body',
                symptoms: ['Frequent Thirst & Urination', 'Chronic Fatigue & Weakness'],
                description: 'Constantly thirsty, waking up 4 times a night to urinate, tingling pins-and-needles sensation in feet.',
                severity: 5,
                duration: '1 Month'
              })
            }
            className="p-3 rounded-2xl bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#b8b9be,-2px_-2px_4px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/60 text-left transition group"
          >
            <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600">Type 2 Diabetes</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Metabolic • Thirst</p>
          </button>
        </div>
      </div>

      {/* Selected Symptoms Badges & Tag Cloud */}
      <div className="bg-[#E0E5EC] rounded-3xl p-6 sm:p-7 shadow-[10px_10px_20px_#b8b9be,-10px_-10px_20px_#ffffff] border border-white/70 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Select Symptoms</span>
          </h3>
          <span className="text-xs font-mono font-bold text-blue-700 bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] px-3 py-1 rounded-full border border-white/40">
            {selectedSymptoms.length} Selected
          </span>
        </div>

        {/* Selected Badges */}
        {selectedSymptoms.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3.5 bg-[#E0E5EC] rounded-2xl shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] border border-white/40">
            {selectedSymptoms.map((symptom) => (
              <span
                key={symptom}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E0E5EC] text-blue-800 shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] border border-white/50 text-xs font-bold"
              >
                <span>{symptom}</span>
                <button
                  type="button"
                  onClick={() => toggleSymptom(symptom)}
                  className="p-0.5 rounded-full hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Suggested Symptoms Matching Current 3D Organ */}
        <div>
          <span className="text-xs text-slate-600 block mb-2 font-bold">
            Symptoms for {selectedRegion.replace('_', ' ').toUpperCase()}:
          </span>
          <div className="flex flex-wrap gap-2">
            {relevantSymptoms.map((s) => {
              const isSelected = selectedSymptoms.includes(s.name);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSymptom(s.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold border-blue-500 shadow-[0_2px_8px_rgba(37,99,235,0.35)]'
                      : 'bg-[#E0E5EC] text-slate-700 border-white/50 shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] hover:shadow-[1px_1px_3px_#b8b9be,-1px_-1px_3px_#ffffff]'
                  }`}
                >
                  <Plus className={`w-3 h-3 ${isSelected ? 'rotate-45' : ''} transition-transform`} />
                  <span>{s.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Symptom Input */}
        <div className="flex items-center gap-2">
          <input
            id="input-custom-symptom"
            type="text"
            placeholder="Type any other custom symptom..."
            value={customInputText}
            onChange={(e) => setCustomInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomSymptom(e);
              }
            }}
            className="flex-1 bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] border border-white/50 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <button
            type="button"
            onClick={handleAddCustomSymptom}
            className="px-4 py-2.5 bg-[#E0E5EC] hover:bg-[#d8dde4] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] text-slate-800 rounded-2xl text-xs font-bold border border-white/60 transition"
          >
            Add
          </button>
        </div>

        {/* Natural Language Detailed Description */}
        <div className="pt-2">
          <label htmlFor="textarea-description" className="block text-xs font-bold text-slate-700 mb-1.5">
            Describe in your own words (triggers, timing, sensations):
          </label>
          <textarea
            id="textarea-description"
            rows={3}
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            placeholder="e.g., The pain feels like a tight band around my head, especially when looking at computer screens. I took an ibuprofen yesterday with only slight relief..."
            className="w-full bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] border border-white/50 rounded-2xl p-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 leading-relaxed resize-none font-medium"
          />
        </div>
      </div>

      {/* Patient Profile, Severity Slider & Duration */}
      <div className="bg-[#E0E5EC] rounded-3xl p-6 sm:p-7 shadow-[10px_10px_20px_#b8b9be,-10px_-10px_20px_#ffffff] border border-white/70 space-y-5">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <span>Patient Parameters & Severity</span>
        </h3>

        {/* Severity Scale Slider (1-10) */}
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-slate-700">Discomfort / Severity Scale:</span>
            <span className="font-mono font-bold text-blue-700 px-2.5 py-0.5 rounded-lg bg-[#E0E5EC] shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff] border border-white/40">
              {severityScale}/10 • {severityScale <= 3 ? 'Mild' : severityScale <= 7 ? 'Moderate' : 'Severe / Extreme'}
            </span>
          </div>
          <input
            id="slider-severity"
            type="range"
            min={1}
            max={10}
            value={severityScale}
            onChange={(e) => setSeverityScale(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-600 shadow-[inset_2px_2px_4px_#b8b9be,inset_-2px_-2px_4px_#ffffff]"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1 font-semibold">
            <span>1 (Barely noticeable)</span>
            <span>5 (Distracting)</span>
            <span>10 (Agonizing / Unbearable)</span>
          </div>
        </div>

        {/* Grid: Age, Gender, Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="input-age" className="block text-xs font-bold text-slate-600 mb-1">
              Age (Years):
            </label>
            <input
              id="input-age"
              type="number"
              min={1}
              max={120}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] border border-white/50 rounded-2xl px-3.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div>
            <label htmlFor="select-gender" className="block text-xs font-bold text-slate-600 mb-1">
              Biological Sex:
            </label>
            <select
              id="select-gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] border border-white/50 rounded-2xl px-3.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="Not Specified">Not Specified</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label htmlFor="select-duration" className="block text-xs font-bold text-slate-600 mb-1">
              Symptom Duration:
            </label>
            <select
              id="select-duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-[#E0E5EC] shadow-[inset_3px_3px_6px_#b8b9be,inset_-3px_-3px_6px_#ffffff] border border-white/50 rounded-2xl px-3.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="Less than 24 Hours">Less than 24 Hours</option>
              <option value="2-3 Days">2-3 Days</option>
              <option value="1-2 Weeks">1-2 Weeks</option>
              <option value="Over a Month (Chronic)">Over a Month (Chronic)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Action Button */}
      <button
        id="btn-analyze-symptoms"
        type="submit"
        disabled={isLoading || (selectedSymptoms.length === 0 && !customDescription.trim())}
        className={`w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 transition-all cursor-pointer shadow-[8px_8px_16px_#b8b9be,-8px_-8px_16px_#ffffff] ${
          isLoading
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)] hover:scale-[1.01]'
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            <span>Scanning 3D Anatomical Organs & Pharmacopeia...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 text-white" />
            <span>Run 3D AI Diagnosis & Medication Guide</span>
          </>
        )}
      </button>
    </form>
  );
};
