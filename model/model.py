import tensorflowjs as tfjs
from tensorflow import keras
from keras.layers import Dense, Concatenate, Flatten, Conv2D, MaxPooling2D
from tensorflow.keras.optimizers import Adam


def build_encoder():
    model = keras.models.Sequential()
    model.add(Conv2D(32, kernel_size=(3, 3), activation="relu", kernel_initializer="he_uniform"))
    model.add(Conv2D(32, kernel_size=(3, 3), activation="relu", kernel_initializer="he_uniform"))
    model.add(Flatten())
    model.add(Dense(128, activation="linear", kernel_initializer="he_uniform"))
    return model

def build_actor():
    model = keras.models.Sequential();
    model.add(Dense(128, activation="relu", kernel_initializer="he_uniform"))
    model.add(Dense(4, activation="linear", kernel_initializer="he_uniform"))
    return model

def build_critic():
    model = keras.models.Sequential();
    model.add(Dense(128, activation="relu", kernel_initializer="he_uniform"))
    model.add(Dense(1, activation="linear", kernel_initializer="he_uniform"))
    return model



if __name__ == "__main__":
    # DQN 에이전트 생성
    model = MyModel()
    tfjs.converters.save_keras_model(model, "./test")
