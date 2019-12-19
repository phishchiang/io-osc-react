import React, { Fragment, useState, useEffect, useRef } from "react";
import socket from "socket.io-client";
import "./App.css";

function App() {
  const [io, setIo] = useState(null);
  const [chatContent, setChatContent] = useState([]);

  const [msg, setMsg] = useState("");
  const [mouseposi, setMouseposi] = useState([0, 0]);
  const [touchOn, setTouchOn] = useState(false);

  const containerRef = useRef(null);

  let ENDPOINT = "http://localhost:5500";
  // Init Setup
  // let ENDPOINT = "192.168.0.106:5500";

  const connectWebSocket = () => {
    //開啟
    setIo(socket(ENDPOINT));
  };

  useEffect(() => {
    connectWebSocket();
  }, [ENDPOINT]);

  // Handle chatContent of 'IOT_in' emit!!!
  useEffect(() => {
    if (io) {
      io.emit("mouse", chatContent);
    }
  }, [chatContent]);

  // Handle chatContent of 'IOT_in_02' emit!!!
  useEffect(() => {
    if (io) {
      io.emit("IOT_in_02", mouseposi);
    }
  }, [mouseposi]);

  // Handle 'ALL' listner from the server
  useEffect(() => {
    if (io) {
      io.on("FINAL", message => {
        console.log(message);
      });
    }
  }, [io]);

  // Handle touchOn of 'IOT_in' emit!!!
  useEffect(() => {
    if (io) {
      io.emit("mouse", touchOn);
    }
  }, [touchOn]);

  const onChange = e => {
    e.preventDefault();
    setMsg(e.target.value);
    // console.log(msg);
  };

  const onSubmit = e => {
    e.preventDefault();
    setChatContent([msg, ...chatContent]);
    io.emit("mouse", msg);
  };

  const onMouseMove = e => {
    setMouseposi([
      Math.floor((1 - e.touches[0].clientX / window.screen.width) * 180),
      Math.floor(
        ((e.touches[0].clientY - containerRef.current.offsetTop) /
          containerRef.current.clientHeight) *
          200
      )
    ]);
  };

  const onTouchStart = e => {
    setTouchOn(true);
  };

  const onTouchEnd = e => {
    setTouchOn(false);
  };

  const debounce = (func, wait = 1000, immediate = true) => {
    var timeout;
    return function() {
      var context = this,
        args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  return (
    <div className="App">
      <header className="App-header">
        <div
          className="touch-area"
          ref={containerRef}
          onTouchStart={onTouchStart}
          onTouchMove={debounce(onMouseMove)}
          onTouchEnd={onTouchEnd}
        >
          <p>{`X position : ${mouseposi[0]}`}</p>
          <p>{`Y position : ${mouseposi[1]}`}</p>
          <p>{`Laser gun : ${touchOn}`}</p>
        </div>
      </header>
    </div>
  );
}

export default App;
