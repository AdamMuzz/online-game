import {useState} from 'react';

import './App.css';

function App() {
  const [input, set_input] = useState('');
  const [name, set_name] = useState('');

  let handle_change = e => {
    set_input(e.target.value)
  }
  let handle_submit = () => {
    set_name(input);
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

        {/*<p className="text">{`Ur name: ${name}`}</p>*/}

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

export default App;

//api usage below
/*
  const [api_response, set_api_response] = useState("0");
  const call_API = () => {
    fetch("http://192.168.1.98:9000/test-API")
      .then(res => res.text())
      .then(res => set_api_response(res));
  }

  <p>btn clicked: {api_response} times</p>
  <button onClick={call_API}>Click</button>
 */