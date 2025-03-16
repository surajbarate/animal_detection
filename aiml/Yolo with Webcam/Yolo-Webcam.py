from ultralytics import YOLO
import cv2
import cvzone
from flask import Flask, Response
import threading

app = Flask(__name__)

# ✅ Load YOLO Model
model = YOLO("../Yolo-Weights/yolov8n.pt")

# ✅ Define animal class names from COCO dataset
animal_classes = ["bird", "cat", "dog", "horse", "sheep", "cow", "elephant", 
                  "bear", "deer", "zebra", "giraffe"]

video_path = None
cap = None
lock = threading.Lock()  # 🔒 Prevents multi-threading conflicts

def generate_frames():
    global cap
    if cap is None or not cap.isOpened():
        return

    while cap.isOpened():
        success, img = cap.read()
        if not success:
            break

        img = cv2.resize(img, (640, 480))  # ✅ Resize for better speed
        results = model(img, stream=True)

        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                cls = int(box.cls[0])
                class_name = model.names[cls]  

                if class_name in animal_classes:
                    cvzone.cornerRect(img, (x1, y1, x2-x1, y2-y1), colorR=(0, 255, 0))
                    cvzone.putTextRect(img, f"{class_name}", (x1, max(y1 - 10, 30)), 
                                       scale=1, thickness=1, colorR=(0, 255, 0))

        _, buffer = cv2.imencode('.jpg', img)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/set_video/<path:path>')
def set_video(path):
    global video_path, cap
    with lock:
        video_path = path
        if cap is not None:
            cap.release()
        cap = cv2.VideoCapture(video_path)
    return {"message": "✅ Video path set successfully!"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True, threaded=True)
