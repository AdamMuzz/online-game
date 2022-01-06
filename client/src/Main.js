//Main Landing Page
import {useState} from 'react';
import './Main.css';

function Main(props) {
  const [name, set_name] = useState('');
  const [lobby, set_lobby] = useState('Main');

  let handle_change = e => {set_name(e.target.value);}
  let handle_change2 = e => {set_lobby(e.target.value);}
  let handle_submit = () => {props.play(name, lobby);}

  return (
    <div className="App">
        <div id="Title_Wrapper">
          <h1 className="text">Block.IO</h1>
        </div>

        <div id="Name_Input_Wrapper">
          <p className="text">Name:</p>
          <input type='text' value={name} onChange={handle_change} />
          <p className='text'>Lobby:</p>
          <input type='text' value={lobby} onChange={handle_change2} />
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