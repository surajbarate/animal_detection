from ultralytics import YOLO
import cv2
import cvzone
import time
import serial  # For LiDAR communication

# Load YOLO Model
model = YOLO("../Yolo-Weights/yolov8l.pt")

# Video Source (Upload Video Instead of Using Webcam)
cap = cv2.VideoCapture("../Videos/cars.mp4")

# Check if video is loaded correctly
if not cap.isOpened():
    print("Error: Couldn't open the video.")
    exit()

# Connect to LiDAR (Change port & baud rate based on your LiDAR model)
try:
    lidar = serial.Serial("COM3", 115200, timeout=1)  # Adjust the port for your system
    print("LiDAR connected successfully!")
except Exception as e:
    print(f"Error connecting to LiDAR: {e}")
    lidar = None

# Define Classes
animal_classes = ["dog", "cat", "horse", "elephant", "cow"]
human_class = "person"
vehicle_classes = ["car", "truck", "bus"]

# Alert Thresholds
CLOSE_DISTANCE_THRESHOLD = 200  # Pixels (for YOLO bounding box)
LARGE_ANIMAL_SIZE_THRESHOLD = 5000  # Pixels (area-based)
LIDAR_ALERT_THRESHOLD = 100  # cm (real-world LiDAR distance)


def calculate_distance(x1, y1, x2, y2):
    """Calculate Euclidean distance between two points."""
    return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5


while True:
    success, img = cap.read()
    if not success:
        print("Video playback finished.")
        break

    img = cv2.resize(img, (1280, 720))  # Resize for processing
    results = model(img, stream=True)

    objects_detected = {}

    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cls = int(box.cls[0])
            class_name = model.names[cls]
            w, h = x2 - x1, y2 - y1

            if class_name in animal_classes + [human_class] + vehicle_classes:
                objects_detected[class_name] = (x1, y1, x2, y2, w * h)
                color = (0, 255, 0) if class_name in animal_classes else (0, 0, 255) if class_name == human_class else (
                255, 255, 0)
                cvzone.cornerRect(img, (x1, y1, w, h), colorR=color)
                cvzone.putTextRect(img, f"Class: {class_name}", (x1, max(y1 - 50, 30)), scale=1, thickness=1,
                                   colorR=color)

                # Big vs Small Animal Alert
                if class_name in animal_classes:
                    alert_color = (0, 0, 255) if w * h > LARGE_ANIMAL_SIZE_THRESHOLD else (0, 255, 0)
                    alert_text = "RED ALERT: Large Animal!" if w * h > LARGE_ANIMAL_SIZE_THRESHOLD else "GREEN ALERT: Small Animal"
                    cvzone.putTextRect(img, alert_text, (50, 50), scale=2, thickness=3, colorR=alert_color,
                                       colorT=(255, 255, 255))

    # Proximity Alerts
    for obj1 in objects_detected:
        for obj2 in objects_detected:
            if obj1 != obj2:
                x1, y1, x2, y2, _ = objects_detected[obj1]
                x3, y3, x4, y4, _ = objects_detected[obj2]
                center1 = ((x1 + x2) / 2, (y1 + y2) / 2)
                center2 = ((x3 + x4) / 2, (y3 + y4) / 2)
                distance = calculate_distance(center1[0], center1[1], center2[0], center2[1])

                if distance < CLOSE_DISTANCE_THRESHOLD:
                    alert_msg = f"ALERT: {obj1} & {obj2} Too Close!"
                    cvzone.putTextRect(img, alert_msg, (50, 100), scale=2, thickness=3, colorR=(0, 0, 255),
                                       colorT=(255, 255, 255))

    # Read LiDAR Data (if connected)
    if lidar:
        try:
            lidar_data = lidar.readline().decode().strip()
            if lidar_data:
                lidar_distance = float(lidar_data)
                cvzone.putTextRect(img, f"LiDAR Distance: {lidar_distance:.2f} cm", (50, 200), scale=1, thickness=2,
                                   colorR=(0, 255, 255))

                if lidar_distance < LIDAR_ALERT_THRESHOLD:
                    cvzone.putTextRect(img, "WARNING: Object too close to LiDAR!", (50, 250), scale=2, thickness=3,
                                       colorR=(255, 0, 0), colorT=(255, 255, 255))
        except:
            print("Error reading LiDAR data")

    # Show Output Window
    cv2.imshow("Smart Wildlife Monitoring with LiDAR & YOLO", img)

    # Exit Condition
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
if lidar:
    lidar.close()
cv2.destroyAllWindows()