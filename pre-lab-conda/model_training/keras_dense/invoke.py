import tensorflow as tf
from tensorflow.keras.datasets import mnist
import numpy as np

model = tf.keras.models.load_model("mnist_model.keras")

# loading data
_, (x_test, y_test) = mnist.load_data()
x_test = x_test.astype("float32") / 255.0 # normalization

img = x_test[0]

img = np.expand_dims(img, axis=0)

logits = model.predict(img)

probs = tf.nn.softmax(logits).numpy()

pred = np.argmax(probs)

print("模型预测是：", pred)
print("真实标签是：", y_test[0])