import cv2
print("OpenCV version:", cv2.__version__)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
if face_cascade.empty():
    print("Error: Could not load face cascade classifier")
else:
    print("Face cascade classifier loaded successfully")