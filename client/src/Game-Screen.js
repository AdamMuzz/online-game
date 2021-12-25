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
	render(ctx) {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.rect(this.x, this.y, 10, 10);
		ctx.fill();
	}
}

function Game_Screen(props) {
	const [sprites, set_sprites] = useState([]);
	const [keys, set_keys] = useState([false,false,false,false]);
	const canvasRef = useRef(null);
	let frameCount = 0;
	let me = new Player(props.name, '#0f0');

	const draw = (ctx) => {
		//clear screen and draw background
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.beginPath();
		ctx.fillStyle = '#fff';
		ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
		ctx.fill();
		//draw player
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