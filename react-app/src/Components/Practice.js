import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Game from "./Game";
import audioFile from "../music/background.mp3";
import { FaHome } from "react-icons/fa";


export default function Practice() {
  const [audio] = useState(
    typeof Audio !== "undefined" && new Audio(audioFile)
  );
  useEffect(() => {
    if (audio.paused) {
      audio.loop = true;
      audio.play();
      audio.volume = 0.4;
    }
  }, []);
  return (
    <div>
      <div className="navigation">
        <Link to="/"><FaHome fontSize={40} style={{margin: 5}} /> </Link>
      </div>
      <Game date={Date.now()} />
    </div>
  );
}
