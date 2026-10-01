export interface SampleMedicalImagePreset {
  id: string;
  title: string;
  category: 'symptom_photo' | 'xray_radiograph' | 'lab_report' | 'prescription_doc';
  bodyRegion: string;
  badge: string;
  description: string;
  sampleSymptom: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  imageDataUrl: string;
}

// Inline SVG data URLs for instant, offline-safe preset demonstrations
export const SAMPLE_MEDICAL_PRESETS: SampleMedicalImagePreset[] = [
  {
    id: 'preset-eczema',
    title: 'Itchy Skin Rash / Eczema',
    category: 'symptom_photo',
    bodyRegion: 'skin',
    badge: 'Skin Photo',
    description: 'Red, itchy patches on the arm with dry, flaking skin and light scratch marks.',
    sampleSymptom: 'Intense itching, red patches on arm that flare up after hot showers, dry skin',
    patientName: 'Emma Richardson',
    patientAge: 28,
    patientGender: 'Female',
    imageDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
        <defs>
          <radialGradient id="skin" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stop-color="#fbd38d"/>
            <stop offset="100%" stop-color="#e2b774"/>
          </radialGradient>
          <radialGradient id="rashCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#dc2626" stop-opacity="0.85"/>
            <stop offset="40%" stop-color="#ef4444" stop-opacity="0.6"/>
            <stop offset="80%" stop-color="#f87171" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#f87171" stop-opacity="0"/>
          </radialGradient>
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="4" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
        <!-- Forearm skin canvas -->
        <rect width="600" height="450" fill="url(#skin)"/>
        <!-- Arm contour -->
        <path d="M 50,0 Q 280,50 550,0 L 600,450 Q 300,410 0,450 Z" fill="#edd0a4" opacity="0.4"/>
        <!-- Main Erythematous Plaque Area -->
        <ellipse cx="300" cy="225" rx="140" ry="90" fill="url(#rashCenter)" filter="url(#noise)"/>
        <ellipse cx="360" cy="250" rx="70" ry="50" fill="#dc2626" opacity="0.45" filter="url(#noise)"/>
        <ellipse cx="230" cy="200" rx="60" ry="40" fill="#dc2626" opacity="0.35" filter="url(#noise)"/>
        <!-- Maculopapular dots & excoriations -->
        <circle cx="280" cy="210" r="4" fill="#b91c1c" opacity="0.8"/>
        <circle cx="310" cy="230" r="5" fill="#991b1b" opacity="0.85"/>
        <circle cx="340" cy="215" r="3.5" fill="#b91c1c" opacity="0.7"/>
        <circle cx="295" cy="245" r="4.5" fill="#991b1b" opacity="0.8"/>
        <circle cx="260" cy="235" r="3" fill="#b91c1c" opacity="0.75"/>
        <circle cx="330" cy="260" r="4" fill="#991b1b" opacity="0.7"/>
        <circle cx="370" cy="240" r="3" fill="#b91c1c" opacity="0.6"/>
        <!-- Scratch mark excoriation lines -->
        <path d="M 270,195 Q 310,210 350,205" stroke="#7f1d1d" stroke-width="2" fill="none" opacity="0.7"/>
        <path d="M 285,240 Q 320,250 345,238" stroke="#7f1d1d" stroke-width="1.5" fill="none" opacity="0.65"/>
        <!-- Clinical Overlay Tag -->
        <rect x="20" y="20" width="220" height="42" rx="8" fill="#0f172a" fill-opacity="0.85"/>
        <text x="32" y="42" fill="#38bdf8" font-family="Arial, sans-serif" font-size="11" font-weight="bold">CLINICAL DERMATOLOGY PHOTO</text>
        <text x="32" y="55" fill="#94a3b8" font-family="Arial, sans-serif" font-size="9">Flexor Forearm • Pruritic Plaque</text>
      </svg>
    `)}`
  },
  {
    id: 'preset-xray',
    title: 'Chest X-Ray / Chest Cold & Cough',
    category: 'xray_radiograph',
    bodyRegion: 'chest_lungs',
    badge: 'Chest X-Ray',
    description: 'X-ray scan of lungs showing clear lung tissue with slight swelling in the breathing tubes.',
    sampleSymptom: 'Persistent deep cough, wheezing when exhaling, chest tightness, low fever',
    patientName: 'David Chen',
    patientAge: 45,
    patientGender: 'Male',
    imageDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
        <defs>
          <linearGradient id="xrayBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#05070a"/>
            <stop offset="100%" stop-color="#0a1018"/>
          </linearGradient>
          <radialGradient id="lungField" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#1e293b"/>
            <stop offset="100%" stop-color="#090d14"/>
          </radialGradient>
        </defs>
        <!-- X-Ray black film background -->
        <rect width="600" height="450" fill="url(#xrayBg)"/>
        <!-- Spine / Vertebral column shadow -->
        <rect x="290" y="40" width="20" height="340" fill="#e2e8f0" opacity="0.35" rx="3"/>
        <!-- Rib cage silhouettes -->
        <path d="M 300,90 Q 200,95 140,140 Q 200,165 300,145" stroke="#cbd5e1" stroke-width="8" stroke-opacity="0.3" fill="none"/>
        <path d="M 300,90 Q 400,95 460,140 Q 400,165 300,145" stroke="#cbd5e1" stroke-width="8" stroke-opacity="0.3" fill="none"/>
        <path d="M 300,145 Q 180,155 120,210 Q 190,230 300,205" stroke="#cbd5e1" stroke-width="9" stroke-opacity="0.32" fill="none"/>
        <path d="M 300,145 Q 420,155 480,210 Q 410,230 300,205" stroke="#cbd5e1" stroke-width="9" stroke-opacity="0.32" fill="none"/>
        <path d="M 300,205 Q 160,225 110,285 Q 180,305 300,270" stroke="#cbd5e1" stroke-width="9" stroke-opacity="0.3" fill="none"/>
        <path d="M 300,205 Q 440,225 490,285 Q 420,305 300,270" stroke="#cbd5e1" stroke-width="9" stroke-opacity="0.3" fill="none"/>
        <!-- Left & Right Lung transparency zones -->
        <ellipse cx="215" cy="220" rx="75" ry="110" fill="url(#lungField)" opacity="0.9"/>
        <ellipse cx="385" cy="220" rx="75" ry="110" fill="url(#lungField)" opacity="0.9"/>
        <!-- Bronchovascular tree markings -->
        <path d="M 285,170 Q 235,210 190,240 M 260,200 Q 220,230 180,270 M 245,220 Q 210,250 175,280" stroke="#e2e8f0" stroke-width="2.5" stroke-opacity="0.45" fill="none"/>
        <path d="M 315,170 Q 365,210 410,240 M 340,200 Q 380,230 420,270 M 355,220 Q 390,250 425,280" stroke="#e2e8f0" stroke-width="2.5" stroke-opacity="0.45" fill="none"/>
        <!-- Heart cardiac silhouette -->
        <path d="M 280,180 Q 240,260 270,330 Q 340,340 370,300 Q 360,220 320,180 Z" fill="#e2e8f0" opacity="0.45"/>
        <!-- Diaphragm domes -->
        <path d="M 100,350 Q 200,320 280,345" stroke="#f1f5f9" stroke-width="5" stroke-opacity="0.6" fill="none"/>
        <path d="M 320,345 Q 400,330 500,360" stroke="#f1f5f9" stroke-width="5" stroke-opacity="0.6" fill="none"/>
        <!-- Radiograph Markers -->
        <text x="540" y="50" fill="#f8fafc" font-family="monospace" font-size="22" font-weight="bold" opacity="0.8">R</text>
        <rect x="20" y="20" width="220" height="42" rx="8" fill="#0f172a" fill-opacity="0.85"/>
        <text x="32" y="42" fill="#38bdf8" font-family="Arial, sans-serif" font-size="11" font-weight="bold">CHEST RADIOGRAPH (PA VIEW)</text>
        <text x="32" y="55" fill="#94a3b8" font-family="Arial, sans-serif" font-size="9">Bronchovascular Pattern Analysis</text>
      </svg>
    `)}`
  },
  {
    id: 'preset-throat',
    title: 'Strep Throat / Swollen Tonsils',
    category: 'symptom_photo',
    bodyRegion: 'throat_neck',
    badge: 'Throat Photo',
    description: 'Inside of mouth showing enlarged, red tonsils with small white spots and throat irritation.',
    sampleSymptom: 'Sharp pain when swallowing, swollen neck glands, hoarseness, feeling feverish',
    patientName: 'Lucas Bennett',
    patientAge: 21,
    patientGender: 'Male',
    imageDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
        <defs>
          <radialGradient id="oralCavity" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stop-color="#450a0a"/>
            <stop offset="70%" stop-color="#881337"/>
            <stop offset="100%" stop-color="#be123c"/>
          </radialGradient>
        </defs>
        <!-- Oral background -->
        <rect width="600" height="450" fill="#fda4af"/>
        <!-- Open Mouth contour -->
        <ellipse cx="300" cy="225" rx="240" ry="180" fill="url(#oralCavity)"/>
        <!-- Tongue below -->
        <ellipse cx="300" cy="370" rx="200" ry="90" fill="#f43f5e"/>
        <path d="M 200,340 Q 300,310 400,340" stroke="#be123c" stroke-width="4" fill="none"/>
        <!-- Uvula center -->
        <path d="M 285,130 Q 285,210 300,215 Q 315,210 315,130 Z" fill="#e11d48"/>
        <!-- Left Tonsil (Enlarged + inflamed) -->
        <ellipse cx="170" cy="220" rx="45" ry="60" fill="#b91c1c"/>
        <circle cx="160" cy="210" r="5" fill="#fef08a"/>
        <circle cx="175" cy="225" r="6" fill="#fef08a"/>
        <circle cx="165" cy="245" r="4" fill="#fef08a"/>
        <!-- Right Tonsil (Enlarged + inflamed) -->
        <ellipse cx="430" cy="220" rx="45" ry="60" fill="#b91c1c"/>
        <circle cx="440" cy="205" r="5.5" fill="#fef08a"/>
        <circle cx="425" cy="225" r="6" fill="#fef08a"/>
        <circle cx="435" cy="245" r="4" fill="#fef08a"/>
        <!-- Clinical Overlay Tag -->
        <rect x="20" y="20" width="220" height="42" rx="8" fill="#0f172a" fill-opacity="0.85"/>
        <text x="32" y="42" fill="#38bdf8" font-family="Arial, sans-serif" font-size="11" font-weight="bold">THROAT & TONSIL PHOTO</text>
        <text x="32" y="55" fill="#94a3b8" font-family="Arial, sans-serif" font-size="9">Swollen Tonsils & White Spots</text>
      </svg>
    `)}`
  },
  {
    id: 'preset-eye',
    title: 'Pink Eye / Eye Allergy (Conjunctivitis)',
    category: 'symptom_photo',
    bodyRegion: 'eyes_ears',
    badge: 'Eye Photo',
    description: 'Eye photo showing red, irritated blood vessels in the white of the eye with watery swelling.',
    sampleSymptom: 'Gritty burning sensation in eye, intense itching, red sclera, watery morning crusting',
    patientName: 'Sophia Miller',
    patientAge: 32,
    patientGender: 'Female',
    imageDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
        <defs>
          <radialGradient id="iris" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#0284c7"/>
            <stop offset="60%" stop-color="#0369a1"/>
            <stop offset="100%" stop-color="#075985"/>
          </radialGradient>
        </defs>
        <!-- Eyelid / Skin canvas -->
        <rect width="600" height="450" fill="#fed7aa"/>
        <!-- Eye shape outline -->
        <path d="M 80,225 Q 300,80 520,225 Q 300,370 80,225 Z" fill="#fff1f2"/>
        <!-- Conjunctival injection / red blood vessels -->
        <path d="M 120,225 Q 180,200 220,220 M 140,210 Q 190,170 230,190 M 130,240 Q 180,260 220,245" stroke="#ef4444" stroke-width="2.5" stroke-opacity="0.8" fill="none"/>
        <path d="M 480,225 Q 420,200 380,220 M 460,210 Q 410,170 370,190 M 470,240 Q 420,260 380,245" stroke="#ef4444" stroke-width="2.5" stroke-opacity="0.8" fill="none"/>
        <!-- Iris & Pupil -->
        <circle cx="300" cy="225" r="75" fill="url(#iris)"/>
        <circle cx="300" cy="225" r="32" fill="#09090b"/>
        <circle cx="315" cy="210" r="10" fill="#ffffff" opacity="0.85"/>
        <!-- Eyelids & Lashes -->
        <path d="M 80,225 Q 300,80 520,225" stroke="#b45309" stroke-width="5" fill="none"/>
        <path d="M 80,225 Q 300,370 520,225" stroke="#b45309" stroke-width="4" fill="none"/>
        <!-- Clinical Overlay Tag -->
        <rect x="20" y="20" width="220" height="42" rx="8" fill="#0f172a" fill-opacity="0.85"/>
        <text x="32" y="42" fill="#38bdf8" font-family="Arial, sans-serif" font-size="11" font-weight="bold">EYE CLOSE-UP PHOTO</text>
        <text x="32" y="55" fill="#94a3b8" font-family="Arial, sans-serif" font-size="9">Red Blood Vessels & Irritation</text>
      </svg>
    `)}`
  },
  {
    id: 'preset-lab',
    title: 'Blood Test Lab Results Sheet',
    category: 'lab_report',
    bodyRegion: 'whole_body',
    badge: 'Blood Test Sheet',
    description: 'Lab test results sheet showing higher fasting blood sugar and cholesterol levels.',
    sampleSymptom: 'Excessive thirst, increased urination at night, fatigue, borderline high blood sugar',
    patientName: 'Robert Martinez',
    patientAge: 51,
    patientGender: 'Male',
    imageDataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
        <!-- Lab report paper -->
        <rect width="600" height="450" fill="#f8fafc"/>
        <rect x="20" y="20" width="560" height="410" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
        <!-- Top Lab Header Bar -->
        <rect x="20" y="20" width="560" height="45" fill="#1e3a8a"/>
        <text x="40" y="48" fill="#ffffff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">METROPOLITAN CLINICAL LABORATORIES</text>
        <text x="450" y="48" fill="#93c5fd" font-family="monospace" font-size="11">PANEL #CMP-9812</text>
        <!-- Table Column Headers -->
        <rect x="35" y="80" width="530" height="24" fill="#e2e8f0"/>
        <text x="45" y="96" fill="#334155" font-family="Arial, sans-serif" font-size="10" font-weight="bold">BIOMARKER TEST</text>
        <text x="220" y="96" fill="#334155" font-family="Arial, sans-serif" font-size="10" font-weight="bold">RESULT</text>
        <text x="320" y="96" fill="#334155" font-family="Arial, sans-serif" font-size="10" font-weight="bold">REFERENCE</text>
        <text x="440" y="96" fill="#334155" font-family="Arial, sans-serif" font-size="10" font-weight="bold">STATUS</text>
        <!-- Rows -->
        <!-- Row 1: Glucose (HIGH) -->
        <rect x="35" y="115" width="530" height="32" fill="#fef2f2"/>
        <text x="45" y="135" fill="#0f172a" font-family="Arial, sans-serif" font-size="11" font-weight="bold">Fasting Serum Glucose</text>
        <text x="220" y="135" fill="#dc2626" font-family="Arial, sans-serif" font-size="12" font-weight="bold">126 mg/dL</text>
        <text x="320" y="135" fill="#64748b" font-family="Arial, sans-serif" font-size="10">70 - 99 mg/dL</text>
        <rect x="440" y="122" width="60" height="18" rx="4" fill="#ef4444"/>
        <text x="455" y="135" fill="#ffffff" font-family="Arial, sans-serif" font-size="10" font-weight="bold">HIGH</text>
        <!-- Row 2: HbA1c (HIGH) -->
        <rect x="35" y="155" width="530" height="32" fill="#fff7ed"/>
        <text x="45" y="175" fill="#0f172a" font-family="Arial, sans-serif" font-size="11" font-weight="bold">Hemoglobin A1c</text>
        <text x="220" y="175" fill="#ea580c" font-family="Arial, sans-serif" font-size="12" font-weight="bold">6.8 %</text>
        <text x="320" y="175" fill="#64748b" font-family="Arial, sans-serif" font-size="10">&lt; 5.7 %</text>
        <rect x="440" y="162" width="60" height="18" rx="4" fill="#f97316"/>
        <text x="455" y="175" fill="#ffffff" font-family="Arial, sans-serif" font-size="10" font-weight="bold">ELEV</text>
        <!-- Row 3: Total Cholesterol (BORDERLINE) -->
        <rect x="35" y="195" width="530" height="32" fill="#fffbeb"/>
        <text x="45" y="215" fill="#0f172a" font-family="Arial, sans-serif" font-size="11" font-weight="bold">Total Cholesterol</text>
        <text x="220" y="215" fill="#d97706" font-family="Arial, sans-serif" font-size="12" font-weight="bold">218 mg/dL</text>
        <text x="320" y="215" fill="#64748b" font-family="Arial, sans-serif" font-size="10">&lt; 200 mg/dL</text>
        <rect x="440" y="202" width="60" height="18" rx="4" fill="#f59e0b"/>
        <text x="452" y="215" fill="#ffffff" font-family="Arial, sans-serif" font-size="10" font-weight="bold">MOD</text>
        <!-- Row 4: Creatinine (NORMAL) -->
        <rect x="35" y="235" width="530" height="32" fill="#ffffff"/>
        <text x="45" y="255" fill="#0f172a" font-family="Arial, sans-serif" font-size="11">Serum Creatinine</text>
        <text x="220" y="255" fill="#16a34a" font-family="Arial, sans-serif" font-size="12">0.92 mg/dL</text>
        <text x="320" y="255" fill="#64748b" font-family="Arial, sans-serif" font-size="10">0.60 - 1.20 mg/dL</text>
        <rect x="440" y="242" width="60" height="18" rx="4" fill="#10b981"/>
        <text x="448" y="255" fill="#ffffff" font-family="Arial, sans-serif" font-size="10" font-weight="bold">NORMAL</text>
        <!-- Watermark / Footer -->
        <text x="45" y="310" fill="#94a3b8" font-family="Arial, sans-serif" font-size="9">Pathologist Signature: Dr. K. Lawson, MD • Verified Automated Clinical Chemistry Analyzer</text>
      </svg>
    `)}`
  }
];
