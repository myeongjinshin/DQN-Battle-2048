//action
// 0 = right
// 1 = left
// 2 = down
// 3 = up

//turn
//true = player's turn, false = Ai's turn

export function calcResult(l_state, action, turn)
{
    const map_size = Math.round(Math.sqrt(l_state.length));
    const state = new Array(map_size).fill(0).map(() => new Array(map_size).fill(0));
    const next_state = [];

    if(action === 0){
        //reshape 1D -> 2D
        for (let i=0; i<map_size; i++)
            for (let j=0; j<map_size; j++)
                state[i][j] = l_state[i*map_size + j];
        
        const [path, next_2d] = action_right(state, turn);

        //reshape 2D -> 1D
        for (let i=0; i<map_size; i++){
            for (let j=0; j<map_size; j++){
                next_state.push(next_2d[i][j]);
            }
        }
        return [path, next_state];
    }
    else if(action === 1){
        //reshape 1D -> 2D
        for (let i=0; i<map_size; i++)
            for (let j=0; j<map_size; j++)
                state[i][map_size-j-1] = l_state[i*map_size + j];
        
        const [_path, next_2d] = action_right(state, turn);

        //reshape 2D -> 1D
        for (let i=0; i<map_size; i++){
            for (let j=0; j<map_size; j++){
                next_state.push(next_2d[i][map_size-j-1]);
            }
        }
        const path = _path.map(x => [x[0], map_size - x[1] - 1, x[2], map_size - x[3] - 1]);
        return [path, next_state];
    }
    else if(action === 2){
        //reshape 1D -> 2D
        for (let i=0; i<map_size; i++)
            for (let j=0; j<map_size; j++)
                state[map_size-j-1][i] = l_state[i*map_size + j];
        
        const [_path, next_2d] = action_right(state, turn);

        //reshape 2D -> 1D
        for (let i=0; i<map_size; i++){
            for (let j=0; j<map_size; j++){
                next_state.push(next_2d[map_size-j-1][i]);
            }
        }
        const path = _path.map(x => [x[1], map_size-x[0]-1, x[3], map_size-x[2]-1]);
        return [path, next_state];
    }
    else if(action === 3){
        //reshape 1D -> 2D
        for (let i=0; i<map_size; i++)
            for (let j=0; j<map_size; j++)
                state[j][map_size-i-1] = l_state[i*map_size + j];
        
        const [_path, next_2d] = action_right(state, turn);

        //reshape 2D -> 1D
        for (let i=0; i<map_size; i++){
            for (let j=0; j<map_size; j++){
                next_state.push(next_2d[j][map_size-i-1]);
            }
        }
        const path = _path.map(x => [map_size-x[1]-1, x[0], map_size-x[3]-1, x[2]]);
        return [path, next_state];
    }
}

function action_right(state, turn){
    const map_size = state.length;
    const paths = [];
    const next_state = new Array(map_size).fill(0).map(() => new Array(map_size).fill(0));

    for (let row=0; row<map_size; row++){
        let holder = map_size;

        for (let col=map_size-1; col>=0; col--){
            if (state[row][col] === 0) continue;
            if (holder >= map_size) {
                holder--;
                next_state[row][holder] = state[row][col];
                paths.push([row, col, row, holder]);
                continue;
            }
            if (next_state[row][holder] === 0 ){ //move
                next_state[row][holder] = state[row][col];
                paths.push([row, col, row, holder]);
                holder--;
            }
            else if (next_state[row][holder] === state[row][col]){ //merge
                if(next_state[row][holder] > 0){
                    next_state[row][holder] ++;
                }
                else {
                    next_state[row][holder]--;
                }
                paths.push([row, col, row, holder]);
                holder--;
            }
            else if (next_state[row][holder] === -state[row][col]){ //conquer
                if(next_state[row][holder] > 0){
                    next_state[row][holder] ++;
                }
                else {
                    next_state[row][holder]--;
                }
                if(turn === true){
                    next_state[row][holder] = -Math.abs(next_state[row][holder])
                }
                else {
                    next_state[row][holder] = Math.abs(next_state[row][holder])
                }
                paths.push([row, col, row, holder]);
                holder--;
            }
            else {
                holder--;
                next_state[row][holder] = state[row][col];
                paths.push([row, col, row, holder]);
            }
        }
    }
    //create random block (1 or 2)
    const empty_pos = []
    for (let row=0; row<map_size; row++){
        for (let col=0; col<map_size; col++){
            if (next_state[row][col] === 0){
                empty_pos.push([row, col]);
            }
        }
    }
    if (empty_pos.length === 0) {
        return [paths, next_state];
    }

    const [row, col] = empty_pos[Math.floor(Math.random()*empty_pos.length)];
    const random_val = Math.floor(Math.random()*2) + 1;
    //자신의 턴 이후 자신의 블럭 생성
    if(turn === true){
        next_state[row][col] = -random_val;
    }
    else {
        next_state[row][col] = random_val;
    }
    return [paths, next_state];
}