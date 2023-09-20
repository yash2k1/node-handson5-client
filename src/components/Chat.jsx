import React, { useEffect, useRef, useState } from "react";
import img from "../Images/logo.png";
import "./chat.css";
import SendIcon from "@mui/icons-material/Send";
import { io } from "socket.io-client";
const Socket = io("https://node-handson5-server.onrender.com");
// const Socket = io("http://localhost:5454");
const Chat = () => {
  const [userName, setUserName] = useState("");
  const [text, setText] = useState("");
  const [send, setSend] = useState(false);
  const [messageArr,setMessageArr] = useState([]);
  const messToEnd=useRef(null);
  useEffect(() => {
    (function addName() {
      let user = prompt("enter your name");
      Socket.emit("joinRoom", {
        author: user,
        groupName: "Group A",
      });
      setUserName(user);
    })();
    console.log(userName);
    Socket.on("success", (data) => {
      console.log(data);
    });
    Socket.on("messFromServer", (data) => {
      console.log("messFromServer", data);
      messageArr.push(data);
   setMessageArr([...messageArr]);
   messToEnd.current?.scrollIntoView();
   console.log(messageArr)
      console.log(messageArr);
      setSend(!send);
    });
  }, []);

  const handleClick = () => {
    let tempMess = text;
    Socket.emit("toRoom", { author:userName, message:tempMess });
    //  messageArr.push(tempMess);
    setText("");
    setSend(!send);
  };
  return (
    <div className="chat">
      <header className="chat-header">
        <img className="header-image" src={img} alt="not found" />
        <div className="user-name">{userName}</div>
      </header>
      <div className="chat-window">
        {/* <Messages value={{messageArr,userName}} /> */}
        {messageArr[0] &&
          messageArr.map((item, index) => {
            return (
              <div key={index}>
                {userName === item.author ? (
                  <div className="client-chat">
                    <div className="user-in-chat">{item.author}</div>
                    <div className="user-message">{item.message}</div>
                  </div>
                ) : (
                  <div className="server-chat">
                    <div className="user-in-chat">{item.author}</div>
                    <div className="user-message">{item.message}</div>
                  </div>
                )}
              </div>
            );
          })
        }
        <div style={{marginTop:"30vh"}} ref={messToEnd}/>
      </div>
      <div className="typing-area">
        <input
          className="typing-section"
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          placeholder="write a message..."
        />
        <SendIcon onClick={handleClick} className="send-btn" />
      </div>
    </div>
  );
};

export default Chat;
