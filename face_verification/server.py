from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64

app = Flask(__name__)
CORS(app)

def detect_face_and_eyes(image):
    # Load classifiers
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')
    
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Detect faces
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    
    if len(faces) != 1:
        return None, "Multiple faces or no face detected"
    
    # Get face location
    (x, y, w, h) = faces[0]
    face_roi_gray = gray[y:y+h, x:x+w]
    
    # Detect eyes in the face region
    eyes = eye_cascade.detectMultiScale(face_roi_gray)
    
    if len(eyes) < 2:
        return None, "Eyes not clearly visible"
    
    # Check face position
    center_x = image.shape[1] / 2
    center_y = image.shape[0] / 2
    face_center_x = x + w/2
    face_center_y = y + h/2
    
    # Calculate position guidance
    position_message = ""
    if abs(face_center_x - center_x) > 50:
        position_message = "Move " + ("left" if face_center_x > center_x else "right")
    elif abs(face_center_y - center_y) > 50:
        position_message = "Move " + ("up" if face_center_y > center_y else "down")
    
    return {
        'x': int(x),
        'y': int(y),
        'width': int(w),
        'height': int(h),
        'eyes': len(eyes),
        'position_guidance': position_message
    }, "Face detected successfully"

@app.route('/verify-face', methods=['POST'])
def verify_face():
    try:
        data = request.json
        image_data = data['image']
        
        # Convert base64 to image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Detect face and eyes
        face_data, message = detect_face_and_eyes(img)
        
        if face_data:
            return jsonify({
                'success': True,
                'message': message,
                'faceLocation': face_data,
                'guidance': face_data['position_guidance']
            })
        
        return jsonify({
            'success': False,
            'message': message
        })
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 400

if __name__ == '__main__':
    app.run(port=5000)