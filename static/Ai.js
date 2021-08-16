importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.8.0/dist/tf.min.js');

let model;
const map_size = 5;
let state = Array(map_size * map_size).fill(0);
state[map_size-1] = 1; // AI
state[map_size * (map_size-1)] = -1; //Player


let possible = [0, 1, 2, 3];
let random_per = 1; 


async function loadModel() {
    model = await tf.loadLayersModel("http://localhost:8000/model.json");
}

onmessage = function(e) {
    const data = e.data;
    if (data["type"] === "message") {
        if (data["value"] === "start") {
            random_per = data["random"];
            loadModel();
        }
        else if(data["value"] === "again"){
            state = data["state"];
            tmp = []
            for(let i=0;i<possible.length;i++){
                if(possible[i] != data["action"]){
                    tmp.push(possible[i]);
                }
            }
            possible = tmp;
            console.log("possible = ", possible);
            predict();
        }
    }
    else if (data["type"] == "state") {
        state = data["state"];
        possible = [0, 1, 2, 3];
        predict();
    }
}

function predict(){

    if(possible.length == 0){
        console.log("model can't do anything");
        postMessage({
            "type": "message",
            "value": "lose",
        });
        return ;
    }
    const input = convert(state);
    const prediction = model.predict(tf.tensor([input])).dataSync();

    action = possible.reduce((i, j) => prediction[i]>prediction[j]?i:j);
    console.log("ai action : ", action);

    //action = prediction.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);

    if (Math.random() < random_per) {
         //choose possible action
        action = possible[Math.floor(Math.random()*possible.length)];
    }
    postMessage({
        "type": "action",
        "value": action,
    });
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


function convert(state){
    let ret = Array(map_size * map_size * 2).fill(0);
    for(let i=0;i<map_size * map_size;i++){
        if(state[i] > 0){
            ret[i] = state[i];
        }
        else if(state[i] < 0){
            ret[i+map_size*map_size] = -state[i];
        }
    }
    return ret;
}