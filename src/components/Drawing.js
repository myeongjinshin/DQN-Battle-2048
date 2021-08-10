const map_size = 5;
const padding = 15;
const square_round = 10;


CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.arcTo(x + width, y + height, x, y + height, radius);
    this.arcTo(x, y + height, x, y, radius);
    this.arcTo(x, y, x + width, y, radius);
    this.closePath();
    return this;
}

const playerColor = ["ffba08", "faa307", "f48c06", "e85d04", "dc2f02", "d00000", "9d0208", "6a040f", "370617", "03071e"];
const aiColor = ["fbc1fa", "f56ff3", "f34df0", "f12ced", "ea0fe6", "c90cc5", "a70aa4", "860883", "640662", "430441"];

function drawGrid(canvas){
    const ctx = canvas.getContext('2d');
    const square_size = ( canvas.width - padding * (map_size+1) ) / map_size;
  
    //drawing grid
    for( let i = 0; i < map_size; i++) {
      for( let j = 0; j < map_size; j++) {
        const x = padding * (j + 1) + square_size * j;
        const y = padding * (i + 1) + square_size * i;
  
        ctx.roundRect(x, y, square_size, square_size, square_round);
        ctx.fillStyle = 'rgba(100, 223, 223, 1)';
        ctx.fill();
      }
    }
}

export function drawState(canvas, state){
  
    const ctx = canvas.getContext('2d');
    ctx.textAlign = "center";
    ctx.font = '48px Arial';
    const square_size = ( canvas.width - padding * (map_size+1) ) / map_size;
  
    //drawing grid
    drawGrid(canvas);
  
    //drawing squares
    for( let i = 0; i < map_size; i++) {
        for( let j = 0; j < map_size; j++) {
  
            if(state[i*map_size + j] == 0) {
                continue;
            }
            const x = padding * (j + 1) + square_size * j;
            const y = padding * (i + 1) + square_size * i;
    
            ctx.roundRect(x, y, square_size, square_size, square_round);
    
            if(state[i*map_size + j] < 0) { //음수가 플레이어
                ctx.fillStyle = '#'+playerColor[-state[i*map_size + j]];
                ctx.fill();
                ctx.fillStyle = "rgb(255,255,255)";
                ctx.fillText(-state[i*map_size + j],x+square_size/2,y+square_size/2+17);
            }
            else {
                ctx.fillStyle = '#'+aiColor[state[i*map_size + j]];
                ctx.fill();
                ctx.fillStyle = "rgb(255,255,255)";
                ctx.fillText(state[i*map_size + j],x+square_size/2,y+square_size/2+17);
            }
        }
    }
}
  
export function animationPath(canvas, state, paths, next_state) {
    const ctx = canvas.getContext('2d');
    ctx.textAlign = "center";
    ctx.font = '48px Arial';
    const square_size = ( canvas.width - padding * (map_size+1) ) / map_size;

    let frame = 30;
    let cur = 30;

    const animate = setInterval(() => {
        for (let i = 0;i<paths.length;i++){
            //row col row col
            const col = ( paths[i][1] * cur + paths[i][3] * (frame-cur) ) / frame;
            const row = ( paths[i][0] * cur + paths[i][2] * (frame-cur) ) / frame;
            const x = padding * (col + 1) + square_size * col;
            const y = padding * (row + 1) + square_size * row;
            ctx.roundRect(x, y, square_size, square_size, square_round);
            ctx.fillStyle = "#00b4d8";
            ctx.fill();
        }
        drawGrid(canvas);
        cur--;
        for (let i = 0;i<paths.length;i++){
            //row col row col
            const val = state[paths[i][0] * map_size + paths[i][1]];

            const col = ( paths[i][1] * cur + paths[i][3] * (frame-cur) ) / frame;
            const row = ( paths[i][0] * cur + paths[i][2] * (frame-cur) ) / frame;
            const x = padding * (col + 1) + square_size * col;
            const y = padding * (row + 1) + square_size * row;

            ctx.roundRect(x, y, square_size, square_size, square_round);

            if(val < 0) { //음수가 플레이어
                ctx.fillStyle = '#'+playerColor[-val];
                ctx.fill();
                ctx.fillStyle = "rgb(255,255,255)";
                ctx.fillText(-val,x+square_size/2,y+square_size/2+17);
            }
            else {
                ctx.fillStyle = '#'+aiColor[val];
                ctx.fill();
                ctx.fillStyle = "rgb(255,255,255)";
                ctx.fillText(val,x+square_size/2,y+square_size/2+17);
            }
        }
        if(cur == 0) {
            clearInterval(animate);
            drawState(canvas, next_state);
        }
    }, 7);
}