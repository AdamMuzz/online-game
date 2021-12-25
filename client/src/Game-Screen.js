//Game Screen
import './Game-Screen.css';


function Game_Screen(props) {
	return (
		<div className='App'>
			<p className='text'>{`Playing as ${props.name}!`}</p>
		</div>
	);
}

export default Game_Screen;