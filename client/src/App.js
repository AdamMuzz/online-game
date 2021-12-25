import {useState} from 'react';
import Main from './Main';
import Game_Screen from './Game-Screen';

function App() {
  const [is_playing, set_playing] = useState(false);
  const [name, set_name] = useState('');

  const play = (name) => {
    set_name(name);
    set_playing(true);
  }

  if (is_playing) {
    return (
      <Game_Screen name={name} />
    );
  }
  return (
    <Main play={play} />
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