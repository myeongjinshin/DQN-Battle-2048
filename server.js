const express = require('express');
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const path = require('path');
const cors = require('cors');
var fs = require('fs');

app.use(cors())
app.use(express.static('build'));
app.use(express.static('model/model'));

let replayMemory = require('./model/dataset/replay.json');
console.log("database size : ", replayMemory.length);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("database", (msg) => {
    console.log("single game end");
    replayMemory = replayMemory.concat(msg);

    fs.writeFile ("./model/dataset/replay.json", JSON.stringify(replayMemory), function(err) {
      if (err) throw err;
        console.log('save complete. data size = ', replayMemory.length);
      }
    );

  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/build/index.html'));
});


http.listen(8000, function () {
  console.log('listening on 8000')
});