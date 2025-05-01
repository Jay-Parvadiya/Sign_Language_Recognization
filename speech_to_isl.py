import cv2
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import json
import os
import time
import numpy as np
import logging

logger = logging.getLogger(__name__)

class TextToSignConverter:
    def __init__(self):
        # Download required NLTK data
        try:
            nltk.data.find('tokenizers/punkt')
            nltk.data.find('corpora/stopwords')
        except LookupError:
            nltk.download('punkt')
            nltk.download('stopwords')
        
        # Load or create ISL word mappings
        self.gesture_dir = 'GestureAtoZ1to0'
        self.word_to_gesture = self.load_word_mappings()
        logger.info(f"Loaded {len(self.word_to_gesture)} word mappings")

    def load_word_mappings(self):
        try:
            with open('isl_mappings.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning("isl_mappings.json not found, creating default mappings")
            # Create a basic mapping using available gesture images
            mappings = {}
            if os.path.exists(self.gesture_dir):
                for file in os.listdir(self.gesture_dir):
                    if file.endswith('.png'):
                        word = file.split('.')[0].lower()
                        mappings[word] = os.path.join(self.gesture_dir, file)
            
            # Save the mappings
            with open('isl_mappings.json', 'w') as f:
                json.dump(mappings, f, indent=2)
            return mappings

    def preprocess_text(self, text):
        # Tokenize and convert to lowercase
        words = word_tokenize(text.lower())
        # Remove stopwords and punctuation
        stop_words = set(stopwords.words('english'))
        words = [word for word in words if word.isalnum() and word not in stop_words]
        return words

    def convert_text_to_sign(self, text):
        logger.info(f"Converting text: {text}")
        words = self.preprocess_text(text)
        logger.debug(f"Preprocessed words: {words}")
        
        result_images = []
        for word in words:
            # For single letters, try to find corresponding gesture
            if len(word) == 1 and word.isalpha():
                image_path = os.path.join(self.gesture_dir, f"{word.lower()}.png")
                if os.path.exists(image_path):
                    result_images.append(image_path)
                    continue
            
            # For longer words, try to find gestures for each letter
            for letter in word:
                if letter.isalpha():
                    image_path = os.path.join(self.gesture_dir, f"{letter.lower()}.png")
                    if os.path.exists(image_path):
                        result_images.append(image_path)
        
        logger.info(f"Found {len(result_images)} gesture images")
        return result_images

    def run(self):
        """Run the application"""
        try:
            # Check if GestureAtoZ1to0 directory exists
            if not os.path.exists('GestureAtoZ1to0'):
                print("Error: GestureAtoZ1to0 directory not found!")
                return
            
            # Start the application
            self.run()
            
        except Exception as e:
            print(f"Error running application: {str(e)}")
        finally:
            cv2.destroyAllWindows()

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    converter = TextToSignConverter()
    # Test conversion
    converter.convert_text_to_sign("Hello world")
    converter.run() 