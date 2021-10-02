from ast import literal_eval
from model.model import build_actor, build_critic, build_encoder
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.optimizers import Adam
import tensorflowjs as tfjs
import numpy as np
import json
import random
import os

class Agent:
    def __init__(self):
        with open("props.json", "r") as f:
            props = json.load(f)

        memory = []
        with open("./dataset/dataset.txt", "r") as f:
            while True :
                line = f.readline()
                line = line.replace("false", "False");
                line = line.replace("true", "True");
                if not line :
                    break
                memory.append(literal_eval(line))

        self.load_model = props["load_model"]
        self.model_name = props["model_name"]
        # DQN 하이퍼파라미터
        self.map_width = props["map_width"]
        self.action_size = 4
        self.state_size = (self.map_width ** 2) * 2
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
        self.encoder = build_encoder()
        self.actor = build_actor()
        self.critic = build_critic()
        self.encoder.summary()
        self.encoder.compile(
            optimizer=Adam(lr=self.learning_rate), loss="mse", metrics=["mae"]
        )
        self.actor.summary()
        self.actor.compile(
            optimizer=Adam(lr=self.learning_rate), loss="mse", metrics=["mae"]
        )
        self.critic.summary()
        self.critic.compile(
            optimizer=Adam(lr=self.learning_rate), loss="mse", metrics=["mae"]
        )
    
    def train_model(self, state, action, reward, next_state, done) :
        target = np.zeros((1, 1))
        advantages = np.zeros((1, 4))

        value = self.critic.predict(state)[0]
        next_value = self.critic.predict(next_state)[0]

        if done:
            advantages[0][action] = reward - value
            target[0][0] = reward
        else:
            advantages[0][action] = reward + self.discount_factor * next_value - value
            target[0][0] = reward + self.discount_factor * next_value
        
        self.actor.fit(state, advantages, epoches=1, verbos=0)
        self.critic.fit(state, target, epoches=1, verbos=0)
        

    # 타깃 모델을 모델의 가중치로 업데이트
    def update_target_model(self):
        self.target_model.set_weights(self.model.get_weights())

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

        tot_loss = 0
        for st in range(0, len(self.memory), self.batch_size) :
            mini_batch = self.memory[st:st + self.batch_size]

            states = np.zeros((len(mini_batch), self.state_size))
            next_states = np.zeros((len(mini_batch), self.state_size))
            actions, rewards, dones = [], [], []

            for i in range(len(mini_batch)):
                states[i] = mini_batch[i]["state"]
                actions.append(mini_batch[i]["action"])
                rewards.append(mini_batch[i]["reward"])
                next_states[i] = mini_batch[i]["next_state"]
                dones.append(mini_batch[i]["done"])

            target = self.model.predict(states)
            target_val = self.target_model.predict(next_states)

            # 벨만 최적 방정식을 이용한 업데이트 타깃
            for i in range(len(mini_batch)):
                if dones[i]:
                    target[i][actions[i]] = rewards[i]
                else:
                    target[i][actions[i]] = rewards[i] + self.discount_factor * (np.amax(target_val[i]))

            hist = self.model.fit(states, target, batch_size=len(mini_batch), epochs=1, verbose=0)
            tot_loss = tot_loss + hist.history['loss'][0]
        return tot_loss

if __name__ == "__main__":
    # DQN 에이전트 생성
    agent = Agent()

    if len(agent.memory) >= agent.train_start:
        for i in range(500) :
            train_loss = agent.train_model()
            print((i+1)//5,"% done... loss : ",train_loss)

        agent.model.save_weights("./history/"+agent.model_name)
        tfjs.converters.save_keras_model(agent.model, "./history")