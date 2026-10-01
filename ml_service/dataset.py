"""
dataset.py - Clinical Symptom & Disease Dataset Generator for Random Forest Classifier
Generates structured patient records with symptom presence (0/1), age, severity, and target diagnosis.
"""

import numpy as np
import pandas as pd
from typing import List, Dict, Tuple

SYMPTOMS_LIST = [
    "throbbing_headache",
    "fever_chills",
    "chest_tightness",
    "acid_heartburn",
    "dry_cough",
    "sore_throat_swallowing",
    "stomach_cramps",
    "joint_stiffness",
    "fatigue_lethargy",
    "skin_rash_itchy",
    "dizziness_lightheaded",
    "frequent_thirst_urination",
    "nausea_vomiting",
    "back_lower_pain",
    "runny_congested_nose",
    "shortness_of_breath",
    "wheezing",
    "sensitivity_to_light",
    "sour_regurgitation",
    "numbness_tingling_feet",
    "joint_swelling",
    "diarrhea_loose_stools"
]

DISEASE_PROFILES: Dict[str, Dict] = {
    "Acid Reflux (GERD)": {
        "primary_symptoms": ["acid_heartburn", "sour_regurgitation", "nausea_vomiting"],
        "secondary_symptoms": ["chest_tightness", "dry_cough"],
        "body_region": "stomach_digestive",
        "age_range": (20, 75),
        "typical_severity": (4, 8)
    },
    "Migraine with Aura": {
        "primary_symptoms": ["throbbing_headache", "sensitivity_to_light", "nausea_vomiting"],
        "secondary_symptoms": ["dizziness_lightheaded", "fatigue_lethargy"],
        "body_region": "head",
        "age_range": (15, 60),
        "typical_severity": (6, 10)
    },
    "Bronchial Asthma": {
        "primary_symptoms": ["shortness_of_breath", "wheezing", "chest_tightness"],
        "secondary_symptoms": ["dry_cough", "fatigue_lethargy"],
        "body_region": "chest_lungs",
        "age_range": (5, 70),
        "typical_severity": (5, 9)
    },
    "Type 2 Diabetes Mellitus": {
        "primary_symptoms": ["frequent_thirst_urination", "fatigue_lethargy", "numbness_tingling_feet"],
        "secondary_symptoms": ["dizziness_lightheaded", "skin_rash_itchy"],
        "body_region": "stomach_digestive",
        "age_range": (35, 80),
        "typical_severity": (3, 7)
    },
    "Acute Gastroenteritis": {
        "primary_symptoms": ["stomach_cramps", "nausea_vomiting", "diarrhea_loose_stools"],
        "secondary_symptoms": ["fever_chills", "fatigue_lethargy", "dizziness_lightheaded"],
        "body_region": "stomach_digestive",
        "age_range": (10, 70),
        "typical_severity": (5, 9)
    },
    "Osteoarthritis": {
        "primary_symptoms": ["joint_stiffness", "joint_swelling", "back_lower_pain"],
        "secondary_symptoms": ["fatigue_lethargy"],
        "body_region": "joints_muscles",
        "age_range": (45, 85),
        "typical_severity": (4, 8)
    },
    "Allergic Rhinitis / Sinusitis": {
        "primary_symptoms": ["runny_congested_nose", "throbbing_headache", "sore_throat_swallowing"],
        "secondary_symptoms": ["dry_cough", "fatigue_lethargy"],
        "body_region": "head",
        "age_range": (10, 65),
        "typical_severity": (3, 7)
    },
    "Pneumonia": {
        "primary_symptoms": ["fever_chills", "shortness_of_breath", "dry_cough"],
        "secondary_symptoms": ["chest_tightness", "fatigue_lethargy", "nausea_vomiting"],
        "body_region": "chest_lungs",
        "age_range": (20, 85),
        "typical_severity": (7, 10)
    },
    "Eczema / Contact Dermatitis": {
        "primary_symptoms": ["skin_rash_itchy"],
        "secondary_symptoms": ["fatigue_lethargy"],
        "body_region": "skin",
        "age_range": (5, 60),
        "typical_severity": (3, 7)
    }
}

def generate_patient_dataset(samples_per_disease: int = 350, random_seed: int = 42) -> pd.DataFrame:
    """
    Generates a realistic clinical dataset with non-linear symptom distributions,
    noise, and realistic physiological correlations.
    """
    np.random.seed(random_seed)
    records = []

    for disease_name, profile in DISEASE_PROFILES.items():
        for _ in range(samples_per_disease):
            record = {}
            # Base features: age, severity score
            min_age, max_age = profile["age_range"]
            record["age"] = int(np.random.randint(min_age, max_age + 1))
            
            min_sev, max_sev = profile["typical_severity"]
            record["severity"] = int(np.random.randint(min_sev, max_sev + 1))

            # Binary symptom presence:
            for s in SYMPTOMS_LIST:
                if s in profile["primary_symptoms"]:
                    # Primary symptoms present with high probability (85% - 98%)
                    prob = np.random.uniform(0.85, 0.98)
                elif s in profile["secondary_symptoms"]:
                    # Secondary symptoms present with moderate probability (40% - 65%)
                    prob = np.random.uniform(0.40, 0.65)
                else:
                    # Non-associated symptoms (background noise / comorbidity, 2% - 5%)
                    prob = np.random.uniform(0.01, 0.05)
                
                record[f"sym_{s}"] = 1 if np.random.rand() < prob else 0

            record["target_disease"] = disease_name
            records.append(record)

    df = pd.DataFrame(records)
    # Shuffle dataset
    df = df.sample(frac=1.0, random_state=random_seed).reset_index(drop=True)
    return df

if __name__ == "__main__":
    df = generate_patient_dataset()
    print(f"Generated dataset shape: {df.shape}")
    print(f"Class distribution:\n{df['target_disease'].value_counts()}")
