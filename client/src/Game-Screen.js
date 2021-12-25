//Game Screen
import { useEffect, useRef } from 'react';
import './Game-Screen.css';


function Game_Screen(props) {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current
  	const context = canvas.getContext('2d')
  	context.fillStyle = '#000000'
  	context.fillRect(0, 0, context.canvas.width, context.canvas.height)
  }, []);

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