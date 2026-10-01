"""
main.py - FastAPI Microservice for Random Forest Clinical Disease Prediction
Exposes REST endpoints to query the trained Random Forest model and get explainable diagnostic predictions.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# App initialization
app = FastAPI(
    title="Clinical Health Analyzer - Random Forest ML Service",
    description="Machine Learning REST API using Scikit-Learn RandomForestClassifier for symptom-based disease classification.",
    version="1.0.0"
)

# Enable CORS for local development and integration with Node.js/Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.joblib")
METADATA_PATH = os.path.join(BASE_DIR, "metadata.json")

# In-memory model and metadata holders
model = None
metadata: Dict[str, Any] = {}

# Canonical symptom mapping: maps incoming user strings or friendly names to feature identifiers
SYMPTOM_NAME_MAP = {
    "throbbing headache": "throbbing_headache",
    "headache": "throbbing_headache",
    "migraine": "throbbing_headache",
    "fever & chills": "fever_chills",
    "fever": "fever_chills",
    "high fever": "fever_chills",
    "chest tightness / wheezing": "chest_tightness",
    "chest tightness": "chest_tightness",
    "burning chest pain / heartburn": "acid_heartburn",
    "heartburn": "acid_heartburn",
    "acid reflux": "acid_heartburn",
    "acid_heartburn": "acid_heartburn",
    "persistent dry cough": "dry_cough",
    "dry cough": "dry_cough",
    "cough": "dry_cough",
    "severe sore throat / pain on swallowing": "sore_throat_swallowing",
    "sore throat": "sore_throat_swallowing",
    "sharp abdominal pain & bloating": "stomach_cramps",
    "abdominal pain": "stomach_cramps",
    "stomach cramps": "stomach_cramps",
    "joint pain & morning stiffness": "joint_stiffness",
    "joint stiffness": "joint_stiffness",
    "chronic fatigue & weakness": "fatigue_lethargy",
    "fatigue": "fatigue_lethargy",
    "red itchy skin rash": "skin_rash_itchy",
    "skin rash": "skin_rash_itchy",
    "rash": "skin_rash_itchy",
    "dizziness & lightheadedness": "dizziness_lightheaded",
    "dizziness": "dizziness_lightheaded",
    "frequent thirst & urination": "frequent_thirst_urination",
    "frequent urination": "frequent_thirst_urination",
    "thirst": "frequent_thirst_urination",
    "nausea & queasiness": "nausea_vomiting",
    "nausea": "nausea_vomiting",
    "vomiting": "nausea_vomiting",
    "lower back sharp / dull ache": "back_lower_pain",
    "lower back pain": "back_lower_pain",
    "back pain": "back_lower_pain",
    "nasal congestion & sinus pressure": "runny_congested_nose",
    "runny nose": "runny_congested_nose",
    "sinus pressure": "runny_congested_nose",
    "shortness of breath": "shortness_of_breath",
    "wheezing": "wheezing",
    "sensitivity to light": "sensitivity_to_light",
    "sour regurgitation": "sour_regurgitation",
    "numbness in feet": "numbness_tingling_feet",
    "tingling in feet": "numbness_tingling_feet",
    "joint swelling": "joint_swelling",
    "diarrhea": "diarrhea_loose_stools"
}

def load_or_train_model():
    global model, metadata
    if os.path.exists(MODEL_PATH) and os.path.exists(METADATA_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            with open(METADATA_PATH, "r") as f:
                metadata = json.load(f)
            print("✅ Successfully loaded trained Random Forest model.")
            return
        except Exception as e:
            print(f"⚠️ Error loading existing model: {e}. Will retrain.")
    
    # Train if not available
    print("⏳ Model artifact not found or invalid. Training on the fly...")
    from train import train_and_export_model
    model, metadata = train_and_export_model()

@app.on_event("startup")
def startup_event():
    load_or_train_model()

# ─── Pydantic Schemas ────────────────────────────────────────────────────────
class PredictRequest(BaseModel):
    symptoms: List[str] = Field(..., description="List of patient symptoms (raw strings or friendly names)")
    age: Optional[int] = Field(35, ge=0, le=120, description="Patient age")
    gender: Optional[str] = Field("Not Specified", description="Patient gender")
    severity: Optional[int] = Field(5, ge=1, le=10, description="Self-reported severity scale from 1 to 10")
    body_region: Optional[str] = Field(None, description="Primary affected anatomical body region")

class DiseaseCandidate(BaseModel):
    disease: str
    probability: float
    confidence_percentage: float

class FeatureContribution(BaseModel):
    feature: str
    symptom_name: str
    importance_score: float
    is_present: bool

class PredictResponse(BaseModel):
    predicted_disease: str
    confidence: float
    confidence_percentage: float
    triage_level: str
    triage_explanation: str
    top_predictions: List[DiseaseCandidate]
    patient_feature_contributions: List[FeatureContribution]
    model_info: Dict[str, Any]

# ─── Endpoints ───────────────────────────────────────────────────────────────
@app.get("/health")
def health_check():
    return {
        "status": "online",
        "model_loaded": model is not None,
        "model_type": metadata.get("model_type", "RandomForestClassifier"),
        "n_estimators": metadata.get("n_estimators", 150),
        "test_accuracy": metadata.get("test_accuracy"),
        "classes_count": len(metadata.get("classes", []))
    }

@app.get("/symptoms")
def get_supported_symptoms():
    return {
        "total": len(metadata.get("symptoms_list", [])),
        "symptoms": metadata.get("symptoms_list", []),
        "aliases": list(SYMPTOM_NAME_MAP.keys())
    }

@app.get("/diseases")
def get_diseases():
    return {
        "total": len(metadata.get("classes", [])),
        "diseases": metadata.get("classes", [])
    }

@app.post("/predict", response_model=PredictResponse)
def predict_disease(payload: PredictRequest):
    if model is None:
        load_or_train_model()
    if model is None:
        raise HTTPException(status_code=500, detail="ML model is not available.")

    # 1. Parse symptoms into canonical keys
    feature_cols = metadata.get("feature_cols", [])
    symptoms_list = metadata.get("symptoms_list", [])

    matched_symptoms = set()
    for raw_symptom in payload.symptoms:
        cleaned = raw_symptom.lower().strip()
        # Direct key match
        if cleaned in symptoms_list:
            matched_symptoms.add(cleaned)
            continue
        # Alias lookup
        if cleaned in SYMPTOM_NAME_MAP:
            matched_symptoms.add(SYMPTOM_NAME_MAP[cleaned])
            continue
        # Partial match
        for key, val in SYMPTOM_NAME_MAP.items():
            if key in cleaned or cleaned in key:
                matched_symptoms.add(val)
                break

    # 2. Build feature vector
    input_row = {
        "age": payload.age or 35,
        "severity": payload.severity or 5
    }
    for s in symptoms_list:
        input_row[f"sym_{s}"] = 1 if s in matched_symptoms else 0

    input_df = pd.DataFrame([input_row])[feature_cols]

    # 3. Predict probabilities using Random Forest
    probs = model.predict_proba(input_df)[0]
    classes = model.classes_

    # Sort descending
    sorted_indices = np.argsort(probs)[::-1]
    top_candidates = []
    for idx in sorted_indices:
        top_candidates.append(
            DiseaseCandidate(
                disease=str(classes[idx]),
                probability=round(float(probs[idx]), 4),
                confidence_percentage=round(float(probs[idx]) * 100, 1)
            )
        )

    best_candidate = top_candidates[0]

    # 4. Compute Patient-Specific Feature Contributions
    # Global feature importances weighted by user's active symptoms
    raw_importances = model.feature_importances_
    contributions = []
    for feat_name, imp in zip(feature_cols, raw_importances):
        is_active = input_row.get(feat_name, 0) == 1
        clean_name = feat_name.replace("sym_", "").replace("_", " ").title()
        if is_active:
            contributions.append(
                FeatureContribution(
                    feature=feat_name,
                    symptom_name=clean_name,
                    importance_score=round(float(imp) * 100, 2),
                    is_present=True
                )
            )

    contributions.sort(key=lambda x: x.importance_score, reverse=True)

    # 5. Triage Level Estimation
    sev = payload.severity or 5
    if sev >= 9 or best_candidate.disease == "Pneumonia":
        triage = "Urgent Care within 24h"
        triage_exp = "Elevated severity score and respiratory symptoms warrant prompt in-person medical evaluation."
    elif sev >= 7:
        triage = "Schedule Doctor Visit"
        triage_exp = "Symptoms cause noticeable impairment; professional clinical diagnosis is recommended."
    else:
        triage = "Home Care & Monitor"
        triage_exp = "Mild presentation without red-flag instability. Monitor symptoms closely and seek care if they worsen."

    return PredictResponse(
        predicted_disease=best_candidate.disease,
        confidence=best_candidate.probability,
        confidence_percentage=best_candidate.confidence_percentage,
        triage_level=triage,
        triage_explanation=triage_exp,
        top_predictions=top_candidates[:4],
        patient_feature_contributions=contributions,
        model_info={
            "model_type": metadata.get("model_type", "RandomForestClassifier"),
            "n_estimators": metadata.get("n_estimators", 150),
            "test_accuracy": metadata.get("test_accuracy"),
            "active_symptoms_matched": len(matched_symptoms)
        }
    )

@app.post("/retrain")
def retrain_model():
    from train import train_and_export_model
    global model, metadata
    model, metadata = train_and_export_model()
    return {
        "status": "success",
        "message": "Random Forest model retrained and updated in memory successfully.",
        "test_accuracy": metadata.get("test_accuracy")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
