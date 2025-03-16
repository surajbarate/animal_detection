from flask import Flask, request, jsonify
import numpy as np
import joblib
import librosa
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to prevent frontend blocking

# Load trained model
model = joblib.load("animal_sound_model.pkl")

# Load label mapping
labels = ["Lion", "Dog", "Cat", "Elephant", "Cow"]  # Modify based on your dataset


# Function to extract features from audio
def extract_features(filename):
    try:
        y, sr = librosa.load(filename, sr=None)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        return np.mean(mfccs, axis=1)  # Flatten features
    except Exception as e:
        print(f"Error extracting features: {e}")
        return None


@app.route("/predict", methods=["POST"])
def predict():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400

    file = request.files["audio"]
    filename = "temp.wav"
    file.save(filename)

    features = extract_features(filename)
    if features is None:
        return jsonify({"error": "Error processing file"}), 500

    features = np.array(features).reshape(1, -1)  # Reshape to match model input

    try:
        prediction = model.predict(features)  # Predict

        # Handle label conversion correctly
        if isinstance(prediction[0], np.integer):  # If it's an integer
            predicted_label = labels[int(prediction[0])]
        elif isinstance(prediction[0], str):  # If it's already a string
            predicted_label = prediction[0]
        else:
            predicted_label = "Unknown"

        return jsonify({"prediction": predicted_label})
    except Exception as e:
        return jsonify({"error": f"Model prediction error: {e}"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5004)
