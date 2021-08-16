import React from "react";
import './Home.css'
import { calcResult, calculateScore, isStuck } from "../components/Logic.js";
import { drawState , animationPath } from "../components/Drawing.js";
import TypeWriterEffect from "react-typewriter-effect";

var constants = require("../helpers/Constants.js");

const model1 = new Worker('Ai.js');
model1.postMessage({"type":"message", "value":"start", "random": 1});

const model2 = new Worker('Ai.js');
model2.postMessage({"type":"message", "value":"start", "random": 0});

const map_size = constants.map_size;

class Home extends React.Component {

  constructor(props){
    super(props);
    //Mount Canvas
    this.canvasRef = React.createRef();
    this.ctx = null;

    let initial_state = Array(map_size * map_size).fill(0);
    initial_state[map_size-1] = 1; // AI1
    initial_state[map_size * (map_size-1)] = -1; //AI2

    this.state = {
      history:[{
        squares:initial_state,
        turn:true, //AI1 turn
      }],
      winner : null,
      index : 0,
      canvas : document.getElementById('canvas'),
    }

    let tmp = this;
    model1.onmessage = function(e) {
        const data = e.data;
        if(data["type"] === "action"){
            if(tmp.state.winner != null){
                return;
            }
            const action = data["value"];
            const ret = tmp.handleAction(action);

            if(ret === false){
                const current = tmp.state.history[tmp.state.index];
                console.log("roll back", action);
                model1.postMessage({"type":"message", "value" : "again", "action":data["value"], "state" : current.squares});
            } else {
                const nxt = tmp.state.history[tmp.state.index].squares;
                if(tmp.state.winner === null) {
                    setTimeout(() => model2.postMessage({"type":"state", "state":nxt}), 1000);
                }
            }
        }
    }

    model2.onmessage = function(e) {
        const data = e.data;
        if(data["type"] === "action"){
            if(tmp.state.winner != null){
                return ;
            }
            const action = data["value"];
            const ret = tmp.handleAction(action);

            if(ret === false){
                const current = tmp.state.history[tmp.state.index];
                console.log("roll back", action);
                model2.postMessage({"type":"message", "value" : "again", "action":data["value"], "state" : current.squares});
            } else {
                const nxt = tmp.state.history[tmp.state.index].squares;
                if(tmp.state.winner === null) {
                    setTimeout(() => model1.postMessage({"type":"state", "state":nxt}), 1000);
                }
            }
        }
    }

    window.addEventListener("keydown", function(e) {
        if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);

  }

  componentDidMount() {
    //this.renderText("Welcome to Battle 2048", 50, "text1");
    this.ctx = this.canvasRef.current.getContext("2d");
    drawState(this.canvasRef.current, this.state.history[this.state.index].squares);
    const nxt = this.state.history[this.state.index].squares;
    if(this.state.winner === null) {
        setTimeout(() => model1.postMessage({"type":"state", "state":nxt}), 1000);
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

  /*renderText(txt, size, id) {
    let text = document.getElementById(id);
    const typewriter = new Typewriter(text, {
      loop: false
    });
    typewriter.typeString(txt);
  }*/

  render() {
    const history = this.state.history;
    const current = history[this.state.index];

    let status = "SCORE";
    let message = "AI-1 Turn";

    if(current.turn === false) {
      message = "AI-2 Turn";
    }

    const [myScore, aiScore] = calculateScore(current.squares);
    const scoreBoard = "(AI-1) "+myScore+" : "+aiScore+" (AI-2)";

    if(this.state.winner === true) {
      status = "AI-1 Win!!";
    }
    else if(this.state.winner === false) {
      status = "AI-2 Win!!";
    }

    return (
      <>
      <div className="home-game">
        <h1 className="home-game-title">
          <div>{status}</div>
        </h1>
        <h1 className="home-game-score">
          <div>{scoreBoard}</div>
        </h1>
        <canvas ref={this.canvasRef} width={'500'} height={'500'} className="home-game-board"></canvas>
        <h1 className="home-game-info">
          <div>{message}</div>
        </h1>
      </div>
      <div className="home-menu">
        <div className="home-menu-title">
          <div>Battle 2048!!</div>
        </div>
        <div className="home-text">
          <div>
            <TypeWriterEffect
                width="400"
                textStyle={{ 
                  fontFamily: 'Red Hat Display',
                  textAlign: 'center',
                }}
                startDelay={100}
                cursorColor="black"
                multiText={[
                  'So what is different with 2048?',
                  'You can Battle with AI and others',
                  'Prove that you are better',
                ]}
                multiTextDelay={500}
                typeSpeed={50}
              />
          </div>
          <div>
            <TypeWriterEffect
                  width="400"
                  textStyle={{ 
                    fontFamily: 'Red Hat Display',
                    textAlign: 'center',
                  }}
                  startDelay={10000}
                  cursorColor="black"
                  text="Check the Rules!"
                  typeSpeed={50}
                />
          </div>
        </div>
        <div className="home-news">
        </div>
        <div className="home-buttons">
          <button>Play</button>
          <button>Ranking</button>
          <button>Profile</button>
          <button>Rule</button>
        </div>
      </div>
      </>
    );
  }
}

export default Home;
