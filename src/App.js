import React, {Component} from "react";
import './App.css'
import io from "socket.io-client";


//design : https://codepen.io/saninmersion/pen/xWqaxJ

const socket = io();


const model = new Worker('Ai.js');
console.log("starting");
model.postMessage({"type":"message", "value":"start"});

let database = [];
const map_width = 5;

function Square(props) {
  return (
    <button className="cell" onClick={()=>props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={()=>this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div className = "board">
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
          {this.renderSquare(4)}
        </div>
        <div className="board-row">
          {this.renderSquare(5)}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
          {this.renderSquare(9)}
        </div>
        <div className="board-row">
          {this.renderSquare(10)}
          {this.renderSquare(11)}
          {this.renderSquare(12)}
          {this.renderSquare(13)}
          {this.renderSquare(14)}
        </div>
        <div className="board-row">
          {this.renderSquare(15)}
          {this.renderSquare(16)}
          {this.renderSquare(17)}
          {this.renderSquare(18)}
          {this.renderSquare(19)}
        </div>
        <div className="board-row">
          {this.renderSquare(20)}
          {this.renderSquare(21)}
          {this.renderSquare(22)}
          {this.renderSquare(23)}
          {this.renderSquare(24)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      history:[{
        squares:Array(map_width * map_width).fill(null),
      }],
      stepNumber : 0,
      end : false,
    }
    const tmp = this;
    model.onmessage = function(e) {
      const data = e.data;
      if(data["type"] === "message"){
        if(data["value"] === "finish"){
          console.log(database);
          socket.emit("database", database);
          tmp.setState({
            end:true,
          });
        }
      }
      else if(data["type"] === "action"){
        let history = tmp.state.history.slice(0, tmp.state.stepNumber + 1);
        let bef_state = history[history.length - 1];
        let bef = calculateScore(bef_state.squares);
        const action = data["value"];

        tmp.handleClick(data["value"] + map_width * map_width);

        history = tmp.state.history.slice(0, tmp.state.stepNumber + 1);
        const current = history[history.length - 1];
        const reward = calculateScore(current.squares) - bef;

        database.push({
          "state" : formatter(bef_state.squares),
          "action" : action,
          "reward" : reward * 100,
          "next_state" : formatter(current.squares),
          "done" : false
        });
      }
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if(this.state.end === true) {
      return ;
    }
    if ( i >= map_width * map_width){ // click by AI
      i = i - map_width * map_width;
      if(squares[i] == null){
        squares[i] = 'X';
      }
      else if(squares[i] === 'O'){
        squares[i] = 'X';
      }
      else {
        squares[i] = 'O';
      }
    }
    else { //player click
      if(squares[i] == null){
        squares[i] = 'O';
      }
      else if(squares[i] === 'O'){
        squares[i] = 'X';
      }
      else {
        squares[i] = 'O';
      }
    }
    

    this.setState({
      history:history.concat([{
        squares:squares,
      }]),
      stepNumber: history.length
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber:step,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];

    const moves = history.map((step, i) => {
      const desc = i ?
        'Go to move #' + i :
        'Go to game start';
      return (
        <li key={i}>
          <div>{desc}</div>
        </li>
      );
    });

    let status = "Conquer Game!!"
    let score = 0;
    const currentMap = current.squares;
    for(let i = 0;i<currentMap.length;i++){
      if(currentMap[i] == 'O') {
        score = score + 1;
      }
    }
    let message = "Your Area : " + score;

    if(this.state.end){
      const point = calculateScore(current.squares);
      if(point < 0){
        status = "You Win!";
      }
      else if (point > 0){
        status = "AI Win!";
      }
      else {
        status = "Tie!";
      }
    }


    return (
      <div className="game">
        <h1 className="game-info">
          <div>{status}</div>
        </h1>
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i)=>this.handleClick(i)}
          />
        </div>
        <h2 className="game-info">
          <div>{message}</div>
        </h2>
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
  let ret = Array(map_width * map_width).fill(0);
  for(let i = 0;i<state.length;i++){
    if(state[i] === 'X') ret[i]=-1;
    else if(state[i] === 'O') ret[i]=1;
    else ret[i]=0;
  }
  return ret;
}

export default Game;
