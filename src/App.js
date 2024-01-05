import Main from "./Main";
import {Route,Routes} from "react-router-dom"
import Success from "./Success";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route  exact path="/" element={<Main/>}></Route>
        <Route path="/dashboard" element={<Success/>}></Route>

      </Routes>

    </div>
  );
}

export default App;
