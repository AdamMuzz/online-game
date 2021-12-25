//Game Screen
import { useState, useEffect, useRef } from 'react';
import './Game-Screen.css';


function Game_Screen(props) {
	const [key, set_key] = useState(null);
	const canvasRef = useRef(null);
	let frameCount = 0;

	const draw = (ctx, frameCount) => {
  	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  	ctx.fillStyle = '#000000';
  	ctx.beginPath();
  	ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI);
  	ctx.fill();
  }

	useEffect(() => {
		const canvas = canvasRef.current;
  	const context = canvas.getContext('2d');
		let animationFrameId;

  	const render = () => {
    	frameCount++
    	draw(context, frameCount)
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