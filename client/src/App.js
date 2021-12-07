import {useState, useEffect} from 'react';

import logo from './logo.svg';
import './App.css';

function App() {
  const [api_response, set_api_response] = useState("0");

  const call_API = () => {
    fetch("http://localhost:9000/test-API")
      .then(res => res.text())
      .then(res => set_api_response(res));
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <p>btn clicked: {api_response} times</p>

        <button onClick={call_API}>Click</button>
      </header>
    </div>
  );
}

export default App;
