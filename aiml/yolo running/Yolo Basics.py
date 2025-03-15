from ultralytics import YOLO
import cv2

model = YOLO('../Yolo-Weights/yolov8l.pt')
results = model("Images/img.png", show=True)
cv2.waitKey(0)


# import torch
# import torchvision
#
# print("Torch Version:", torch.__version__)
# print("Torchvision Version:", torchvision.__version__)
# print("CUDA Available:", torch.cuda.is_available())
# print("CUDA Version:", torch.version.cuda)
