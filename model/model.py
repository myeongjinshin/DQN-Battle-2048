import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.optimizers import Adam
import tensorflowjs as tfjs
import numpy as np
import json
import random


class DQNAgent:
    def __init__(self):
        with open("props.json", "r") as f:
            props = json.load(f)

        with open("./dataset/replay.json", "r") as f:
            memory = json.load(f)

        self.load_model = props["load_model"]
        self.model_name = props["model_name"]
        # DQN 하이퍼파라미터
        self.map_width = props["map_width"]
        self.action_size = 4
        self.state_size = self.map_width ** 2
        self.discount_factor = props["discount_factor"]
        self.learning_rate = props["learning_rate"]
        self.epsilon = props["epsilon"]
        self.epsilon_decay = props["epsilon_decay"]
        self.epsilon_min = props["epsilon_min"]
        self.batch_size = props["batch_size"]
        self.train_start = props["train_start"]
        self.max_memory = props["max_memory"]

        # 리플레이 메모리
        self.memory = memory

        # 모델과 타깃 모델 생성
        self.model = self.build_model()
        self.target_model = self.build_model()

        # 타깃 모델 초기화
        self.update_target_model()

        if self.load_model:
            self.model.load_weights("./history/model_0805_0140.h5")

    def build_model(self):
        model = keras.models.Sequential()
        model.add(layers.Dense(24, input_dim=self.state_size*2, activation="sigmoid", kernel_initializer="he_uniform"))
        model.add(layers.Dense(24, activation="relu", kernel_initializer="he_uniform"))
        model.add(layers.Dense(24, activation="relu", kernel_initializer="he_uniform"))
        model.add(
            layers.Dense(
                self.action_size, activation="linear", kernel_initializer="he_uniform"
            )
        )
        model.summary()
        model.compile(
            optimizer=Adam(lr=self.learning_rate), loss="mse", metrics=["mae"]
        )
        return model

    # 타깃 모델을 모델의 가중치로 업데이트
    def update_target_model(self):
        self.target_model.set_weights(self.model.get_weights())

    # 입실론 탐욕 정책으로 행동 선택
    def get_action(self, state):
        if np.random.rand() <= self.epsilon:
            return random.randrange(self.map_width)
        else:
            q_value = self.model.predict(state)
            return np.argmax(q_value[0])

    def append_sample(self, state, action, reward, next_state, done):
        self.memory.append(
            {
                "state": state,
                "action": action,
                "reward": reward,
                "next_state": next_state,
                "done": done,
            }
        )

    # 리플레이 메모리에서 무작위로 추출한 배치로 모델 학습
    def train_model(self):
        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay

        # 메모리에서 배치 크기만큼 무작위로 샘플 추출
        mini_batch = random.sample(self.memory, self.batch_size)

        states = np.zeros((self.batch_size, self.state_size*2))
        next_states = np.zeros((self.batch_size, self.state_size*2))
        actions, rewards, dones = [], [], []

        for i in range(self.batch_size):
            states[i] = mini_batch[i]["state"]
            actions.append(mini_batch[i]["action"])
            rewards.append(mini_batch[i]["reward"])
            next_states[i] = mini_batch[i]["next_state"]
            dones.append(mini_batch[i]["done"])

        # 현재 상태에 대한 모델의 큐함수
        # 다음 상태에 대한 타깃 모델의 큐함수
        target = self.model.predict(states)
        target_val = self.target_model.predict(next_states)

        # 벨만 최적 방정식을 이용한 업데이트 타깃
        for i in range(self.batch_size):
            if dones[i]:
                target[i][actions[i]] = rewards[i]
            else:
                target[i][actions[i]] = rewards[i] + self.discount_factor * (np.amax(target_val[i]))

        self.model.fit(states, target, batch_size=self.batch_size, epochs=1, verbose=0)


if __name__ == "__main__":
    # DQN 에이전트 생성
    agent = DQNAgent()

    if len(agent.memory) >= agent.train_start:
        for i in range(5000) :
            if i % 100 == 99 :
                print((i+1)//100,"% done... epsilon : ", agent.epsilon)
            agent.train_model()
    agent.model.save_weights("./history/"+agent.model_name)
    tfjs.converters.save_keras_model(agent.model, "./history")