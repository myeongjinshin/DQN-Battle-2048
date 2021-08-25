import { calculateScore } from "./Logic.js";


export default class MyRecorder {
    constructor(){
        this.database = []
        this.map_size = 5;
        this.zeros = Array(this.map_size * this.map_size).fill(0);
    }
    record(state, action, next_state, turn)
    {
        if (turn == true) {
            return ;
        }
        if(this.database.length == 0){
            this.database.push({
              "state" : state,
              "action" : action,
              "reward" : null,
              "next_state" : this.zeros,
              "done" : false
            });
            return ;
        }

        const i = this.database.length-1;
        this.database[i]["next_state"] = state;
        const [player_bef, ai_bef] = calculateScore(this.database[i]["state"]);
        const [player_aft, ai_aft] = calculateScore(state);
    
        this.database[i]["reward"] = (ai_aft - player_aft - ai_bef + player_bef)/(player_aft + ai_aft)*200;
        this.database.push({
            "state" : state,
            "action" : action,
            "reward" : null,
            "next_state" : this.zeros,
            "done" : false
        });
    }
    finishRecord(winner, state)
    {
        if (winner == true) { //player승 -> reward음수
            const i = this.database.length-1;
            const [player, ai] = calculateScore(state);
            this.database[i]["reward"] = -((player - ai)/(player+ai)*200 + 100);
            this.database[i]["next_state"] = state
            this.database[i]["done"] = true;
        }
        else {
            const i = this.database.length-1;
            const [player, ai] = calculateScore(state);
            this.database[i]["reward"] = ((ai - player)/(ai+player)*200 + 100);
            this.database[i]["next_state"] = state
            this.database[i]["done"] = true;
        }
        for(let i=0;i<this.database.length;i++){
            this.database[i]["state"] = this.convert(this.database[i]["state"]);
            this.database[i]["next_state"] = this.convert(this.database[i]["next_state"]);
        }
        return this.database;
    }
    convert(state){
        let ret = Array(this.map_size * this.map_size * 2).fill(0);
        let max = 0
        for(let i=0;i<this.map_size * this.map_size;i++){
            if(state[i]>0&&max<state[i]) max = state[i];
            if(state[i]<0&&max<-state[i]) max = -state[i];
        }
        for(let i=0;i<this.map_size * this.map_size;i++){
            if(state[i] > 0){ //ai 먼저
                ret[i] = Math.pow(2, state[i]-max);
            }
            else if(state[i] < 0){ //뒤에 player
                ret[i+this.map_size*this.map_size] = Math.pow(2, -state[i]-max);
            }
        }
        return ret;
    }
}