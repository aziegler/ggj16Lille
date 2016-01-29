var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Player = require("./Player").Player;

app.get('/', function(req, res){
  res.sendfile('index.html');
});

init();
io.on('connection', onSocketConnection);


var players = [];

function init() {
    players = [];
}

function onSocketConnection(client) {
      console.log('a user connected');
      client.on("disconnect",onClientDisconnection);
      client.on("start",onStartEmitted);
      client.on("move",onMoveEmitted);
}

function playerById(id){
     var i;
    for (i = 0; i < players.length; i++) {
        if(players[i].id === id)
            return players[i];
    };

    return false;
}

function onMoveEmitted(direction) {
    var player = playerById(this.id);
   switch (direction)
        {
            case "up":
                player.setY(player.getY() + 1);
                break;
            case "down":
                player.setY(player.getY() - 1);
                break;
            case "left":
                player.setX(player.getX() + 1);
                break;
            case "right":
                player.setX(player.getX() - 1); 
                break;
        }
    io.emit("playerPosition",player);    
}


function onStartEmitted(client) {
    console.log("Start emitted");
    var newPlayer = new Player(this.id, "Player 1");
    if(!players)
        players = [];
    players.push(newPlayer);
    io.emit("playerCreated",newPlayer);
}

function onClientDisconnection(client) {
      console.log('a user left');
}


http.listen(3000, function(){
  console.log('listening on *:3000');
});