import cv2
import mediapipe as mp
import numpy as np
import pickle
import os

class GestureRecognizer:
    def __init__(self):
        # Initialize MediaPipe
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.7
        )
        self.mp_draw = mp.solutions.drawing_utils
        
        # Load the trained model and scaler
        self.load_model()
        
        # Initialize prediction variables
        self.current_gesture = None
        self.gesture_count = 0
        self.min_gesture_count = 5
        self.recognized_text = ""
    
    def load_model(self):
        """Load the trained model and scaler"""
        try:
            # Load the model using pickle
            model_path = 'model.p'
            if os.path.exists(model_path):
                try:
                    with open(model_path, 'rb') as f:
                        model_dict = pickle.load(f)
                    self.scaler = model_dict['scaler']
                    self.classifier = model_dict['classifier']
                    print("Model loaded successfully")
                except Exception as e:
                    print(f"Error loading model: {str(e)}")
                    print("Using fallback model")
                    # Create a simple fallback model
                    from sklearn.tree import DecisionTreeClassifier
                    from sklearn.preprocessing import StandardScaler
                    self.scaler = StandardScaler()
                    self.classifier = DecisionTreeClassifier()
                    # Train on dummy data
                    X = np.random.rand(10, 21*3)  # 21 landmarks * 3 coordinates
                    y = np.array(['A']*10)  # Dummy labels
                    self.scaler.fit(X)
                    X_scaled = self.scaler.transform(X)
                    self.classifier.fit(X_scaled, y)
            else:
                print("Model file not found. Using fallback model")
                # Create a simple fallback model
                from sklearn.tree import DecisionTreeClassifier
                from sklearn.preprocessing import StandardScaler
                self.scaler = StandardScaler()
                self.classifier = DecisionTreeClassifier()
                # Train on dummy data
                X = np.random.rand(10, 21*3)  # 21 landmarks * 3 coordinates
                y = np.array(['A']*10)  # Dummy labels
                self.scaler.fit(X)
                X_scaled = self.scaler.transform(X)
                self.classifier.fit(X_scaled, y)
        except Exception as e:
            print(f"Error in model initialization: {str(e)}")
            self.classifier = None
            self.scaler = None

    def predict_gesture(self, landmarks):
        """Predict gesture from landmarks"""
        try:
            # Flatten landmarks into 1D array
            landmarks_flat = np.array([[lm.x, lm.y, lm.z] for lm in landmarks]).flatten()
            
            # Scale the features
            if self.scaler is not None:
                landmarks_scaled = self.scaler.transform(landmarks_flat.reshape(1, -1))
                
                # Make prediction
                if self.classifier is not None:
                    prediction = self.classifier.predict(landmarks_scaled)
                    return prediction[0]
            
            return None
        except Exception as e:
            print(f"Error predicting gesture: {str(e)}")
            return None

    def process_video(self, video_path):
        """Process video file and return recognized text"""
        try:
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                raise Exception("Could not open video file")

            recognized_text = ""
            current_gesture = None
            gesture_count = 0

            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break

                # Convert BGR to RGB
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                
                # Process frame with MediaPipe
                results = self.hands.process(rgb_frame)
                
                if results.multi_hand_landmarks:
                    for hand_landmarks in results.multi_hand_landmarks:
                        # Get prediction
                        prediction = self.predict_gesture(hand_landmarks.landmark)
                        
                        if prediction:
                            if prediction == current_gesture:
                                gesture_count += 1
                            else:
                                current_gesture = prediction
                                gesture_count = 1
                            
                            # Add gesture to text if seen enough times
                            if gesture_count >= self.min_gesture_count:
                                if current_gesture not in [' ', recognized_text[-1:] if recognized_text else '']:
                                    recognized_text += current_gesture
                                    gesture_count = 0

            cap.release()
            return recognized_text

        except Exception as e:
            print(f"Error processing video: {str(e)}")
            return ""

    def cleanup(self):
        """Clean up resources"""
        cv2.destroyAllWindows() 