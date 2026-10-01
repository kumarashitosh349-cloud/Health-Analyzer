"""
train.py - Trains a Scikit-Learn RandomForestClassifier for Disease Diagnosis from Symptoms
Saves the serialized model and metadata for production serving with FastAPI.
"""

import os
import json
import joblib
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from dataset import generate_patient_dataset, SYMPTOMS_LIST

def train_and_export_model():
    print("⏳ Step 1: Generating clinical patient dataset...")
    df = generate_patient_dataset(samples_per_disease=400, random_seed=42)
    print(f"✅ Generated {len(df)} patient records across {df['target_disease'].nunique()} diseases.")

    # Feature columns
    feature_cols = ["age", "severity"] + [f"sym_{s}" for s in SYMPTOMS_LIST]
    X = df[feature_cols]
    y = df["target_disease"]

    print("⏳ Step 2: Splitting into training (80%) and testing (20%) sets...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    print("⏳ Step 3: Training RandomForestClassifier (150 Decision Trees)...")
    rf_model = RandomForestClassifier(
        n_estimators=150,
        max_depth=16,
        min_samples_split=4,
        min_samples_leaf=2,
        max_features="sqrt",
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )
    rf_model.fit(X_train, y_train)

    # Evaluation
    train_acc = accuracy_score(y_train, rf_model.predict(X_train))
    y_pred = rf_model.predict(X_test)
    test_acc = accuracy_score(y_test, y_pred)

    print(f"\n🎯 Model Performance:")
    print(f"   - Training Accuracy: {train_acc * 100:.2f}%")
    print(f"   - Test Accuracy:     {test_acc * 100:.2f}%\n")
    print("Classification Report:")
    print(classification_report(y_test, y_pred, digits=3))

    # Feature Importances
    importances = rf_model.feature_importances_
    feature_importance_list = [
        {"feature": feat, "importance": round(float(imp), 4)}
        for feat, imp in sorted(zip(feature_cols, importances), key=lambda x: x[1], reverse=True)
    ]

    print("\n🌲 Top 10 Most Important Diagnostic Features:")
    for idx, item in enumerate(feature_importance_list[:10], 1):
        print(f"   {idx}. {item['feature']}: {item['importance'] * 100:.2f}% contribution")

    # Save artifacts
    output_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(output_dir, "model.joblib")
    metadata_path = os.path.join(output_dir, "metadata.json")

    print(f"\n💾 Saving model artifact to {model_path}...")
    joblib.dump(rf_model, model_path)

    metadata = {
        "model_type": "RandomForestClassifier",
        "n_estimators": 150,
        "max_depth": 16,
        "train_accuracy": round(float(train_acc), 4),
        "test_accuracy": round(float(test_acc), 4),
        "trained_at": datetime.utcnow().isoformat(),
        "feature_cols": feature_cols,
        "symptoms_list": SYMPTOMS_LIST,
        "classes": list(rf_model.classes_),
        "top_feature_importances": feature_importance_list[:12]
    }

    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"💾 Saving metadata to {metadata_path}...")
    print("✨ Training and serialization complete!")

    return rf_model, metadata

if __name__ == "__main__":
    train_and_export_model()
