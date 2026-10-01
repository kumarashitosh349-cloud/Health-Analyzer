"""
test_prediction.py - Verifies the Random Forest Model locally
Demonstrates symptom prediction for common cases like Acid Reflux, Asthma, and Migraine.
"""

from train import train_and_export_model
import json
import os
import joblib
import pandas as pd
import numpy as np

def run_test():
    print("🌲 Testing Random Forest Model Locally...\n")
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, "model.joblib")
    meta_path = os.path.join(base_dir, "metadata.json")

    if not os.path.exists(model_path) or not os.path.exists(meta_path):
        print("Training model first...")
        train_and_export_model()

    model = joblib.load(model_path)
    with open(meta_path, "r") as f:
        meta = json.load(f)

    test_cases = [
        {
            "label": "Case 1: Acid Reflux Patient",
            "age": 42,
            "severity": 6,
            "active_symptoms": ["acid_heartburn", "sour_regurgitation"]
        },
        {
            "label": "Case 2: Asthma Patient",
            "age": 28,
            "severity": 7,
            "active_symptoms": ["shortness_of_breath", "wheezing", "chest_tightness"]
        },
        {
            "label": "Case 3: Migraine Patient",
            "age": 31,
            "severity": 8,
            "active_symptoms": ["throbbing_headache", "sensitivity_to_light", "nausea_vomiting"]
        }
    ]

    feature_cols = meta["feature_cols"]

    for case in test_cases:
        row = {"age": case["age"], "severity": case["severity"]}
        for s in meta["symptoms_list"]:
            row[f"sym_{s}"] = 1 if s in case["active_symptoms"] else 0
        
        df = pd.DataFrame([row])[feature_cols]
        probs = model.predict_proba(df)[0]
        classes = model.classes_
        top_idx = np.argmax(probs)
        
        print(f"👉 {case['label']}")
        print(f"   Input Symptoms: {', '.join(case['active_symptoms'])}")
        print(f"   Predicted Disease: {classes[top_idx]}")
        print(f"   Confidence Score:  {probs[top_idx] * 100:.1f}%\n")

if __name__ == "__main__":
    run_test()
