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
  // const [chatContent, setChatContent] = useState([]);

  const [msg, setMsg] = useState("");
  const [touchPosi, setTouchPosi] = useState([0, 0]);
  const [touchFire, setTouchFire] = useState(false);

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
  }, []);

  // Handle chatContent of 'IOT_in' emit!!!
  // useEffect(() => {
  //   if (io) {
  //     io.emit("touch_posi", chatContent);
  //   }
  // }, [chatContent]);

  // Handle chatContent of 'IOT_in_02' emit!!!
  useEffect(() => {
    if (io) {
      io.emit("touch_posi", touchPosi);
    }
  }, [touchPosi]);

  // Handle 'ALL' listner from the server
  useEffect(() => {
    if (io) {
      io.on("bcat_posi", message => {
        console.log(message);
        let osc_message_x = new oscJS.Message("/touch/x", message[0]);
        let osc_message_y = new oscJS.Message("/touch/y", message[1]);
        // bundle = new oscJS.Bundle([osc_message]);
        // console.log(bundle);
        osc.send(osc_message_x);
        osc.send(osc_message_y);
      });

      io.on("bcat_fire", message => {
        console.log(message);
        let osc_message = new oscJS.Message("/touch/fire", message);
        osc.send(osc_message);
      });

      io.on("time", timeString => {
        setTimeString(timeString);
      });
    }
  }, [io]);

  // Handle touchOn of 'IOT_in' emit!!!
  useEffect(() => {
    if (io) {
      io.emit("touch_fire", touchFire.toString());
    }
  }, [touchFire]);

  const onTouchMove = e => {
    setTouchPosi([
      Math.floor((1 - e.touches[0].clientX / window.screen.width) * 180),
      Math.floor(
        ((e.touches[0].clientY - containerRef.current.offsetTop) /
          containerRef.current.clientHeight) *
          200
      )
    ]);
  };

  const onTouchStart = e => {
    setTouchFire(true);
    // message = new oscJS.Message("/test/random", Math.random());
    // osc.send(message);
  };

  const onTouchEnd = e => {
    setTouchFire(false);
  };

  return (
    <Fragment>
      <div
        className="touch-area"
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div>{`X position : ${touchPosi[0]}`}</div>
        <div>{`Y position : ${touchPosi[1]}`}</div>
        <div>{`Laser gun : ${touchFire}`}</div>
        <h3>{timeString}</h3>
      </div>
    </Fragment>
  );
}

export default App;
