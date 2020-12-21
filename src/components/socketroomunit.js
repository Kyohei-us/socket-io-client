import React, { useState } from 'react';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:3001";

export default function Socketroomunit() {

    const [response, setResponse] = useState("");
    const [inputMessage, setInputMessage] = useState("");
    const [nickname, setNickname] = useState("");
    const [socket, setSocket] = useState();
    const [monitorSocket, setMonitorSocket] = useState();
    // const socket = socketIOClient(ENDPOINT);
  
    // useEffect(() => {
  
    //   });
    // }, []);
  
    // socket.on("chat message s2c", data => {
    //   setResponse(data);
    // });
  
   function handleMonitor(){
    if (monitorSocket === undefined){
      const monitorSocket = socketIOClient(ENDPOINT);
      monitorSocket.on('broadcast', function(msg){
        console.log(msg + " is in messages");
        var node = document.createElement("LI");            
        var textnode = document.createTextNode(msg);         
        node.appendChild(textnode);
        document.getElementById('messages').appendChild(node);
      });
      setMonitorSocket(monitorSocket);
    }
   }
  
  
    function addMessage() {
      // const socket = socketIOClient(ENDPOINT);
      if (socket !== undefined){
        console.log(inputMessage)
        socket.emit('chat message c2s', inputMessage);
        setResponse(inputMessage);      
      }else{
        var r = window.confirm("you need to set your nickname first to post.\n If you want to post anonymously, please click the post anonymously button.");
        if (r === true){
          const socket = socketIOClient(ENDPOINT);
          console.log(inputMessage)
          socket.emit('chat message c2s anonymous', inputMessage);
          setSocket(socket);
        }else{
          alert("if you don't want to post anonymously, you need to set your nickname!");
        }
      }
      handleMonitor();
      // socket.disconnect();
    };
  
    function socketSetNickname(){
      const socket = socketIOClient(ENDPOINT);
      if (socket !== undefined){
        socket.emit('set_nickname', nickname);
      }else{
        setTimeout(function(){socket.emit('set_nickname', nickname);},5000);
      }
      // socket.disconnect();
      setSocket(socket);
      handleMonitor();
    };
  
    // function appendMessage(){  
    //   socket.on('chat message', function(msg){
    //     var node = document.createElement("LI");            
    //     var textnode = document.createTextNode(msg);         
    //     node.appendChild(textnode);
    //     document.getElementById('messages').appendChild(node);
    //   });
    // }

    return (
        <div>
            It's <p>{response}</p>
            <div>
                {/* <ul id="messages"></ul> */}
                <input id="m1" autoComplete="off" placeholder="nickname" onChange={event => setNickname(event.target.value)}/>
                <button onClick={socketSetNickname}>submit</button>
                <input id="m2" autoComplete="off" placeholder="message" onChange={(event) => setInputMessage(event.target.value) }/>
                <button onClick={addMessage}>submit</button>
                <div>
                <ul id="messages"></ul>
                </div>
                <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
            </div>
        </div>
    )
};

// export default socketroomunit;