//Game Screen
import { useState, useEffect, useRef } from 'react';
import {io} from 'socket.io-client';
import './Game-Screen.css';

const ENDPOINT = 'http://10.0.0.30:9000';

class Player {
	constructor(id) {
		this.id = id;
		this.x = 0;
		this.y = 0;
	}
	get_pos() {
		return [this.x, this.y];
	}
	set_pos(x,y) {
		this.x = x;
		this.y = y;
	}
	render = (ctx) => {
		//draw body
		ctx.beginPath();
		ctx.fillStyle = '#f00';
		ctx.rect(this.x, this.y, 40, 40);
		ctx.fill();
		//draw nametag
		ctx.fillStyle = '#000';
		ctx.font = '15px serif';
		ctx.textAlign = 'center';
		ctx.fillText(this.id, this.x+20, this.y-5, 75);
	}
}

function Game_Screen(props) {
	const [socket, set_socket] = useState(null);
	const [sprites, set_sprites] = useState([new Player(props.name)]);
	const me = sprites[0];
	let dirs = [false,false,false,false];
	const canvasRef = useRef(null);
	let frameCount = 0;

	const handle_key_down = (e) => {
		switch(e.key) {
			case 'w':
				if (!dirs[0]) {dirs[0] = true;}
				break;
			case 'a':
				if (!dirs[1]) {dirs[1] = true;}
				break;
			case 's':
				if (!dirs[2]) {dirs[2] = true;}
				break;
			case 'd':
				if (!dirs[3]) {dirs[3] = true;}
				break;
			default:
				return;
		}
	}
	const handle_key_up = (e) => {
		switch(e.key) {
			case 'w':
				dirs[0] = false;
				break;
			case 'a':
				dirs[1] = false;
				break;
			case 's':
				dirs[2] = false;
				break;
			case 'd':
				dirs[3] = false;
				break;
			default:
				return;
		}
	}

	//called on initial mount of game screen
	useEffect(() => {
		//fix canvas resolution
		const canvas = canvasRef.current;
		fix_res(canvas);

		//create connection to backend
		const s = io(ENDPOINT);
		set_socket(s);

		//event listeners to grab when user taps a key
		document.addEventListener("keydown", handle_key_down);
		document.addEventListener("keyup", handle_key_up);

		//cleanup
		return () => {
			document.removeEventListener("keydown", handle_key_down);
			document.removeEventListener("keyup", handle_key_up);
			socket.disconnect();
		};
	}, []);

	//draws all objects
	const draw = (ctx) => {
		//clear screen and draw background
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.beginPath();
		ctx.fillStyle = '#fff';
		ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fill();
		//handle user movement
		move(me, dirs);
		//draw all sprites
		for (let i in sprites) {
			sprites[i].render(ctx);
		}
	}

	//called every frame
	useEffect(() => {
		const canvas = canvasRef.current;
  	const context = canvas.getContext('2d');
		let animationFrameId;

  	const render = () => {
    	frameCount++
    	draw(context)
    	animationFrameId = window.requestAnimationFrame(render)
    }
    render()
    
    return () => {
    	window.cancelAnimationFrame(animationFrameId)
    }
  }, [frameCount]);

	return (
		<div className='App'>
			<div id='header'>
				<p className='text'>{`Playing as ${props.name}!`}</p>
			</div>

			<canvas id='screen' ref={canvasRef}/>
		</div>
	);
}

export default Game_Screen;

const fix_res = (canvas) => {
	let dpr = window.devicePixelRatio || 1;
	let rect = canvas.getBoundingClientRect();
	canvas.width = rect.width * dpr;
	canvas.height = rect.height * dpr;
	let ctx = canvas.getContext('2d');
	ctx.scale(dpr, dpr);
}

const move = (player, dirs) => {
	let [x,y] = player.get_pos();
	if (dirs[0]) {y-=2;}
	if (dirs[1]) {x-=2;}
	if (dirs[2]) {y+=2;}
	if (dirs[3]) {x+=2;}
	player.set_pos(x,y);
}