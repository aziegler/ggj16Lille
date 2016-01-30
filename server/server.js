var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Player = require("./Player").Player;

var GAUGE_INIT = 200;
var TIMER_INIT = 300;

var gauge;
var timer;

app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {
    res.sendfile('index.html');
});

var GameState = {};
Object.defineProperty(GameState, 'LOBBY', {value: 1, writable: false});
Object.defineProperty(GameState, 'RITUAL', {value: 2, writable: false});

init();
io.on('connection', onSocketConnection);
setInterval(update, 1000);

var state = GameState.LOBBY;
var players = [];
var waitingPlayers = [];
var hasSpy = false;

function init() {
}

function update() {
    if (state !== GameState.RITUAL)
        return;

    for (var i = 0; i < players.length; i++) {
        if (players[i].dancing) {
            if (players[i].isSpy) {
                gauge -= 30;
                gauge = Math.max(gauge, 0);
            } else {
                gauge += 8;
            }
        }
    }
    timer = timer - 1;
    var end = checkGameEnded();
    //console.log("End ? " + end);
    if (end) {
        returnToLobby();
    }
    else {
        io.emit("scoreUpdate", {"gauge": gauge, "time": timer});
    }
}

function checkGameEnded() {
    if (timer <= 0) {
        io.emit("defeat");
        return true;
    }
    if (gauge > 400) {
        io.emit("victory");
        return true;
    }
    if (gauge == 0) {
        io.emit("defeat");
        return true;
    }
    return false;
}

function onSocketConnection(client) {
    console.log("connection from " + client.id);

    client.on("disconnect", onClientDisconnection);

    // Lobby messages
    client.on("lobby", onLobby);
    client.on("lobbyReady", onLobbyReady);

    // Game messages
    client.on("move", onMoveEmitted);
    client.on("dance", onDanceEmitted);
    client.on("stand", onStandEmitted);
    client.on("marked", onMarkedEmitted);
    client.on("error", onErrorEmitted);
}


function onErrorEmitted(error) {
    console.log(error);
}

function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++) {
        if (players[i].id === id)
            return players[i];
    }

    return false;
}

function onMarkedEmitted(playerMarked) {
    console.log("Marking " + playerMarked)
    var markedPlayer = playerById(playerMarked);
    var markingPlayer = playerById(this.id);
    if (!markedPlayer || !markingPlayer) {
        return;
    }
    var previousMarkedPlayer = playerById(markingPlayer.markedPlayer);
    console.log("Unmarking " + markingPlayer.markedPlayer)
    if (previousMarkedPlayer) {
        var idx = previousMarkedPlayer.marks.indexOf(this.id);
        previousMarkedPlayer.marks.splice(idx, 1);
        console.log("Refreshing")
        io.emit("refreshPlayer", previousMarkedPlayer);
    }
    if (!markedPlayer.marks) {
        markedPlayer.marks = [];
    }
    markedPlayer.addMark(this.id);
    markingPlayer.markedPlayer = playerMarked;
    console.log("Refreshing");
    console.log(markedPlayer);
    io.emit("refreshPlayer", markedPlayer);
}

function createPlayer(client) {
    // Compute parameters
    // haha
    var num = 1;
    while (true) {
        var newName = "PLAYER " + num;
        if (players.every(function (p) {
                return p.name !== newName
            }))
            break;

        num++;
    }


    // TODO select spy at game start instead
    

    // Create and store object
    var newPlayer = new Player(client.id, "PLAYER " + num,
        Math.floor((Math.random() * 6) + 1));
    players.push(newPlayer);

    // Emit player info
    client.emit("initLobby", players);
    client.broadcast.emit("lobbyAddPlayer", newPlayer);
}

function createWaitingPlayer(client) {
    waitingPlayers.push(client);
}

function onLobby() {
    console.log("lobby from " + this.id);

    if (state === GameState.LOBBY) {
        createPlayer(this);
    } else {
        createWaitingPlayer(this);
    }
}

function onLobbyReady() {
    // TODO return to lobby state on 0 player
    if (state !== GameState.LOBBY)
        return;

    state = GameState.RITUAL;

    gauge = GAUGE_INIT;
    timer = TIMER_INIT;

    console.log("lobby ready");

    var spyIdx = Math.floor((Math.random() * players.length));
    console.log("Spy : "+spyIdx+"/"+players.length);
    players[spyIdx].isSpy = true;
    io.to(players[spyIdx].id).emit("spy");

    players.forEach(function (p) {
        console.log("player " + p.id);
    });
    console.log("gameStart sent.")

    players.forEach(function(p){
        io.to(p.id).emit("gameStart");
    });

    io.emit("scoreUpdate", {"gauge": gauge, "time": timer});
}

function onStandEmitted(value) {
    var player = playerById(this.id);
    if (!player)
        return;

    if (player.isDead)
        return;
    player.stand = value;
    if (value == true)
        player.setAnim("stand");
    io.emit("refreshPlayer", player);
}

function onDanceEmitted(value) {
    var player = playerById(this.id);
    if (!player)
        return;

    if (player.isDead)
        return;
    if (value) {
        player.dancing = true;
        player.stand = false;
        player.setAnim("dance1");
    } else {
        player.dancing = false;
        player.stand = true;
        player.setAnim("stand");
    }

    io.emit("refreshPlayer", player);
}

function onMoveEmitted(direction) {
    var player = playerById(this.id);
    if (!player)
        return;

    if (player.isDead)
        return;
    player.direction = direction;
    player.dancing = false;            
    var offset = 7;
    switch (direction) {
        case "up":
            player.setAnim("walk");
            player.y = player.y - offset;
            break;
        case "down":
            player.setAnim("walk");
            player.y = player.y + offset;
            break;
        case "left":
            player.setAnim("walk");
            player.x = player.x - offset;
            break;
        case "right":
            player.setAnim("walk");
            player.x = player.x + offset;
            break;
    }
    player.y = Math.max(-10,Math.min(player.y,419));
    player.x = Math.max(-10,Math.min(player.x,584));
    io.emit("refreshPlayer", player);
}


function returnToLobby() {
    state = GameState.LOBBY;
    io.emit("returnToLobby");
    players = [];
    waitingPlayers = [];
}

function onClientDisconnection(client) {
    console.log("Client disconnection from " + this.id);
    var i;
    var idToRemove = this.id;
    for (i = 0; i < players.length; i++) {
        if (players[i].id === this.id)
            break;
    }
    if (players[i] && players[i].isSpy)
        hasSpy = false;
    players.splice(i, 1);
    io.emit("removePlayer", idToRemove);

    if (state == GameState.RITUAL &&
        Object.keys(players).length == 0) {
        console.log("No players left, returning to LOBBY");
        returnToLobby();
    }

    return false;
}


http.listen(3000, function () {
    console.log('listening on *:3000');
});
