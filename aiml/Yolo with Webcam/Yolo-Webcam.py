from ultralytics import YOLO
import cv2
import cvzone
import time

# Open video or webcam
cap = cv2.VideoCapture("../Videos/plantandanimal.mp4")  # Use video

# Set frame size
cap.set(3, 1280)  # Width
cap.set(4, 720)   # Height

# Load YOLO Model
model = YOLO("../Yolo-Weights/yolov8l.pt")

# Define animal class names from COCO dataset
animal_classes = ["bird", "cat", "dog", "horse", "sheep", "cow", "elephant", 
                  "bear", "deer", "zebra", "giraffe"]

prev_frame_time = 0
new_frame_time = 0

while True:
    new_frame_time = time.time()
    success, img = cap.read()

    if not success:
        print("Failed to capture image")
        break

    # Resize the image to avoid zooming issues
    img = cv2.resize(img, (1280, 720))  # Adjust as needed

    results = model(img, stream=True)

    animal_detected = False  # Flag to check if any animal is detected

    for r in results:
        boxes = r.boxes
        for box in boxes:
            # Get class name
            cls = int(box.cls[0])
            class_name = model.names[cls]  # Get class name from model

            # Only detect animals
            if class_name in animal_classes:
                animal_detected = True  # Set flag that an animal is detected
                break  # Stop checking once any animal is detected

    # If any animal is detected, show "Animal detected"
    if animal_detected:
        cvzone.putTextRect(img, "Animal Detected", (50, 50), scale=2, thickness=2, colorR=(0, 255, 0))

    # Show video output
    cv2.imshow("Animal Detection", img)

    # Exit if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
