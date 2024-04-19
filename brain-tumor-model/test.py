import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import cv2

resnet_model = load_model("./BrainTumorResnet50.h5")
image_path = r""
img = cv2.imread(image_path)
img = cv2.resize(img, (224, 224))
img_array = np.array(img)
print(img_array.shape)
img_array = img_array.reshape(1, 224, 224, 3)
print(img_array.shape)

resnet_prediction = resnet_model.predict(img_array)
final_label = np.argmax(resnet_prediction, axis=1)

print("Prediction:", final_label)
