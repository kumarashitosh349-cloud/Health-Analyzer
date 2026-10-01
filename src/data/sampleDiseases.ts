import { Disease, Symptom } from '../types';

export const COMMON_SYMPTOMS: Symptom[] = [
  { id: 'headache_throbbing', name: 'Throbbing Headache', category: 'head', commonIn: ['Migraine', 'Tension Headache', 'Sinusitis'] },
  { id: 'fever_chills', name: 'Fever & Chills', category: 'whole_body', commonIn: ['Influenza', 'COVID-19', 'Pneumonia', 'Strep Throat'] },
  { id: 'chest_tightness', name: 'Chest Tightness / Wheezing', category: 'chest_lungs', commonIn: ['Asthma', 'Bronchitis', 'Acid Reflux'] },
  { id: 'acid_heartburn', name: 'Burning Chest Pain / Heartburn', category: 'stomach_digestive', commonIn: ['GERD', 'Gastritis', 'Peptic Ulcer'] },
  { id: 'dry_cough', name: 'Persistent Dry Cough', category: 'chest_lungs', commonIn: ['Asthma', 'Viral Infection', 'Allergies'] },
  { id: 'sore_throat_swallowing', name: 'Severe Sore Throat / Pain on Swallowing', category: 'throat_neck', commonIn: ['Strep Throat', 'Pharyngitis', 'Tonsillitis'] },
  { id: 'stomach_cramps', name: 'Sharp Abdominal Pain & Bloating', category: 'stomach_digestive', commonIn: ['Gastroenteritis', 'IBS', 'Appendicitis'] },
  { id: 'joint_stiffness', name: 'Joint Pain & Morning Stiffness', category: 'joints_muscles', commonIn: ['Osteoarthritis', 'Rheumatoid Arthritis', 'Gout'] },
  { id: 'fatigue_lethargy', name: 'Chronic Fatigue & Weakness', category: 'whole_body', commonIn: ['Anemia', 'Type 2 Diabetes', 'Hypothyroidism'] },
  { id: 'skin_rash_itchy', name: 'Red Itchy Skin Rash', category: 'skin', commonIn: ['Eczema', 'Contact Dermatitis', 'Urticaria'] },
  { id: 'dizziness_lightheaded', name: 'Dizziness & Lightheadedness', category: 'head', commonIn: ['Vertigo', 'Dehydration', 'Hypertension', 'Anemia'] },
  { id: 'frequent_urination', name: 'Frequent Thirst & Urination', category: 'kidneys_urinary', commonIn: ['Type 2 Diabetes', 'UTI'] },
  { id: 'nausea_vomiting', name: 'Nausea & Queasiness', category: 'stomach_digestive', commonIn: ['Gastritis', 'Food Poisoning', 'Migraine'] },
  { id: 'back_lower_pain', name: 'Lower Back Sharp / Dull Ache', category: 'spine_back', commonIn: ['Lumbar Strain', 'Sciatica', 'Kidney Stones'] },
  { id: 'runny_congested_nose', name: 'Nasal Congestion & Sinus Pressure', category: 'head', commonIn: ['Allergic Rhinitis', 'Common Cold', 'Sinusitis'] }
];

export const SAMPLE_DISEASES: Disease[] = [
  {
    id: 'gerd-acid-reflux',
    name: 'Acid Reflux (GERD)',
    medicalTerm: 'Gastroesophageal Reflux Disease',
    icdCode: 'K21.9',
    category: 'Gastroenterology',
    bodyRegion: 'stomach_digestive',
    matchScore: 94,
    severity: 'Moderate',
    urgencyLevel: 'Schedule Doctor Visit',
    simpleSummary: 'Acid reflux happens when the muscular one-way valve at the bottom of your food pipe gets loose, allowing acidic stomach juices to splash upwards into your chest and throat.',
    everydayAnalogy: 'Think of your stomach like a blender with a rubber lid (the esophageal sphincter). If the lid does not seal tight, every time the blender runs, hot acidic liquid splashes up into the chimney above.',
    whatHappensInside: [
      {
        step: 1,
        title: 'Valve Loosens (Sphincter Relaxation)',
        description: 'The lower esophageal sphincter (LES) fails to close firmly after food enters the stomach.'
      },
      {
        step: 2,
        title: 'Acid Splashes Upward (Reflux)',
        description: 'Gastric hydrochloric acid (pH 1.5-2.0) creeps up into the delicate esophagus lining.'
      },
      {
        step: 3,
        title: 'Lining Irritation & Burning',
        description: 'The unprotected esophageal tissue gets inflamed, triggering nerve endings that register as a fiery chest pain (heartburn).'
      }
    ],
    commonSymptoms: [
      'Burning sensation in chest behind breastbone',
      'Sour, acidic taste in the back of mouth',
      'Difficulty or pain when swallowing',
      'Chronic dry cough or throat clearing, especially at night',
      'Regurgitation of food particles'
    ],
    triggersAndCauses: [
      'Heavy, spicy, fatty, or tomato-based meals',
      'Caffeine, carbonated drinks, citrus fruits, and chocolate',
      'Lying down immediately within 2-3 hours of eating',
      'Excess abdominal pressure (tight belts, obesity, pregnancy)'
    ],
    emergencyRedFlags: [
      'Crushing chest pressure radiating to left arm, neck, or jaw (Rule out heart attack)',
      'Vomiting blood or dark coffee-ground material',
      'Inability to swallow food or water at all',
      'Unexplained sudden weight loss'
    ],
    medications: [
      {
        id: 'med-omeprazole',
        name: 'Omeprazole',
        genericName: 'Omeprazole',
        brandNames: ['Prilosec', 'Losec', 'Omez'],
        drugClass: 'Proton Pump Inhibitor (PPI)',
        prescriptionType: 'OTC',
        purpose: 'Long-lasting acid suppression to allow the esophageal lining to heal.',
        mechanismOfAction: 'Shuts down the microscopic "acid pumps" in stomach wall cells, reducing acid production by up to 90%.',
        typicalDosage: '20 mg once daily',
        frequency: 'Every morning',
        timingInstructions: 'Take 30 to 60 minutes BEFORE the first meal of the day with water.',
        duration: '14-day course for OTC; up to 4-8 weeks if prescribed by doctor.',
        commonSideEffects: ['Mild headache', 'Abdominal bloating', 'Nausea', 'Constipation / diarrhea'],
        seriousWarnings: ['Long-term continuous use (>1 year) may lower magnesium, calcium, and B12 absorption.'],
        contraindications: ['Known hypersensitivity to PPIs', 'Concurrent use with rilpivirine or nelfinavir'],
        drugInteractions: ['Warfarin', 'Clopidogrel', 'Methotrexate', 'Ketoconazole'],
        dietaryPrecautions: ['Do not crush or chew delayed-release capsules; swallow whole with water.'],
        pillVisual: {
          color: '#8b5cf6',
          secondaryColor: '#f43f5e',
          shape: 'capsule',
          imprint: 'OMEP 20'
        }
      },
      {
        id: 'med-famotidine',
        name: 'Famotidine',
        genericName: 'Famotidine',
        brandNames: ['Pepcid AC', 'Fluxid'],
        drugClass: 'H2 Receptor Blocker',
        prescriptionType: 'OTC',
        purpose: 'Rapid relief for heartburn episodes and nighttime acid surges.',
        mechanismOfAction: 'Blocks histamine-2 receptors on stomach parietal cells, slowing acid secretion within 30-45 minutes.',
        typicalDosage: '20 mg',
        frequency: '1 to 2 times daily as needed',
        timingInstructions: 'Take 15-60 minutes before eating meals that trigger reflux.',
        duration: 'As needed or up to 2 weeks continuously.',
        commonSideEffects: ['Mild dizziness', 'Dry mouth', 'Fatigue'],
        seriousWarnings: ['Adjust dose in patients with moderate to severe renal impairment.'],
        contraindications: ['Severe allergy to H2 blockers'],
        drugInteractions: ['Cefuroxime', 'Atazanavir', 'Tizanidine'],
        dietaryPrecautions: ['Avoid drinking alcohol while taking acid reducers as alcohol triggers reflux.'],
        pillVisual: {
          color: '#f59e0b',
          secondaryColor: '#fef3c7',
          shape: 'round',
          imprint: 'P20'
        }
      },
      {
        id: 'med-antacid-gaviscon',
        name: 'Calcium Carbonate + Magnesium Hydroxide (Antacid)',
        genericName: 'Antacid with Alginate',
        brandNames: ['Gaviscon', 'Tums', 'Mylanta'],
        drugClass: 'Fast-Acting Antacid & Raft Former',
        prescriptionType: 'OTC',
        purpose: 'Immediate neutralization of stomach acid within 5 minutes.',
        mechanismOfAction: 'Directly neutralizes stomach acid upon contact and forms a protective foam raft over stomach contents.',
        typicalDosage: '500-1000 mg chewable tablet or 10-20 mL liquid',
        frequency: 'After meals and at bedtime as needed',
        timingInstructions: 'Chew tablets thoroughly before swallowing; drink small sip of water after.',
        duration: 'Short-term acute symptom relief.',
        commonSideEffects: ['Chalky aftertaste', 'Mild constipation (calcium) or loose stool (magnesium)'],
        seriousWarnings: ['Do not exceed maximum daily dose (risk of milk-alkali syndrome with excessive calcium).'],
        contraindications: ['Hypercalcemia', 'Severe kidney stones'],
        drugInteractions: ['Separate from oral iron supplements and tetracycline/fluoroquinolone antibiotics by at least 2 hours.'],
        dietaryPrecautions: ['Do not substitute for meals; take only when symptomatic.'],
        pillVisual: {
          color: '#38bdf8',
          secondaryColor: '#e0f2fe',
          shape: 'tablet',
          imprint: 'ANTACID'
        }
      }
    ],
    homeRemedies: [
      'Elevate the head of your bed by 6 inches (use bed risers, not just stacked pillows)',
      'Remain upright for at least 3 hours after dinner before lying down',
      'Drink warm chamomile tea or ginger infusion',
      'Chew sugar-free gum for 30 minutes post-meal to stimulate saliva which neutralizes acid'
    ],
    dietaryAdvice: {
      recommended: ['Oatmeal', 'Bananas & Melons', 'Lean poultry & fish (baked/boiled)', 'Green vegetables (broccoli, asparagus, spinach)', 'Almond milk'],
      avoid: ['Fried & greasy fast foods', 'Tomato sauce & pizza', 'Peppermint & spearmint', 'Citrus juices', 'Black pepper & hot chili', 'Carbonated sodas']
    },
    lifestyleTips: [
      'Eat 4-5 smaller meals throughout the day instead of 2 massive feasts',
      'Avoid tight corsets, belts, and shapewear that compress the stomach',
      'Achieve a healthy weight to lower intra-abdominal pressure'
    ],
    recommendedSpecialist: 'Gastroenterologist',
    preventionTips: [
      'Finish dinner by 7:30 PM if you sleep at 10:30 PM',
      'Maintain an upright posture during and after meals'
    ]
  },
  {
    id: 'migraine-headache',
    name: 'Migraine with Aura',
    medicalTerm: 'Migraine Cephalea',
    icdCode: 'G43.9',
    category: 'Neurology',
    bodyRegion: 'head',
    matchScore: 91,
    severity: 'Moderate',
    urgencyLevel: 'Schedule Doctor Visit',
    simpleSummary: 'A migraine is a neurological condition caused by waves of nerve activity and blood vessel swelling in the brain, creating an intense pulsating headache often accompanied by nausea and light sensitivity.',
    everydayAnalogy: 'Think of your brain like an electrical power grid. During a migraine, an electrical power surge (cortical depression) ripples across the grid, setting off sensitive security alarms (pain nerves) and causing the brain to become hypersensitive to sound and light.',
    whatHappensInside: [
      {
        step: 1,
        title: 'Trigeminal Nerve Activation',
        description: 'Brainstem neurons become hyper-excitable, releasing inflammatory neuropeptides like CGRP.'
      },
      {
        step: 2,
        title: 'Blood Vessel Dilation & Inflammation',
        description: 'Meningeal blood vessels around the brain swell and become inflamed, sending sharp pulse signals.'
      },
      {
        step: 3,
        title: 'Sensory Overload (Central Sensitization)',
        description: 'The brain pain filter lowers, making normal daylight, room noise, and head movement feel agonizing.'
      }
    ],
    commonSymptoms: [
      'One-sided throbbing or pulsating head pain',
      'Extreme sensitivity to bright light (photophobia) and sound (phonophobia)',
      'Visual aura: zigzagging lines, shimmering lights, blind spots',
      'Nausea, queasiness, or vomiting',
      'Worsens with physical movement or climbing stairs'
    ],
    triggersAndCauses: [
      'Sleep disruption (too little or sleeping in excessively)',
      'Hormonal fluctuations (menstrual cycle)',
      'Aged cheeses, cured meats (nitrates), MSG, aspartame, red wine',
      'Dehydration, skipped meals, stress drop ("weekend migraine")'
    ],
    emergencyRedFlags: [
      'Sudden "thunderclap" headache reaching maximum agonizing intensity in seconds (Rule out subarachnoid hemorrhage)',
      'Headache accompanied by high fever, stiff neck, and confusion',
      'New onset of weakness in one arm, slurred speech, or facial drooping',
      'First severe headache after age 50'
    ],
    medications: [
      {
        id: 'med-sumatriptan',
        name: 'Sumatriptan',
        genericName: 'Sumatriptan Succinate',
        brandNames: ['Imitrex', 'Imigran'],
        drugClass: '5-HT1B/1D Receptor Agonist (Triptan)',
        prescriptionType: 'Prescription',
        purpose: 'Aborts active acute migraine attack within 30-60 minutes.',
        mechanismOfAction: 'Constricts swollen cranial blood vessels and halts the release of inflammatory pain messengers (CGRP).',
        typicalDosage: '50 mg or 100 mg single dose at migraine onset',
        frequency: 'Can repeat after 2 hours if migraine recurs (max 200 mg in 24 hours)',
        timingInstructions: 'Take at the very first sign of headache (not during visual aura phase).',
        duration: 'Single attack use only; do not take more than 9-10 days per month.',
        commonSideEffects: ['Mild chest/neck tightness', 'Flushing', 'Warm tingling sensation', 'Drowsiness'],
        seriousWarnings: ['Contraindicated in coronary artery disease, uncontrolled hypertension, or history of stroke.'],
        contraindications: ['Ischemic heart disease', 'Peripheral vascular disease', 'Concurrent MAO-A inhibitors or ergotamines'],
        drugInteractions: ['SSRIs/SNRIs (monitor for serotonin syndrome)', 'Ergotamine derivatives (allow 24h gap)'],
        dietaryPrecautions: ['Stay in a dark, quiet room with plenty of fluids after taking.'],
        pillVisual: {
          color: '#ec4899',
          secondaryColor: '#fbcfe8',
          shape: 'oval',
          imprint: 'SUMA 50'
        }
      },
      {
        id: 'med-naproxen',
        name: 'Naproxen Sodium',
        genericName: 'Naproxen Sodium',
        brandNames: ['Aleve', 'Naprosyn'],
        drugClass: 'NSAID (Non-Steroidal Anti-Inflammatory)',
        prescriptionType: 'OTC',
        purpose: 'Reduces inflammation and dulls pulsating neuro-vascular pain.',
        mechanismOfAction: 'Inhibits COX-1 and COX-2 enzymes to block prostaglandin synthesis responsible for inflammation.',
        typicalDosage: '220-440 mg initial dose',
        frequency: 'Every 8-12 hours as needed (max 660 mg/day OTC)',
        timingInstructions: 'Take with food or a glass of milk to protect stomach lining.',
        duration: 'Short-term during acute attacks.',
        commonSideEffects: ['Stomach upset', 'Heartburn', 'Mild dizziness'],
        seriousWarnings: ['Increased risk of gastrointestinal bleeding and cardiovascular events with overuse.'],
        contraindications: ['Active stomach ulcer', 'Severe kidney disease', 'Third trimester of pregnancy'],
        drugInteractions: ['Blood thinners (warfarin/aspirin)', 'ACE inhibitors', 'Lithium'],
        dietaryPrecautions: ['Do not consume alcohol while taking NSAIDs.'],
        pillVisual: {
          color: '#2563eb',
          secondaryColor: '#93c5fd',
          shape: 'oval',
          imprint: 'ALEVE'
        }
      }
    ],
    homeRemedies: [
      'Apply an ice pack or cold gel wrap to forehead and back of neck',
      'Rest in a pitch-black, silent, cool room with eyes closed',
      'Drink 500 mL of electrolyte-rich water immediately',
      'Small sip of caffeinated coffee or green tea early in attack (enhances analgesic absorption)'
    ],
    dietaryAdvice: {
      recommended: ['Magnesium-rich foods (spinach, pumpkin seeds, almonds)', 'Hydrating cucumber water', 'Ginger root tea', 'Salmon (Omega-3 fatty acids)'],
      avoid: ['Red wine & craft beers', 'Aged cheddar & blue cheeses', 'Cured deli meats with nitrites', 'Artificial sweeteners (aspartame)']
    },
    lifestyleTips: [
      'Maintain a consistent sleep-wake schedule 7 days a week',
      'Practice blue-light filter discipline on screens after sundown',
      'Keep a migraine diary to identify personal weather, food, and stress triggers'
    ],
    recommendedSpecialist: 'Neurologist / Headache Specialist',
    preventionTips: [
      'Supplement with Magnesium Glycinate (400 mg/day) and Vitamin B2 (Riboflavin 400 mg/day) under medical guidance'
    ]
  },
  {
    id: 'bronchial-asthma',
    name: 'Bronchial Asthma',
    medicalTerm: 'Asthma Bronchiale',
    icdCode: 'J45.9',
    category: 'Pulmonology',
    bodyRegion: 'chest_lungs',
    matchScore: 89,
    severity: 'Moderate',
    urgencyLevel: 'Schedule Doctor Visit',
    simpleSummary: 'Asthma is a chronic condition where the airways inside your lungs become inflamed, swollen, and produce excess sticky mucus, making it harder to breathe out air.',
    everydayAnalogy: 'Think of your breathing tubes like flexible rubber garden hoses. When exposed to dust or cold air, the hose walls swell thick on the inside and clench tight, narrowing the passage to the size of a coffee stirrer straw.',
    whatHappensInside: [
      {
        step: 1,
        title: 'Trigger Exposure',
        description: 'Allergens, smoke, or cold air stimulate hyper-reactive immune mast cells in the airway.'
      },
      {
        step: 2,
        title: 'Smooth Muscle Bronchospasm',
        description: 'Muscles wrapped around the bronchial tubes spasm and tighten like a drawstring.'
      },
      {
        step: 3,
        title: 'Mucus Hypersecretion & Trapping',
        description: 'Airway lining swells and oozes thick mucus, trapping exhaled air and producing a wheezing whistle sound.'
      }
    ],
    commonSymptoms: [
      'High-pitched wheezing sound during exhalation',
      'Shortness of breath especially during exercise or nighttime',
      'Chest tightness like a heavy band wrapped around lungs',
      'Persistent dry or mucus-producing cough'
    ],
    triggersAndCauses: [
      'Pollen, dust mites, pet dander, and mold spores',
      'Cold dry air, heavy exercise without warm-up',
      'Tobacco smoke, wood smoke, and strong chemical perfumes',
      'Viral respiratory infections (colds, flu)'
    ],
    emergencyRedFlags: [
      'Severe breathlessness: unable to speak full sentences in one breath',
      'Blue or gray tint around lips or fingernails (Cyanosis / low oxygen)',
      'Chest and ribs sucking in deeply on inhale (Retractions)',
      'Rescue inhaler provides zero relief after 20 minutes'
    ],
    medications: [
      {
        id: 'med-albuterol',
        name: 'Albuterol / Salbutamol (Rescue Inhaler)',
        genericName: 'Albuterol Sulfate',
        brandNames: ['Ventolin HFA', 'ProAir', 'Asthalin'],
        drugClass: 'Short-Acting Beta-2 Agonist (SABA)',
        prescriptionType: 'Prescription',
        purpose: 'Rapid relief for acute bronchospasm and wheezing within 3-5 minutes.',
        mechanismOfAction: 'Stimulates beta-2 receptors in airway smooth muscles, forcing them to relax and dilate airways wide open.',
        typicalDosage: '1-2 puffs (90-180 mcg)',
        frequency: 'Every 4-6 hours as needed for sudden wheezing or 15 mins prior to exercise',
        timingInstructions: 'Use a spacer chamber when possible; exhale fully, inhale deeply while pressing canister, hold breath 10 seconds.',
        duration: 'Fast rescue relief (lasts 4-6 hours).',
        commonSideEffects: ['Mild hand tremor', 'Fast heart rate (palpitations)', 'Nervousness'],
        seriousWarnings: ['Using a rescue inhaler more than 2 days per week indicates uncontrolled asthma requiring maintenance steroid inhalers.'],
        contraindications: ['Severe hypersensitivity to albuterol'],
        drugInteractions: ['Non-selective beta-blockers (propranolol) block albuterol effectiveness', 'Diuretics (may lower potassium)'],
        dietaryPrecautions: ['Rinse mouth with water after use.'],
        pillVisual: {
          color: '#0284c7',
          secondaryColor: '#38bdf8',
          shape: 'capsule',
          imprint: 'VENTOLIN'
        }
      },
      {
        id: 'med-fluticasone',
        name: 'Fluticasone Propionate (Preventer Inhaler)',
        genericName: 'Fluticasone Propionate',
        brandNames: ['Flovent', 'Flixotide'],
        drugClass: 'Inhaled Corticosteroid (ICS)',
        prescriptionType: 'Prescription',
        purpose: 'Daily controller medication to prevent airway inflammation and asthma attacks.',
        mechanismOfAction: 'Suppresses chronic immune inflammation in the bronchial lining, keeping airways calm and resilient.',
        typicalDosage: '100-250 mcg 1 puff',
        frequency: 'Twice daily (morning and evening)',
        timingInstructions: 'Take every single day even when feeling 100% healthy.',
        duration: 'Long-term maintenance therapy.',
        commonSideEffects: ['Hoarseness', 'Throat irritation', 'Oral thrush (fungal infection) if not rinsed'],
        seriousWarnings: ['Always rinse mouth and gargle with water and spit it out after every inhalation to prevent thrush.'],
        contraindications: ['Primary treatment of acute status asthmaticus where immediate rescue is needed'],
        drugInteractions: ['Strong CYP3A4 inhibitors like ketoconazole or ritonavir'],
        dietaryPrecautions: ['Always rinse and spit water after using steroid inhalers.'],
        pillVisual: {
          color: '#f97316',
          secondaryColor: '#ffedd5',
          shape: 'tablet',
          imprint: 'FLOVENT'
        }
      }
    ],
    homeRemedies: [
      'Sit upright and lean forward slightly (Tripod position) to ease breathing mechanics',
      'Use a HEPA air purifier in the bedroom to capture dust and pet dander',
      'Breathe through a warm scarf when stepping outside in freezing weather',
      'Practice diaphragmatic pursed-lip breathing exercises'
    ],
    dietaryAdvice: {
      recommended: ['Vitamin D-rich foods (egg yolks, fortified milk)', 'Apple & citrus pectin antioxidants', 'Carrot & sweet potato beta-carotene'],
      avoid: ['Sulfites found in dried fruits, bottled lemon juice, and pickled foods', 'Excessive sodium which can increase airway reactivity']
    },
    lifestyleTips: [
      'Wash bed sheets weekly in 60°C (140°F) hot water to kill dust mites',
      'Warm up with light cardio for 10 minutes before intense workouts',
      'Never allow smoking inside your home or vehicle'
    ],
    recommendedSpecialist: 'Pulmonologist / Allergist',
    preventionTips: [
      'Get the annual influenza and pneumococcal vaccines to prevent viral complications'
    ]
  },
  {
    id: 'type-2-diabetes',
    name: 'Type 2 Diabetes Mellitus',
    medicalTerm: 'Diabetes Mellitus Type II',
    icdCode: 'E11.9',
    category: 'Endocrinology',
    bodyRegion: 'stomach_digestive',
    matchScore: 88,
    severity: 'Moderate',
    urgencyLevel: 'Schedule Doctor Visit',
    simpleSummary: 'In Type 2 diabetes, your pancreas still makes insulin (the hormone key that lets sugar into cells), but your cells become "rusty" and resistant, causing sugar to pile up in your bloodstream.',
    everydayAnalogy: 'Think of insulin as a key that unlocks your cell doors to let glucose fuel inside. In diabetes, the keyhole gets gummed up with chewing gum (insulin resistance), so the key won\'t turn, leaving sugar trapped in the hallway (blood vessels).',
    whatHappensInside: [
      {
        step: 1,
        title: 'Insulin Resistance',
        description: 'Muscle and fat cells fail to respond efficiently to normal insulin signals.'
      },
      {
        step: 2,
        title: 'Pancreatic Overdrive',
        description: 'Beta cells pump out massive extra insulin to compensate until they eventually become fatigued.'
      },
      {
        step: 3,
        title: 'Hyperglycemia & Vessel Damage',
        description: 'Persistent high blood glucose causes chronic oxidative damage to capillaries in eyes, kidneys, and nerves.'
      }
    ],
    commonSymptoms: [
      'Excessive unquenchable thirst (Polydipsia)',
      'Frequent urination especially during the night (Polyuria)',
      'Constant hunger even after eating (Polyphagia)',
      'Slow-healing cuts, sores, or frequent infections',
      'Tingling, numbness, or "pins and needles" in feet'
    ],
    triggersAndCauses: [
      'Sedentary lifestyle and visceral abdominal fat',
      'High intake of refined carbohydrates, sugary sodas, and ultra-processed foods',
      'Genetic predisposition and family history',
      'Chronic high stress and elevated cortisol levels'
    ],
    emergencyRedFlags: [
      'Fruity-smelling breath, extreme confusion, or vomiting (Diabetic Ketoacidosis / HHS)',
      'Severe shakiness, sweating, and confusion with blood sugar dropping below 70 mg/dL (Hypoglycemia)',
      'Sudden loss of vision or black floating spots',
      'Non-healing black/discolored foot ulcer with fever'
    ],
    medications: [
      {
        id: 'med-metformin',
        name: 'Metformin Hydrochloride',
        genericName: 'Metformin HCl',
        brandNames: ['Glucophage', 'Fortamet', 'Glycomet'],
        drugClass: 'Biguanide',
        prescriptionType: 'Prescription',
        purpose: 'First-line foundation treatment to lower blood glucose and improve insulin sensitivity.',
        mechanismOfAction: 'Tells the liver to stop dumping excess glucose into blood and helps muscle cells absorb circulating sugar without causing hypoglycemia.',
        typicalDosage: '500 mg to 1000 mg twice daily',
        frequency: 'With morning and evening meals',
        timingInstructions: 'Take strictly WITH meals to minimize digestive side effects. Start at a low dose and titrate up.',
        duration: 'Long-term continuous therapy.',
        commonSideEffects: ['Mild diarrhea', 'Nausea / metallic taste', 'Abdominal gas'],
        seriousWarnings: ['Rare risk of Lactic Acidosis in severe kidney impairment (eGFR < 30 mL/min). Stop temporarily before iodinated CT contrast scans.'],
        contraindications: ['Severe renal disease (eGFR < 30)', 'Acute metabolic acidosis', 'Severe congestive heart failure'],
        drugInteractions: ['Iodinated contrast dyes', 'Excessive alcohol intake', 'Cimetidine'],
        dietaryPrecautions: ['Check Vitamin B12 levels annually as long-term metformin can lower B12 absorption.'],
        pillVisual: {
          color: '#ffffff',
          secondaryColor: '#e2e8f0',
          shape: 'oval',
          imprint: 'GLUCO 500'
        }
      },
      {
        id: 'med-empagliflozin',
        name: 'Empagliflozin (SGLT2 Inhibitor)',
        genericName: 'Empagliflozin',
        brandNames: ['Jardiance'],
        drugClass: 'SGLT-2 Inhibitor',
        prescriptionType: 'Prescription',
        purpose: 'Lowers blood sugar while protecting heart and kidneys.',
        mechanismOfAction: 'Blocks glucose reabsorption in kidneys, allowing excess sugar to be flushed out harmlessly through urine.',
        typicalDosage: '10 mg once daily',
        frequency: 'Every morning with or without food',
        timingInstructions: 'Drink plenty of water throughout the day to stay well hydrated.',
        duration: 'Long-term maintenance.',
        commonSideEffects: ['Increased urination', 'Mild yeast / urinary tract infections'],
        seriousWarnings: ['Maintain good genital hygiene to prevent fungal infections; stay hydrated in hot weather.'],
        contraindications: ['End-stage renal disease / dialysis patients'],
        drugInteractions: ['Insulin / Sulfonylureas (may increase hypoglycemia risk — dose adjustment needed)'],
        dietaryPrecautions: ['Drink at least 2 liters of water daily.'],
        pillVisual: {
          color: '#10b981',
          secondaryColor: '#d1fae5',
          shape: 'round',
          imprint: 'JAR 10'
        }
      }
    ],
    homeRemedies: [
      'Take a brisk 15-minute walk immediately following each main meal to activate muscle glucose uptake',
      'Add 1 teaspoon of ground cinnamon to oatmeal or tea (supports insulin receptor sensitivity)',
      'Stay properly hydrated with 8-10 glasses of water daily',
      'Daily foot inspection using a mirror to catch minor blisters early'
    ],
    dietaryAdvice: {
      recommended: ['Fiber-dense legumes (lentils, chickpeas)', 'Cruciferous greens (kale, broccoli)', 'Healthy fats (extra virgin olive oil, walnuts, avocados)', 'Lean proteins (tofu, salmon, skinless poultry)'],
      avoid: ['Sugary soft drinks & packaged juices', 'White bread, white rice, and refined pasta', 'Deep-fried battered snacks', 'Pastries & confectioneries with high fructose corn syrup']
    },
    lifestyleTips: [
      'Incorporate 150 minutes of moderate aerobic exercise + 2 resistance training sessions weekly',
      'Aim for 7-8 hours of sound sleep to regulate ghrelin and leptin hunger hormones',
      'Monitor blood sugar levels with a continuous glucose monitor (CGM) or glucometer'
    ],
    recommendedSpecialist: 'Endocrinologist / Diabetologist',
    preventionTips: [
      'Reducing body weight by just 5-7% can decrease diabetic progression risk by over 58%'
    ]
  }
];
