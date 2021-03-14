import React, { useState } from 'react';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:3001";

export default function Socketroomanotherunit() {

    const [inputMessage, setInputMessage] = useState("");
    const [nickname, setNickname] = useState("");

    const [socket, setSocket] = useState();
    const [monitorSocket, setMonitorSocket] = useState();
    
    const [allUserMessage, setAllUserMessage] = useState([]);
  

  
  
   function handleMonitorAsJson(){
    if (monitorSocket === undefined){
        //create another socket for monitoring new messages
        //and waiting for new messages sent from the server
        const monitorSocket = socketIOClient(ENDPOINT);
        monitorSocket.on('bc json', function(userMessage){
        console.log("bc json called.");
        var detailedMessage = `${userMessage.nickname} says ${userMessage.msg} in ${userMessage.clientRoom}`;
        console.log(detailedMessage);

        //create li html element and append it to messages html
        var node = document.createElement("LI");            
        var textnode = document.createTextNode(detailedMessage);         
        node.appendChild(textnode);
        document.getElementById('messagesJsonAnother').appendChild(node);
        
        //manage all user messages in one json array.
        //updating all messages State
        //TODO: filter by client room.
        var tmpUserMessage = allUserMessage;
        tmpUserMessage.push(userMessage);
        setAllUserMessage(tmpUserMessage);
        console.log(allUserMessage);
        });
        //manage socket for monitoring as State
        setMonitorSocket(monitorSocket);
    }
   }   

  
    function addMessage() {
        //if socket is defined, emit an event with the new message
        if (socket !== undefined){
        console.log(inputMessage)
        socket.emit('chat message c2s', inputMessage);      
        }

        handleMonitorAsJson();
    };
  
    function socketSetNickname(){
        //create a new socket
        //set a nickname for a user
        //set the socket (managed as State)
        const socket = socketIOClient(ENDPOINT);
        if (socket !== undefined){
        socket.emit('set_nickname', nickname);
        }else{
        setTimeout(function(){socket.emit('set_nickname', nickname);},5000);
        }
        setSocket(socket);

        //client receives json object through socket
        //then append the new message to messages in html
        //also, append the new message to all messages State
        handleMonitorAsJson();
    };

    return (
        <div>
            <div>
                <input id="ma1" autoComplete="off" placeholder="nickname" onChange={event => setNickname(event.target.value)}/>
                <button onClick={socketSetNickname}>submit</button>
                <input id="ma2" autoComplete="off" placeholder="message" onChange={(event) => setInputMessage(event.target.value) }/>
                <button onClick={addMessage}>submit</button>
                <div>
                <ul id="messagesJsonAnother"></ul>
                </div>
                <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
            </div>
        </div>
    )
};
