import React from "react";
// import socketIOClient from "socket.io-client";
import Socketroomunit from "./components/socketroomunit";
import Socketroomanotherunit from "./components/socketroomanotherunit";
// const ENDPOINT = "http://127.0.0.1:3001";

function App() {

  return (
    <div>
      <Socketroomunit />
      <hr/>
      <Socketroomanotherunit />
    </div>
  );
}

export default App;