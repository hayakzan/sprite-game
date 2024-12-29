from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
from PIL import Image
import os
import logging

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Configure CORS and upload size limit
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB

logging.basicConfig(level=logging.DEBUG)

@app.route("/upload", methods=["OPTIONS", "POST"])
def upload_sprite():
    if request.method == "OPTIONS":
        # Handle CORS preflight request
        response = app.response_class()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response

    try:
        logging.debug("Upload endpoint hit")
        if "sprite" not in request.files:
            logging.error("No file found in request")
            return jsonify({"error": "No file uploaded"}), 400

        sprite = request.files["sprite"]
        filepath = os.path.join(UPLOAD_FOLDER, sprite.filename)
        logging.debug(f"Saving file to {filepath}")
        sprite.save(filepath)

        # Process the uploaded image
        img = Image.open(filepath)
        logging.debug(f"Opened image: {filepath}, Mode: {img.mode}, Size: {img.size}")

        if img.mode == "RGBA":
            img = img.convert("RGB")
            logging.debug("Converted RGBA to RGB")

        processed_path = os.path.join(UPLOAD_FOLDER, f"processed_{sprite.filename}")
        logging.debug(f"Saving processed file to {processed_path}")
        img.save(processed_path, format="JPEG")

        return jsonify({"message": "Sprite processed", "sprite_path": f"uploads/processed_{sprite.filename}"})
    except Exception as e:
        logging.error(f"Error during upload: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/uploads/<path:filename>')
def serve_uploaded_file(filename):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    response = send_file(file_path)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

if __name__ == "__main__":
    app.run(port=8000, debug=True)
