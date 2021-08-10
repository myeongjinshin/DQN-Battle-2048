import React, {Component} from "react";
import './Game.css'
import io, { protocol } from "socket.io-client";
import { calcResult } from "../components/Logic.js";
import { drawState , animationPath } from "../components/Drawing.js";


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
      winner : null,
      index : 0,
      canvas : document.getElementById('canvas'),
    }

    let tmp = this;
    model.onmessage = function(e) {
      const data = e.data;
      if(data["type"] === "action"){
        console.log("action", data["value"], tmp.state.winner);
        if(tmp.state.winner != null){
          return ;
        }
        const bef_state = tmp.state.history[tmp.state.index].squares;
        const [player_bef, ai_bef] = calculateScore(bef_state);
        const action = data["value"];

        tmp.handleAction(action);

        const current = tmp.state.history[tmp.state.index].squares;
        const [player_aft, ai_aft] = calculateScore(current);

        const reward = (ai_aft - player_aft) - (ai_bef - player_bef);
        console.log("reward = ", reward);
        database.push({
          "state" : bef_state,
          "action" : action,
          "reward" : reward,
          "next_state" : current,
          "done" : false
        });

      }
      else if(data["type"] === "message") {
        if(data["value"] === "lose") {
          
          console.log(database);
          socket.emit("database", database);
          tmp.setState({
            winner:true,
          });
        }
      }
    }

    window.addEventListener("keydown", (e) => this.handleKeyboard(e));

  }

  componentDidMount() {
    this.ctx = this.canvasRef.current.getContext("2d");
    drawState(this.canvasRef.current, this.state.history[this.state.index].squares);
  }

  handleKeyboard(event){
    const current = this.state.history[this.state.index];
    if(current.turn === false || this.state.winner != null){
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
      if(current.turn == false){
        console.log("roll back", action);
        model.postMessage({"type":"message", "value" : "again", "action":action, "state" : current.squares});
      }
      return false;
    }
    let winner = null;
    const [myScore, aiScore] = calculateScore(nxt);
    if(myScore >= aiScore * 10) {
      winner = true;
    }
    else if (myScore * 10 <= aiScore) {
      winner = false;
      if(current.turn === false){
        database[database.length-1]["reward"] += 300;
      }
    }
    if (winner === true){
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


function calculateScore(state){
  let myScore = 0, aiScore = 0;
  for(let i = 0;i<state.length;i++){
    if(state[i] > 0){
      aiScore += Math.pow(2, state[i]-1);
    }
    else if(state[i] < 0){
      myScore += Math.pow(2, -state[i]-1);
    }
  }
  return [myScore, aiScore];
}

export default Game;
