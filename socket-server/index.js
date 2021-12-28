const express = require('express');
const cors = require('cors');

const PORT = 9000;
const app = express();
app.use(cors());
const http = require('http');
const server = http.createServer(app);

app.get('/', (req,res) => {
	res.send('<h2>Hello World!</h2>')
});

server.listen(PORT, ()=>{
	console.log(`listening on port ${PORT}`);
});