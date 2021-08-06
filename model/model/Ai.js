importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.8.0/dist/tf.min.js');

let model;
const map_width = 5;
let state = Array(map_width * map_width).fill(0);

async function loadModel() {
    model = await tf.loadLayersModel("http://localhost:8000/model.json");
    const prediction = model.predict(tf.tensor([state]));
    prediction.print();
    startPrediction();
}

onmessage = function(e) {
    const data = e.data;
    if (data["type"] == "message") {
        if (data["value"] == "start") {
            loadModel();
        }
    } else if (data["type"] == "state") {
        state = data["state"];
    }
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


function startPrediction() {
    let tot = 10000
    let delay = 300

    for (let i = 0; i < tot / delay; i++) {
        sleep(delay);
        const prediction = model.predict(tf.tensor([state])).dataSync();
        action = prediction.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
        
        if (Math.random() < 0.8) {
            action = getRandomInt(0, map_width * map_width);
        }
        postMessage({
            "type": "action",
            "value": action,
        });
    }
    postMessage({
        "type": "message",
        "value": "finish"
    });
}