//Main Landing Page
import {useState} from 'react';
import './Main.css';

function Main(props) {
  const [input, set_input] = useState('');

  let handle_change = e => {
    set_input(e.target.value)
  }
  let handle_submit = () => {
	  props.play(input);
  }

  return (
    <div className="App">
        <div id="Title_Wrapper">
          <h1 className="text">Block.IO</h1>
        </div>

        <div id="Name_Input_Wrapper">
          <p className="text">Name:</p>
          <input type='text' value={input} onChange={handle_change} />
          <button onClick={handle_submit}>Play</button>
        </div>

        <div id="Rules_Wrapper" className="text">
          <h3 className="rule_decor">How To Play:</h3>
          <div className="rule">
            <p>1. WASD to move aroud</p>
            <p>2. Mouse to aim</p>
            <p>3. Spacebar to shoot</p>
          </div>
          <p className="rule_decor">Have fun!</p>
        </div>
    </div>
  );
}

export default Main;