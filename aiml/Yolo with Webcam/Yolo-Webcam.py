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

while True:
    success, img = cap.read()

    if not success:
        print("Failed to capture image")
        break

    # Resize the image to avoid zooming issues
    img = cv2.resize(img, (1280, 720))  # Adjust as needed

    results = model(img, stream=True)

    for r in results:
        boxes = r.boxes
        for box in boxes:
            # Bounding Box
            x1, y1, x2, y2 = map(int, box.xyxy[0])

            # Get class name
            cls = int(box.cls[0])
            class_name = model.names[cls]  # Get class name from model

            # Only detect animals
            if class_name in animal_classes:
                # Draw bounding box
                w, h = x2 - x1, y2 - y1
                cvzone.cornerRect(img, (x1, y1, w, h), colorR=(0, 255, 0))

                # Display "Animal Detected" inside the bounding box
                cvzone.putTextRect(img, "Animal Detected", 
                                   (x1, max(y1 - 10, 30)), 
                                   scale=1, thickness=1, colorR=(0, 255, 0))

    # Show video output
    cv2.imshow("Animal Detection", img)

    # Exit if 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
