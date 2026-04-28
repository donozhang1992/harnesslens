import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import mnist
import matplotlib.pyplot as plt


def plot_history(history, dropout_rate, save_path=None):
    plt.figure(figsize=(12,4))

    # --- Loss 图 ---
    plt.subplot(1,2,1)
    train_loss = history.history['loss']
    val_loss = history.history['val_loss']

    plt.plot(train_loss, label='train_loss')
    plt.plot(val_loss, label='val_loss')

    # 标注最终数值
    plt.text(len(train_loss)-1, train_loss[-1], f"{train_loss[-1]:.4f}", color='blue')
    plt.text(len(val_loss)-1, val_loss[-1], f"{val_loss[-1]:.4f}", color='orange')

    plt.title(f'Loss (Dropout={dropout_rate})')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()

    # --- Accuracy 图 ---
    plt.subplot(1,2,2)
    train_acc = history.history['accuracy']
    val_acc = history.history['val_accuracy']

    plt.plot(train_acc, label='train_acc')
    plt.plot(val_acc, label='val_acc')

    # 标注最终数值
    plt.text(len(train_acc)-1, train_acc[-1], f"{train_acc[-1]:.4f}", color='blue')
    plt.text(len(val_acc)-1, val_acc[-1], f"{val_acc[-1]:.4f}", color='orange')

    plt.title(f'Accuracy (Dropout={dropout_rate})')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()

    # 保存或显示
    plt.savefig(f"dense_{dropout_rate}.png", dpi=200, bbox_inches='tight')
    plt.close()

dropout_rate = 0.2

# loading data
(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train = x_train.astype("float32") / 255.0 # normalization
x_test = x_test.astype("float32") / 255.0 # normalization

model = models.Sequential([
    layers.Flatten(input_shape=(28,28)),
    layers.Dense(128, activation='relu'),
    layers.Dropout(dropout_rate),
    layers.Dense(10)
])

# compile
model.compile(
    optimizer = 'adam',
    loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
    metrics=['accuracy']
)

# training
history = model.fit(
    x_train,
    y_train,
    epochs=5,
    batch_size=64,
    validation_split=0.1
)

plot_history(history, dropout_rate)

# testing
test_loss, test_acc = model.evaluate(x_test, y_test)
print(f"Test loss: {test_loss}")
print(f"Test accuracy: {test_acc}")


model.save("mnist_model.keras")