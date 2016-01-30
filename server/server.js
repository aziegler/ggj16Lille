var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Player = require("./Player").Player;

var gauge = 0;
var timer = 100;

app.get('/', function(req, res){
  res.sendfile('index.html');
});

init();
io.on('connection', onSocketConnection);
setInterval(update,1000);

var players = [];

function init() {
    players = [];
}

function update(){
    var initGauge = gauge;
    for (i = 0; i < players.length; i++) {
       if(players[i].dancing){
            if(players[i].isSpy){
                gauge -= 100;
            }else{
                gauge += 10;
            }
       }
    };
    timer = timer - 1;
    io.emit("scoreUpdate",{"gauge":gauge,"time":timer});
}

function onSocketConnection(client) {
      console.log('a user connected');
      client.on("disconnect",onClientDisconnection);
      client.on("start",onStartEmitted);
      client.on("move",onMoveEmitted);
      client.on("dance",onDanceEmitted);
      client.on("stand",onStandEmitted);
}

function playerById(id){
     var i;
    for (i = 0; i < players.length; i++) {
        if(players[i].id === id)
            return players[i];
    };

    return false;
}

function onStandEmitted(value) {
    var player = playerById(this.id);
    if(value == true)
      io.emit("playerAnimation", {id:player.id, animation:"stand"});
}

function onDanceEmitted(value) {
    var player = playerById(this.id);
    if(value){
        player.dancing = true;
    }else{
        player.dancing = false;
    }

    if(player.dancing)
        io.emit("playerAnimation", {id:player.id, animation:"dance"});
}

function onMoveEmitted(direction) {
    var player = playerById(this.id);
   switch (direction)
        {
            case "up":
                player.y = player.y - 10;
                break;
            case "down":
                player.y = player.y + 10;
                break;
            case "left":
                player.x = player.x - 10;
                break;
            case "right":
                player.x = player.x + 10;
                break;
        }
    io.emit("playerPosition", {id:player.id, x:player.x, y:player.y});
    io.emit("playerDirection", {id:player.id, direction:direction});
    io.emit("playerAnimation", {id:player.id, animation:"walk"});
}


function onStartEmitted(client) {
    console.log("Start emitted");
    var newPlayer = new Player(this.id, "Player 1");
    if(Math.random() < 0.3){
        newPlayer.isSpy = true;
        this.emit("spy");
    }
    if(!players)
        players = [];
     var i;
    for (i = 0; i < players.length; i++) {
        this.emit("playerCreated",players[i]);
    };
    players.push(newPlayer);
    io.emit("playerCreated",newPlayer);
    this.emit("scoreUpdate",{"gauge":gauge,"time":timer});
}

function onClientDisconnection(client) {
    var i;
    for (i = 0; i < players.length; i++) {
        if(players[i].id === this.id)
            break;
    };
    players.splice(i,1);
    return false;
}


http.listen(3000, function(){
  console.log('listening on *:3000');
});