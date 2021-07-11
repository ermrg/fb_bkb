import React, { useEffect, useState } from "react";
import {
  FaAngry,
  FaLaugh,
  FaSurprise,
  FaSadCry,
  FaRandom,
} from "react-icons/fa";
import angryAudioFile from "../music/angry.mp3";
import laughAudioFile from "../music/laugh.mp3";

export default function ShowMessageComponent(props) {
  const [angryAudio] = useState(
    typeof Audio !== "undefined" && new Audio(angryAudioFile)
  );
  const [laughAudio] = useState(
    typeof Audio !== "undefined" && new Audio(laughAudioFile)
  );
  const { msg } = props;
  const [message, setMessage] = useState("");
  useEffect(() => {
    setMessage(getMessageIcon(msg));
    const timeout = setTimeout(() => {
      setMessage("");
    }, 2000);
  }, [msg]);

  const getMessageIcon = (value) => {
    let icon = "";
    if (value) {
      switch (value) {
        case "angry": {
          icon = <FaAngry />;
          angryAudio.play();
          break;
        }
        case "laugh": {
          icon = <FaLaugh />;
          laughAudio.play();
          break;
        }
        case "wow":
          icon = <FaSurprise />;
          break;
        case "cry":
          icon = <FaSadCry />;
          break;
        case "switch":
          icon = <FaRandom />;
          break;
        default:
          icon = "";
      }
    }
    return icon;
  };
  console.log("Icon", message);
  return <div className="receivedMessage">{message}</div>;
}
