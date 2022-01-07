//import dependencies
const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');

//environment setup
const PORT = process.env.PORT || 9000;
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
	cors: {methods: ['GET', 'POST']}
});



//express handling of serv requests
app.get('/', (req,res) => {
	res.send('<h2>Hello World!</h2>')
});



//backend data structs
class Player {
	constructor(id, lobby) {
		this.id = id;
		this.x = 0;
		this.y = 0;
		this.lobby = lobby;
	}
}

const players = new Map();	//maps socket --> player
const lobbies = new Map();	//maps lobby name --> set of sockets in said lobby



//handle socket io communication
io.on('connection', (socket) => {
	//handle when player joins
	socket.on('joined', (id, lobby) => {
		//add user to lobby
		socket.join(lobby);
		//if lobby user is trying to join exists, send user all already connected players
		if (lobbies.has(lobby)) {
			const connected = [];
			for (const player_socket of lobbies.get(lobby)) {
				connected.push(players.get(player_socket));
			}
			socket.emit('welcome', connected);
		}
		//otherwise create the lobby
		else {
			lobbies.set(lobby, new Set());
		}

		//let all other players know new player joined
		socket.to(lobby).emit('joined', id);

		//add new player to connected players, and to lobby
		players.set(socket, new Player(id, lobby));
		lobbies.get(lobby).add(socket);

		console.log(`${id} connected to lobby ${lobby}`);
	});

	//handle when player moves
	socket.on('moved', (coords) => {
		//update player's pos
		const [x,y] = coords;
		const player = players.get(socket);
		player.x = x;
		player.y = y;
		//relay to all other users
		socket.to(player.lobby).emit('moved', player);
	});

	//handle when player fires
	socket.on('fired', (proj_data) => {
		socket.to(players.get(socket).lobby).emit('fired', proj_data);
	});

	//handle player dies
	socket.on('died', (killer_id) => {
		const player = players.get(socket);
		io.to(player.lobby).emit('died', [killer_id, player.id]);
	});

	//handle when player disconnects
	socket.on('disconnect', () => {
		const player = players.get(socket);
		players.delete(socket);
		lobbies.get(player.lobby).delete(socket);
		socket.to(player.lobby).emit('left', player.id);

		if (lobbies.get(player.lobby).size == 0) {lobbies.delete(player.lobby);}

		console.log(`${player.id} has left the game`);
	});
});



//make server listen on given port
server.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});