import React, {Component} from "react";
import './App.css'
import io, { protocol } from "socket.io-client";
import { calcResult } from "./Logic.js";
import { drawState , animationPath } from "./Drawing.js"


//design : https://codepen.io/saninmersion/pen/xWqaxJ


const socket = io();

const model = new Worker('Ai.js');
console.log("starting");
model.postMessage({"type":"message", "value":"start"});

let database = [];
const map_size = 5;

class Game extends React.Component {

  constructor(props){
    super(props);
    //Mount Canvas
    this.canvasRef = React.createRef();
    this.ctx = null;

    let initial_state = Array(map_size * map_size).fill(0);
    initial_state[map_size-1] = 1; // AI
    initial_state[map_size * (map_size-1)] = -1; //Player

    this.state = {
      history:[{
        squares:initial_state,
        turn:true, //my turn
      }],
      end : false,
      index : 0,
      canvas : document.getElementById('canvas'),
    }

    const tmp = this;
    model.onmessage = function(e) {
      const data = e.data;
      if(data["type"] === "message")
      {
        if(data["value"] === "finish")
        {
          console.log(database);
          socket.emit("database", database);
          tmp.setState({
            end:true,
          });
        }
      }
      else if(data["type"] === "action"){
        const bef_state = tmp.state.history[tmp.state.index].squares;
        const bef = calculateScore(bef_state);
        const action = data["value"];

        tmp.handleAction(action);

        const current = tmp.state.history[tmp.state.index];

        database.push({
          "state" : formatter(bef_state),
          "action" : action,
          "reward" : 100,
          "next_state" : formatter(current),
          "done" : false
        });
      }
    }

    window.addEventListener("keydown", (e) => this.handleKeyboard(e));

  }

  componentDidMount() {
    console.log("mounted");
    this.ctx = this.canvasRef.current.getContext("2d");
    drawState(this.canvasRef.current, this.state.history[this.state.index].squares);
  }

  handleKeyboard(event){
    if(event.key == "ArrowRight") {
      this.handleAction(0);
    }
    else if(event.key == "ArrowLeft") {
      this.handleAction(1);
    }
    else if(event.key == "ArrowDown") {
      this.handleAction(2);
    }
    else if(event.key == "ArrowUp") {
      this.handleAction(3);
    }
  }

  handleAction(action) {
    const history = this.state.history.slice(0, this.state.index + 1);
    const current = this.state.history[this.state.index];
    const [paths, nxt] = calcResult(current.squares, action, current.turn);

     //아무것도 바뀌지 않는다면 turn을 넘기지 않음.
    if(JSON.stringify(current.squares) === JSON.stringify(nxt)){
      return ;
    }
    this.setState({
      history: history.concat([{
        squares:nxt,
        turn:!current.turn,
      }]),
      index: this.state.index+1,
    });
    animationPath(this.canvasRef.current, current.squares, paths, nxt);
  }

  rollBack(){
    const history = this.state.history.slice();
    const top = this.state.index;
    const turn = history[top].turn;

    if(turn === false) {
      console.log("You can only go backwards on your turn.");
      return ;
    }
    if(top <= 0){
      console.log("You can't go back");
      return ;
    }
    this.setState({
      history:history.slice(0, top-1),
      index : top-2,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.index];

    let status = "Battle 2048!!"

    let message = "Your Turn";

    if(current.turn === false) {
      message = "Ai's Turn";
    }

    return (
      <div className="game">
        <h1 className="game-title">
          <div>{status}</div>
        </h1>
        <canvas ref={this.canvasRef} width={'500'} height={'500'}></canvas>
        <h1 className="game-info">
          <div>{message}</div>
        </h1>
      </div>
    );
  }
}


function calculateScore(state){
  let score = 0;
  for(let i = 0;i<state.length;i++){
    if(state[i] === 'X') score++;
    else if(state[i] === 'O') score--;
  }
  return score;
}

function formatter(state){
  let ret = Array(map_size * map_size).fill(0);
  for(let i = 0;i<state.length;i++){
    if(state[i] === 'X') ret[i]=-1;
    else if(state[i] === 'O') ret[i]=1;
    else ret[i]=0;
  }
  return ret;
}

export default Game;
