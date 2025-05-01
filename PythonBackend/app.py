from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import cv2
import numpy as np
import mediapipe as mp
import pickle
from datetime import datetime
import json
from speech_to_isl import TextToSignConverter
from gesture_to_speech import GestureRecognizer
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Allow all origins for development
CORS(app)

# Initialize converters
try:
    text_to_sign = TextToSignConverter()
    gesture_recognizer = GestureRecognizer()
    logger.info("Converters initialized successfully")
except Exception as e:
    logger.error(f"Error initializing converters: {str(e)}")
    text_to_sign = None
    gesture_recognizer = None

# Ensure upload directory exists
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    logger.info(f"Created upload directory: {UPLOAD_FOLDER}")

@app.route('/')
def test_route():
    return jsonify({"message": "Server is running"}), 200

@app.route('/api/test', methods=['POST'])
def test_post():
    try:
        data = request.json
        return jsonify({"received": data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/text-to-sign', methods=['POST', 'OPTIONS'])
def text_to_sign_endpoint():
    logger.info(f"Received request to /api/text-to-sign with method {request.method}")
    
    if request.method == 'OPTIONS':
        response = app.make_default_options_response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

    try:
        if not text_to_sign:
            logger.error("Text to sign converter not initialized")
            return jsonify({'error': 'Text to sign converter not initialized'}), 500

        data = request.get_json()
        logger.info(f"Received data: {data}")
        
        if not data:
            logger.error("No JSON data received")
            return jsonify({'error': 'No data provided'}), 400
        
        text = data.get('text', '')
        if not text:
            logger.error("No text provided in request")
            return jsonify({'error': 'No text provided'}), 400

        # Get image paths for the text
        image_paths = text_to_sign.convert_text_to_sign(text)
        logger.info(f"Generated {len(image_paths)} gesture images")

        # Convert file paths to URLs
        image_urls = []
        for path in image_paths:
            # Get just the filename from the path
            filename = os.path.basename(path)
            # Create URL for the image
            image_urls.append(f'/gestures/{filename}')

        response = jsonify({
            'success': True,
            'images': image_urls
        })
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response

    except Exception as e:
        logger.error(f"Error in text-to-sign endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/gestures/<path:filename>')
def serve_gesture(filename):
    return send_from_directory('GestureAtoZ1to0', filename)

@app.route('/api/speech-to-sign', methods=['POST'])
def speech_to_sign_endpoint():
    try:
        data = request.json
        text = data.get('speech_text', '')
        if not text:
            return jsonify({'error': 'No speech text provided'}), 400

        # Generate video file name with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_file = f'speech_to_sign_{timestamp}.mp4'
        output_path = os.path.join(UPLOAD_FOLDER, output_file)

        # Convert speech text to sign language video
        text_to_sign.convert_text_to_sign(text, output_path)

        return jsonify({
            'success': True,
            'video_url': f'/uploads/{output_file}'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/sign-to-text', methods=['POST'])
def sign_to_text_endpoint():
    try:
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400

        video_file = request.files['video']
        if video_file.filename == '':
            return jsonify({'error': 'No selected video file'}), 400

        # Save the uploaded video temporarily
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        video_path = os.path.join(UPLOAD_FOLDER, f'sign_video_{timestamp}.mp4')
        video_file.save(video_path)

        # Process the video and get text
        text = gesture_recognizer.process_video(video_path)

        # Clean up the temporary video file
        os.remove(video_path)

        return jsonify({
            'success': True,
            'text': text
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/uploads/<path:filename>')
def serve_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    port = 5000
    logger.info(f"Starting Flask server on port {port}")
    app.run(debug=True, port=port, host='0.0.0.0') 