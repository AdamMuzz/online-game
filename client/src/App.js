import {useState, useEffect} from 'react';

import logo from './logo.svg';
import './App.css';

function App() {
  const [api_response, set_api_response] = useState("");

  const call_API = () => {
    fetch("http://localhost:9000/test-API")
      .then(res => res.text())
      .then(res => set_api_response(res));
  }

  useEffect(() => {
    call_API();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{api_response}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
