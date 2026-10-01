# Random Forest Disease Prediction Service 🌲🩺

This is a dedicated Machine Learning microservice built with **Python**, **Scikit-Learn (`RandomForestClassifier`)**, and **FastAPI**. It predicts medical conditions based on patient-reported symptoms, age, severity, and anatomical regions, and provides explainable feature importances.

---

## 🚀 Quick Start

### 1. Create and Activate Virtual Environment (Optional but recommended)
```bash
cd ml_service
python -m venv venv

# Windows (Command Prompt / PowerShell):
.\venv\Scripts\activate

# macOS / Linux:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Train the Random Forest Model
```bash
python train.py
```
* Trains an ensemble of **150 decision trees** on structured clinical symptom vectors.
* Evaluates accuracy, precision, recall, and generates `model.joblib` and `metadata.json`.

### 4. Start the FastAPI ML Server
```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
The API is now live at:
* **Interactive Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* **Health Check:** [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)

---

## 📡 API Endpoints

### `POST /predict`
Predicts disease probability distribution, triage recommendation, and patient-specific symptom contributions.

#### Request Body:
```json
{
  "symptoms": [
    "burning chest pain / heartburn",
    "sour regurgitation",
    "nausea"
  ],
  "age": 42,
  "severity": 6,
  "body_region": "stomach_digestive"
}
```

#### Response:
```json
{
  "predicted_disease": "Acid Reflux (GERD)",
  "confidence": 0.942,
  "confidence_percentage": 94.2,
  "triage_level": "Schedule Doctor Visit",
  "triage_explanation": "Symptoms cause noticeable impairment; professional clinical diagnosis is recommended.",
  "top_predictions": [
    { "disease": "Acid Reflux (GERD)", "probability": 0.942, "confidence_percentage": 94.2 },
    { "disease": "Acute Gastroenteritis", "probability": 0.035, "confidence_percentage": 3.5 }
  ],
  "patient_feature_contributions": [
    { "feature": "sym_acid_heartburn", "symptom_name": "Acid Heartburn", "importance_score": 28.4, "is_present": true },
    { "feature": "sym_sour_regurgitation", "symptom_name": "Sour Regurgitation", "importance_score": 19.8, "is_present": true }
  ],
  "model_info": {
    "model_type": "RandomForestClassifier",
    "n_estimators": 150,
    "test_accuracy": 0.985
  }
}
```

---

## 🧪 Model Features
* **150 Decision Trees** with balanced class weighting.
* **Explainable Feature Importances:** Tells patients and clinicians which symptom drove the prediction.
* **Resilient Matching:** Matches free-text descriptions, aliases, and formal clinical symptoms.
