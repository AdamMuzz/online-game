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

io.on('connection', (socket) => {
	//handle when player joins
	socket.on('joined', (id) => {
		socket.emit('hello'); //send all already connected users...
		socket.broadcast.emit('joined', id);

		console.log(`user connected w/ name ${id}`);
	});

	//handle when player moves
	socket.on('moved', (obj) => {
		console.log(`${obj.id} moved!`);
	});

	//handle when player disconnects
	socket.on('disconnect', () => {
		console.log('a user disconnected!');
	});
});

server.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});