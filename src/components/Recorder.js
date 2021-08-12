import { calculateScore } from "./Logic.js";

let database = []
const map_size = 5;
let zeros = Array(map_size * map_size).fill(0);

export function record(state, action, next_state, turn)
{
    if (turn == true) {
        return ;
    }
    if(database.length == 0){
        database.push({
          "state" : state,
          "action" : action,
          "reward" : null,
          "next_state" : zeros,
          "done" : false
        });
        return ;
    }

    const i = database.length-1;
    database[i]["next_state"] = state;
    const [player_bef, ai_bef] = calculateScore(database[i]["state"]);
    const [player_aft, ai_aft] = calculateScore(state);

    database[i]["reward"] = ai_aft - player_aft - ai_bef + player_bef
    
    database.push({
        "state" : state,
        "action" : action,
        "reward" : null,
        "next_state" : zeros,
        "done" : false
    });
}

export function finishRecord(winner, turn)
{
    if (winner == true) {
        const i = database.length-1;
        const [player, ai] = calculateScore(database[i]["state"]);
        database[i]["reward"] = -(player - ai + 300);
        database[i]["done"] = true;
    }
    else {
        const i = database.length-1;
        const [player, ai] = calculateScore(database[i]["state"]);
        database[i]["reward"] = (ai - player + 300);
        database[i]["done"] = true;
    }
    for(let i=0;i<database.length;i++){
        database[i]["state"] = convert(database[i]["state"]);
        database[i]["next_state"] = convert(database[i]["next_state"]);
    }
    return database;
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