import React, {Component} from "react";
import './Game.css'
import io, { protocol } from "socket.io-client";
import { calcResult, calculateScore, isStuck } from "../components/Logic.js";
import { drawState , animationPath } from "../components/Drawing.js";
import { record, finishRecord } from "../components/Recorder";

var constants = require("../helpers/Constants.js");

const socket = io();

const model = new Worker('Ai.js');
model.postMessage({"type":"message", "value":"start", "random":0.08});

let database = [];
const map_size = constants.map_size;
let pause = false;

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
      winner : null,
      index : 0,
      canvas : document.getElementById('canvas'),
    }

    let tmp = this;
    model.onmessage = function(e) {
      const data = e.data;
      if(data["type"] === "action"){
        if(tmp.state.winner != null){
          return ;
        }
        const action = data["value"];
        const ret = tmp.handleAction(action);

        if(ret === false){
          const current = tmp.state.history[this.state.index];
          console.log("roll back", action);
          model.postMessage({"type":"message", "value" : "again", "action":data["value"], "state" : current.squares});
        }
      }
    }

    window.addEventListener("keydown", (e) => this.handleKeyboard(e));
    window.addEventListener("keydown", function(e) {
        if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);

  }

  componentDidMount() {
    this.ctx = this.canvasRef.current.getContext("2d");
    drawState(this.canvasRef.current, this.state.history[this.state.index].squares);
  }

  handleKeyboard(event){
    const current = this.state.history[this.state.index];
    if(current.turn === false || this.state.winner != null || pause){
      return ;
    }

    let result = true; //맵에 변화를 주는지 여부
    if(event.key === "ArrowRight") {
      result = this.handleAction(0);
    }
    else if(event.key === "ArrowLeft") {
      result = this.handleAction(1);
    }
    else if(event.key === "ArrowDown") {
      result = this.handleAction(2);
    }
    else if(event.key === "ArrowUp") {
      result = this.handleAction(3);
    }
    else{ // another key -> return
      return ;
    }

    if(result === false) {
      return ;
    }
    const nxt = this.state.history[this.state.index].squares;
    if(this.state.winner === null) {
      pause = true;
      setTimeout(disablePause, 1400);
      setTimeout(() => model.postMessage({"type":"state", "state":nxt}), 1000);
    }
  }

  handleAction(action) {
    if(this.state.winner != null) {
      return ;
    }
    const history = this.state.history.slice(0, this.state.index + 1);
    const current = this.state.history[this.state.index];
    const [paths, nxt] = calcResult(current.squares, action, current.turn);

     //아무것도 바뀌지 않는다면 turn을 넘기지 않음.
    if(JSON.stringify(current.squares) === JSON.stringify(nxt)){
      console.log("cut", current.turn);
      return false;
    }

    record(current.squares, action, nxt, current.turn);

    let winner = null;
    const [myScore, aiScore] = calculateScore(nxt);

    if(isStuck(nxt, !current.turn)){
      if(myScore > aiScore) {
        winner = true;
      }
      else if(myScore < aiScore) {
        winner = false;
      }
      else{
        winner = current.turn;
      }
    }
    if(myScore >= aiScore * 10) {
      winner = true;
    }
    else if (myScore * 10 <= aiScore) {
      winner = false;
    }

    if(winner != null){
      database = finishRecord(winner);
      socket.emit("database", database);
    }

    this.setState({
      history: history.concat([{
        squares:nxt,
        turn:!current.turn,
      }]),
      index: this.state.index+1,
      winner:winner,
    });

    animationPath(this.canvasRef.current, current.squares, paths, nxt);
    return true;
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

    const [myScore, aiScore] = calculateScore(current.squares);
    const scoreBoard = "You : "+myScore+" AI : "+aiScore;

    if(this.state.winner === true) {
      status = "You Win!!"
    }
    else if(this.state.winner === false) {
      status = "You Lose"
    }

    return (
      <div className="game">
        <h1 className="game-title">
          <div>{status}</div>
        </h1>
        <h1 className="game-score">
          <div>{scoreBoard}</div>
        </h1>
        <canvas ref={this.canvasRef} width={'500'} height={'500'}></canvas>
        <h1 className="game-info">
          <div>{message}</div>
        </h1>
      </div>
    );
  }
}

function disablePause() {
  pause = false;
}

export default Game;
