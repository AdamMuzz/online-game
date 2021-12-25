//Game Screen
import { useState, useEffect, useRef } from 'react';
import './Game-Screen.css';

class Player {
	constructor(id, color) {
		this.id = id;
		this.color = color;
		this.x = 0;
		this.y = 0;
	}
	move(dirs) {
		if (dirs[0]) {this.y--;}
		if (dirs[1]) {this.x--;}
		if (dirs[2]) {this.y++;}
		if (dirs[3]) {this.x++;}
	}
	render(ctx) {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.rect(this.x, this.y, 10, 10);
		ctx.fill();
	}
}

function Game_Screen(props) {
	const [sprites, set_sprites] = useState([]);
	const canvasRef = useRef(null);
	let dirs = [false,false,false,false];
	let frameCount = 0;
	let me = new Player(props.name, '#0f0');

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
	useEffect(() => {
		document.addEventListener("keydown", handle_key_down);
		document.addEventListener("keyup", handle_key_up);
		return () => {
			document.removeEventListener("keydown", handle_key_down);
			document.removeEventListener("keyup", handle_key_up);
		};
	}, []);

	const draw = (ctx) => {
		//clear screen and draw background
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.beginPath();
		ctx.fillStyle = '#fff';
		ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fill();
		//draw player
		me.move(dirs);
		me.render(ctx);
		//draw all other sprites
		for (let i in sprites) {
			sprites[i].render(ctx);
		}
	}

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