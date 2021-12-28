const express = require('express');
const {Server} = require('socket.io');
const cors = require('cors');

const PORT = process.env.PORT || 9000;
const app = express();
app.use(cors());
const http = require('http');
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req,res) => {
	res.send('<h2>Hello World!</h2>')
});

io.on('connection', (socket) => {
	console.log('a user connected!');
});

server.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});