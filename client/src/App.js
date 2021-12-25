import Main from './Main';

function App() {
  return (
    <Main/>
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