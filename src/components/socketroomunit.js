import React, { useState } from 'react';
import socketIOClient from "socket.io-client";
import './css/socketroomunit.css';
const ENDPOINT = "http://localhost:3001";

export default function Socketroomunit() {

    const [response, setResponse] = useState("");

    const [inputMessage, setInputMessage] = useState("");
    const [nickname, setNickname] = useState("");

    const [socket, setSocket] = useState();
    
    const [allUserMessage, setAllUserMessage] = useState([]);
    // const [filterNumber, setFilterNumber] = useState();
    // const [filterContent, setFilterContent] = useState();
    // const socket = socketIOClient(ENDPOINT);
   
   function handleMonitorAsJson(userMessage){
        console.log("bc json called.");
        var detailedMessage = `${userMessage.nickname} says ${userMessage.msg} in ${userMessage.clientRoom}`;
        console.log(detailedMessage);

        var node = document.createElement("LI");            
        var textnode = document.createTextNode(detailedMessage);         
        node.appendChild(textnode);
        document.getElementById('messagesJson').appendChild(node);
        
        //manage all user messages in one array.
        //TODO: filter by client room.
        var tmpUserMessage = allUserMessage;
        tmpUserMessage.push(userMessage);
        setAllUserMessage(tmpUserMessage);
        console.log(allUserMessage);
   };   

  function json2table(list) {
    var cols = [];

    for (var i = 0; i < list.length; i++) {
      for (var k in list[i]) {
        if (cols.indexOf(k) === -1) {

          // Push all keys to the array 
          cols.push(k);
        }
      }
    }

    // Create a table element 
    var table = document.createElement("table");

    var thead = table.createTHead();

    // Create table row tr element of a table 
    var tr = thead.insertRow(-1);

    for (i = 0; i < cols.length; i++) {

      // Create the table header th element 
      var theader = document.createElement("th");
      theader.innerHTML = cols[i];

      // Append columnName to the table row 
      tr.appendChild(theader);
    }

    var tbody = table.createTBody();

    // Adding the data to the table 
    for (i = 0; i < list.length; i++) {

      // Create a new row 
      var trow = tbody.insertRow(-1);
      for (var j = 0; j < cols.length; j++) {
        var cell = trow.insertCell(-1);

        // Inserting the cell at particular place 
        cell.innerHTML = list[i][cols[j]];
      }
    }

    // Add the newely created table containing json data 
    var el = document.getElementById("table");
    el.innerHTML = "";
    el.appendChild(table);
  }
  
    function addMessage() {
      // const socket = socketIOClient(ENDPOINT);
      if (socket !== undefined){
        console.log(inputMessage)
        socket.emit('chat message c2s', inputMessage);
        setResponse(inputMessage);     
      }else{
        var r = window.confirm("You should set your nickname before you post.\n Click ok to post anonymously.");
        if (r === true){
          const socket = socketIOClient(ENDPOINT);
          console.log(inputMessage)
          socket.emit('chat message c2s anonymous', inputMessage);
          setSocket(socket);
        }else{
          alert("if you don't want to post anonymously, you need to set your nickname!");
        }
      }
    //   handleMonitor();
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
      // monitor all messages
      socket.on('bc json', (userMessage) => {
        handleMonitorAsJson(userMessage);
      }); 
    //   handleMonitor();
    // handleMonitorAsJson();
    };

    return (
        <div>
            It's <p>{response}</p>
            <div>
                {/* <ul id="messages"></ul> */}
                <div>
                <input id="m1" autoComplete="off" placeholder="nickname" onChange={event => setNickname(event.target.value)}/>
                <button onClick={socketSetNickname}>submit</button>
                <input id="m2" autoComplete="off" placeholder="message" onChange={(event) => setInputMessage(event.target.value) }/>
                <button onClick={addMessage}>submit</button>
                </div>
                <div>
                <p id="messagesJson"></p>
                </div>
                {/* <div>
                    <input id="filterNum" placeholder="filter number" onChange={event => setFilterNumber(event.target.value)}></input>
                    <input id="filterCon" placeholder="filter content" onChange={event => setFilterContent(event.target.value)}></input>
                </div> */}
                <button onClick={() => json2table(allUserMessage)}>
                  click here
                </button>

                <table id="table" className="styled-table" align="center" border="1px"></table>
                <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
            </div>
        </div>
    )
};

// export default socketroomunit;