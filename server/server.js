var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Player = require("./Player").Player;

var gauge = 0;
var timer = 100;

app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res){
  res.sendfile('index.html');
});

init();
io.on('connection', onSocketConnection);
setInterval(update,1000);

var players = [];
var hasSpy = false;

function init() {
    players = [];
}

function update(){
    var initGauge = gauge;
    for (i = 0; i < players.length; i++) {
       if(players[i].dancing){
            if(players[i].isSpy){
                gauge -= 100;
                gauge = Math.max(gauge,0);
            }else{
                gauge += 10;
            }
       }
    };
    timer = timer - 1;
    io.emit("scoreUpdate",{"gauge":gauge,"time":timer});
}

function onSocketConnection(client) {
      client.on("disconnect",onClientDisconnection);
      client.on("start",onStartEmitted);
      client.on("move",onMoveEmitted);
      client.on("dance",onDanceEmitted);
      client.on("stand",onStandEmitted);
      client.on("marked",onMarkedEmitted);
      client.on("error",onErrorEmitted);
   
}

function onErrorEmitted(error){
    console.log(error);
}

function playerById(id){
     var i;
    for (i = 0; i < players.length; i++) {
        if(players[i].id === id)
            return players[i];
    };

    return false;
}

function onMarkedEmitted(playerMarked) {
    console.log("Marking "+playerMarked)
    var markedPlayer = playerById(playerMarked);
    var markingPlayer = playerById(this.id);
    if(!markedPlayer || !markingPlayer){
        return;
    }
    var previousMarkedPlayer = playerById(markingPlayer.markedPlayer);
    console.log("Unmarking "+markingPlayer.markedPlayer)
    if(previousMarkedPlayer){
        var idx = previousMarkedPlayer.marks.indexOf(this.id);
        previousMarkedPlayer.marks.splice(idx,1);
        console.log("Refreshing")
        io.emit("refreshPlayer",previousMarkedPlayer);
    }
    if(!markedPlayer.marks){
        markedPlayer.marks = [];
    }
    console.log("Setting Marks")
    markedPlayer.marks.push(this.id);
    console.log("Setting marked")
    markingPlayer.markedPlayer = playerMarked;
    console.log("Refreshing");
    console.log(markedPlayer);
    io.emit("refreshPlayer",markedPlayer);
}

function onStandEmitted(value) {
    var player = playerById(this.id);
    player.stand = value;
    if(value == true)
        player.animation = "stand";
    io.emit("refreshPlayer", player);
}

function onDanceEmitted(value) {
    var player = playerById(this.id);
    if(value){
        player.dancing = true;
        player.stand = false;
        player.animation = "dance1";
    }else{
        player.dancing = false;
        player.stand = true;
        player.animation = "stand";
    }

    io.emit("refreshPlayer", player);
}

function onMoveEmitted(direction) {
    var player = playerById(this.id);
    player.direction = direction;
    var offset = 10;
   switch (direction)
        {
            case "up":
                player.animation = "walk";
                player.y = player.y - offset;
                break;
            case "down":
                player.animation = "walk";
                player.y = player.y + offset;
                break;
            case "left":
                player.animation = "walk";
                player.x = player.x - offset;
                break;
            case "right":
                player.animation = "walk";
                player.x = player.x + offset;
                break;
        }
    io.emit("refreshPlayer", player);
}


function onStartEmitted(client) {
    var idx = Math.floor((Math.random() * 6) + 1); 
    var newPlayer = new Player(this.id, "Player 1", idx);
    if(!hasSpy && Math.random() < 0.3){
        newPlayer.isSpy = true;
        this.emit("spy");
        hasSpy = true;
    }
    if(!players)
        players = [];
     var i;
    for (i = 0; i < players.length; i++) {
        console.log(players[i]);
        this.emit("playerCreated",players[i]);
    };
    players.push(newPlayer);
    io.emit("playerCreated",newPlayer);
    this.emit("scoreUpdate",{"gauge":gauge,"time":timer});
}

function onClientDisconnection(client) {
    var i;
    var idToRemove = this.id;
    for (i = 0; i < players.length; i++) {
        if(players[i].id === this.id)
            break;
    };
    if(players[i] && players[i].isSpy)
        hasSpy = false;
    players.splice(i,1);
    io.emit("removePlayer",idToRemove);
    return false;
}


http.listen(3000, function(){
  console.log('listening on *:3000');
});