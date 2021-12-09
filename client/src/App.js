import {useState} from 'react';

import './App.css';

function App() {
  /*const [api_response, set_api_response] = useState("0");
  const call_API = () => {
    fetch("http://192.168.1.98:9000/test-API")
      .then(res => res.text())
      .then(res => set_api_response(res));
  }*/

  return (
    <div className="App">
        {/*<p>btn clicked: {api_response} times</p>
        <button onClick={call_API}>Click</button>*/}

        <div id="Title_Wrapper">
          <h1>Block.IO</h1>
        </div>

        <div id="Name_Input_Wrapper">
          <p>Name: </p>
          <p>Play</p>
        </div>

        <div id="Rules_Wrapper">
          <p>Rule #1</p>
          <p>Rule #2</p>
          <p>Rule #3</p>
        </div>
    </div>
  );
}

export default App;
