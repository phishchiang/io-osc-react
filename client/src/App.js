import React, { Fragment, useState, useEffect, useRef } from "react";
import socket from "socket.io-client";
import oscJS from "osc-js";
import "./App.css";

function App() {
  let OSC_OBJ;
  // let osc_message;
  // let bundle;

  const [io, setIo] = useState(null);
  const [osc, setOsc] = useState(null);
  const [chatContent, setChatContent] = useState([]);

  const [msg, setMsg] = useState("");
  const [mouseposi, setMouseposi] = useState([0, 0]);
  const [touchOn, setTouchOn] = useState(false);

  const [timeString, setTimeString] = useState(null);

  const containerRef = useRef(null);

  let ENDPOINT = "http://localhost:3000";
  // Init Setup
  // let ENDPOINT = "192.168.0.106:5500";

  const connectWebSocket = () => {
    //開啟
    console.log("set socket io");
    setIo(socket());
    console.log("set osc");
    OSC_OBJ = new oscJS();
    OSC_OBJ.open();
    setOsc(OSC_OBJ);
    // setOsc(oscJS());
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
      io.emit("touch_posi", mouseposi);
    }
  }, [mouseposi]);

  // Handle 'ALL' listner from the server
  useEffect(() => {
    if (io) {
      io.on("FINAL", message => {
        console.log(message);
        let osc_message_x = new oscJS.Message("/test/x", message[0]);
        let osc_message_y = new oscJS.Message("/test/y", message[1]);
        // bundle = new oscJS.Bundle([osc_message]);
        // console.log(bundle);
        osc.send(osc_message_x);
        osc.send(osc_message_y);
      });

      io.on("time", timeString => {
        setTimeString(timeString);
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
    // message = new oscJS.Message("/test/random", Math.random());
    // osc.send(message);
  };

  const onTouchEnd = e => {
    setTouchOn(false);
  };

  return (
    <Fragment>
      <div
        className="touch-area"
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onMouseMove}
        onTouchEnd={onTouchEnd}
      >
        <div>{`X position : ${mouseposi[0]}`}</div>
        <div>{`Y position : ${mouseposi[1]}`}</div>
        <div>{`Laser gun : ${touchOn}`}</div>
      </div>

      <h1>{timeString}</h1>
    </Fragment>
  );
}

export default App;
