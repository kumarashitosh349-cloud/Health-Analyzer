export type BodyRegion = 
  | 'head'
  | 'eyes_ears'
  | 'throat_neck'
  | 'chest_lungs'
  | 'heart'
  | 'stomach_digestive'
  | 'liver_gallbladder'
  | 'kidneys_urinary'
  | 'spine_back'
  | 'joints_muscles'
  | 'skin'
  | 'reproductive'
  | 'whole_body';

export interface Symptom {
  id: string;
  name: string;
  category: BodyRegion;
  commonIn: string[];
}

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  brandNames: string[];
  drugClass: string;
  prescriptionType: 'OTC' | 'Prescription' | 'Specialist Only' | 'Dietary Supplement';
  purpose: string;
  mechanismOfAction: string; // Plain simple words
  typicalDosage: string;
  frequency: string;
  timingInstructions: string; // e.g. "Take after meals with a full glass of water"
  duration: string;
  commonSideEffects: string[];
  seriousWarnings: string[];
  contraindications: string[]; // Avoid if...
  drugInteractions: string[];
  dietaryPrecautions: string[];
  pillVisual: {
    color: string;
    secondaryColor?: string;
    shape: 'capsule' | 'round' | 'oval' | 'tablet';
    imprint?: string;
  };
}

export interface Disease {
  id: string;
  name: string;
  medicalTerm: string;
  icdCode?: string;
  category: string;
  bodyRegion: BodyRegion;
  matchScore?: number; // 0-100%
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical / Emergency';
  urgencyLevel: 'Home Care & Monitor' | 'Schedule Doctor Visit' | 'Urgent Care within 24h' | 'Emergency Room Now';
  
  // Easy to understand explanations
  simpleSummary: string; // 2-3 sentences plain language
  everydayAnalogy: string; // e.g., "Think of asthma like a clogged vacuum hose..."
  whatHappensInside: {
    step: number;
    title: string;
    description: string;
  }[];
  
  commonSymptoms: string[];
  triggersAndCauses: string[];
  emergencyRedFlags: string[]; // Seek immediate ER if these appear
  
  // Dedicated Medication & Treatment block
  medications: Medication[];
  homeRemedies: string[];
  dietaryAdvice: {
    recommended: string[];
    avoid: string[];
  };
  lifestyleTips: string[];
  recommendedSpecialist: string;
  preventionTips: string[];
}

export interface SymptomAnalysisRequest {
  symptoms: string[];
  customDescription: string;
  bodyRegion: BodyRegion;
  age?: number;
  gender?: string;
  duration?: string;
  severityScale?: number; // 1-10
  existingConditions?: string[];
  currentMedications?: string[];
}

export interface VitalSigns {
  bloodPressure: string; // e.g. "120/80 mmHg"
  heartRate: number; // e.g. 74 bpm
  respiratoryRate: number; // e.g. 16 /min
  temperature: string; // e.g. "98.6 °F"
  oxygenSaturation: number; // e.g. 98 %
  bloodGlucose?: string; // e.g. "105 mg/dL"
  bmi?: number;
}

export interface LabBiomarker {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'low' | 'high' | 'critical';
  clinicalSignificance: string;
}

export interface PrescribedMedication extends Medication {
  dosage: string;
  route: 'Oral' | 'Inhalation' | 'Topical' | 'Sublingual' | 'Intravenous' | 'Ophthalmic';
  quantity: string;
  refills: number;
  prescribingNotes: string;
  isPrescribedActive?: boolean;
}

export interface PatientProfile {
  name: string;
  patientId: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  weightKg: number;
  heightCm: number;
  allergies: string[];
  chiefComplaint: string;
  historyOfPresentIllness: string;
  symptomsDuration: string;
}

export interface MLModelInfo {
  modelType: string;
  nEstimators?: number;
  testAccuracy?: number;
  confidence: number;
  confidencePercentage: number;
  topPredictions: { disease: string; probability: number; confidence_percentage: number }[];
  featureContributions: { feature: string; symptom_name: string; importance_score: number; is_present: boolean }[];
  isMlActive: boolean;
}

export interface SymptomAnalysisResult {
  overview: string;
  triageLevel: string;
  triageExplanation: string;
  primaryCondition?: Disease;
  alternativeConditions?: Disease[];
  vitalEmergencySigns?: string[];
  doctorQuestionsToAsk?: string[];
  disclaimer: string;
  mlModelInfo?: MLModelInfo;
}

export interface UploadedMedicalImage {
  id: string;
  data: string; // Base64 or Data URL
  mimeType: string;
  name: string;
  sizeBytes?: number;
  previewUrl?: string;
  category?: 'symptom_photo' | 'xray_radiograph' | 'lab_report' | 'prescription_doc' | 'mri_ct' | 'other';
}

export interface ImageVisualFinding {
  label: string;
  description: string;
  confidence?: number;
  severity?: 'normal' | 'mild' | 'moderate' | 'critical';
  location?: string;
}

export interface MedicalImageAnalysis {
  imageTypeDetected: string;
  visualObservations: string[];
  findingsList: ImageVisualFinding[];
  confidenceScore: number;
  detectedRegion: BodyRegion;
  summary: string;
}

export interface MedicalReport {
  id: string;
  reportNumber: string;
  generatedDate: string;
  facilityName: string;
  attendingPhysician: {
    name: string;
    specialty: string;
    licenseNumber: string;
    digitalSignatureVerified: boolean;
    credentials?: string;
  };
  patient: PatientProfile;
  vitals: VitalSigns;
  labBiomarkers: LabBiomarker[];
  targetOrgan: BodyRegion;
  clinicalImpression: {
    primaryDiagnosis: string;
    icd10Code: string;
    severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical / Emergency';
    triageLevel: 'Self-Care' | 'Routine Doctor Visit' | 'Urgent Care' | 'Emergency';
    summary: string;
    everydayAnalogy: string;
    pathophysiologySteps: { step: number; title: string; description: string }[];
    urgencyLevel?: string;
  };
  differentialDiagnoses: {
    condition: string;
    probability: number;
    reasoning: string;
  }[];
  prescriptions: PrescribedMedication[];
  nonPharmacologicalPlan: {
    dietaryDirectives: { recommended: string[]; avoid: string[] };
    lifestyleModifications: string[];
    homeRemedies: string[];
  };
  followUpPlan: {
    timeframe: string;
    recommendedSpecialist: string;
    emergencyRedFlags: string[];
    doctorQuestions: string[];
  };
  verificationHash: string;
  disclaimer: string;
  plainLanguageExplanation?: string;
  nonPharmacologicalAdvice?: { title: string; description: string; category: string }[];
  redFlagEmergencySymptoms?: string[];
  // Image attachments & visual diagnostic metadata
  uploadedImages?: UploadedMedicalImage[];
  imageAnalysis?: MedicalImageAnalysis;
}


