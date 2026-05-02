import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import mnist
from utils.plot import plot_history

# loading data
(x_train, y_train), (x_test, y_test) = mnist.load_data()
x_train = x_train.astype("float32") / 255.0 # normalization
x_test = x_test.astype("float32") / 255.0 # normalization
def main(dropout_rate):
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

    import time
    start = time.time()
    # training
    history = model.fit(
        x_train,
        y_train,
        epochs=5,
        batch_size=64,
        validation_split=0.1
    )
    end = time.time()
    plot_history(history, dropout_rate, f"dense_{dropout_rate}.png")

    # testing
    test_loss, test_acc = model.evaluate(x_test, y_test)
    print(f"Test loss: {test_loss}")
    print(f"Test accuracy: {test_acc}")
    print(f"Training time: {end - start:.2f} seconds")


# main(0.0)
# main(0.2)
# main(0.5)
main(1.0)
# model.save("mnist_model.keras")