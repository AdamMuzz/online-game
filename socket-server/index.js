const express = require('express');
const {Server} = require('socket.io');
const cors = require('cors');

const PORT = process.env.PORT || 9000;
const app = express();
app.use(cors());
const http = require('http');
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		methods: ['GET', 'POST']
	}
});

app.get('/', (req,res) => {
	res.send('<h2>Hello World!</h2>')
});

class Player {
	constructor(id) {
		this.id = id;
		this.x = 0;
		this.y = 0;
	}
}
const players = new Map();

io.on('connection', (socket) => {
	//handle when player joins
	socket.on('joined', (id) => {
		//send all already connected users to player
		let connected = [];
		for (const i of players.values()) {
			connected.push(i);
		}
		socket.emit('welcome', connected);

		//let all other players know new player joined
		socket.broadcast.emit('joined', id);

		//add new player to connected players
		players.set(id, new Player(id));

		console.log(`${id} connected`);
	});

	//handle when player moves
	socket.on('moved', (obj) => {
		console.log(`${obj.id} moved!`);
	});

	//handle when player disconnects
	socket.on('leave', (id) => {
		players.delete(id);
		console.log(`${id} has left the game`);
	});
});

server.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});