var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Player = require("./Player").Player;

var gauge = 0;
var timer = 100;

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
var hasSpy = false;

function init() {
}

function update() {
    for (var i = 0; i < players.length; i++) {
        if (players[i].dancing) {
            if (players[i].isSpy) {
                gauge -= 100;
                gauge = Math.max(gauge, 0);
            } else {
                gauge += 10;
            }
        }
    }
    timer = timer - 1;
    io.emit("scoreUpdate", {"gauge": gauge, "time": timer});
}

function onSocketConnection(client) {
    console.log("connection from " + client.id);

    client.on("disconnect", onClientDisconnection);

    // Lobby messages
    client.on("lobby", function () {
        onLobby(client);
    });
    client.on("lobbyReady", onLobbyReady);

    // Game messages
    //client.on("start", onStartEmitted);
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
    var spy = !hasSpy && Math.random() < 3;

    console.log("Create player #" + num + " [spy: " + spy + "]");

    // Create and store object
    var newPlayer = new Player(client.id, "PLAYER " + num,
        Math.floor((Math.random() * 6) + 1));
    newPlayer.isSpy = spy;
    hasSpy |= spy;
    players.push(newPlayer);

    // Emit player info
    client.emit("initLobby", players);
    client.broadcast.emit("lobbyAddPlayer", newPlayer);
}

function onLobby(client) {
    if (state != GameState.LOBBY)
        return;

    console.log("lobby from " + client.id);
    createPlayer(client);
}

function onLobbyReady() {
    // TODO return to lobby state on 0 player
    if (state !== GameState.LOBBY)
        return;

    state = GameState.RITUAL;

    console.log("lobby ready");
    players.forEach(function(p){
       console.log("player " + p.id);
    });
    console.log("gameStart sent.")
    io.emit("gameStart");

}

function onStandEmitted(value) {
    var player = playerById(this.id);
    if(player.isDead)
        return;
    player.stand = value;
    if (value == true)
        player.setAnim("stand");
    io.emit("refreshPlayer", player);
}

function onDanceEmitted(value) {
    var player = playerById(this.id);
    if(player.isDead)
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
    if(player.isDead)
        return;
    player.direction = direction;
    var offset = 10;
   switch (direction)
        {
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
    io.emit("refreshPlayer", player);
}


//function onStartEmitted(client) {
//    var idx = Math.floor((Math.random() * 6) + 1);
//    var newPlayer = new Player(this.id, "Player 1", idx);
//    if (!hasSpy && Math.random() < 0.3) {
//        newPlayer.isSpy = true;
//        this.emit("spy");
//        hasSpy = true;
//    }
//    if (!players)
//        players = [];
//    var i;
//    for (i = 0; i < players.length; i++) {
//        console.log(players[i]);
//        this.emit("playerCreated", players[i]);
//    }
//    players.push(newPlayer);
//    io.emit("playerCreated", newPlayer);
//    this.emit("scoreUpdate", {"gauge": gauge, "time": timer});
//}

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
        state = GameState.LOBBY;
    }

    return false;
}


http.listen(3000, function () {
    console.log('listening on *:3000');
});
