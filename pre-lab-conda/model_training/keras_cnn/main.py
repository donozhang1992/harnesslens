import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import mnist
from utils.plot import plot_history

dropout_rate = 0.2

# loading data
(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train = x_train.astype("float32") / 255.0 # normalization
x_test = x_test.astype("float32") / 255.0 # normalization
x_train_small = x_train[:1000]
y_train_small = y_train[:1000]

model = models.Sequential([
    layers.Reshape((28,28,1), input_shape=(28,28)),
    
    # Data augmentation
    layers.RandomRotation(0.1),
    layers.RandomZoom(0.1),
    layers.RandomFlip("horizontal"),
    
    layers.Conv2D(32, (3,3), activation='relu'),
    layers.MaxPooling2D((2,2)),
    
    layers.Conv2D(64, (3,3), activation='relu'),
    layers.MaxPooling2D((2,2)),
    
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(10)
])

# compile
model.compile(
    optimizer = 'adam',
    loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
    metrics=['accuracy']
)

import time
start = time.time()
# training
history = model.fit(
    # x_train,
    # y_train,
    x_train_small,
    y_train_small,
    epochs=5,
    batch_size=64,
    validation_split=0.1
)
end = time.time()
plot_history(history, dropout_rate, f"cnn_{dropout_rate}_{time.strftime('%Y_%m_%d_%H_%M_%S', time.localtime(end))}.png")

# testing
test_loss, test_acc = model.evaluate(x_test, y_test)
print(f"Test loss: {test_loss}")
print(f"Test accuracy: {test_acc}")
print(f"Training time: {end - start:.2f} seconds")


model.save("mnist_model.keras")