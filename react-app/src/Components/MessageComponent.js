import React, { useState } from "react";
import {
  FaAngry,
  FaLaugh,
  FaSurprise,
  FaSadCry,
  FaFacebookMessenger,
  FaRandom,
} from "react-icons/fa";
import firebase from "../Firebase";

export default function MessageComponent(props) {
  const { contextId, gameId, game, showSwitch } = props;

  const [showMessages, setShowMessages] = useState(false);
  const [disableMessages, setDisableMessages] = useState(false);
  let ref = firebase.firestore().collection("matches");
  // window.FBInstant = {
  //   player: {
  //     getID: () => {
  //       return "5599785686729941";
  //     },
  //     getName: () => {
  //       return "Arun";
  //     },
  //   },
  // };
  const toggelMessages = () => {
    setShowMessages(!showMessages);
  };
  const sendMessage = (message) => {
    setDisableMessages(true);
    let msg = {
      message: message,
      status: "pending",
      senderId: window.FBInstant.player.getID(),
      senderName: window.FBInstant.player.getName(),
      receiverId:
        window.FBInstant.player.getID() === game.playerOneId
          ? game.playerTwoId
          : game.playerOneId,
      receiverName:
        window.FBInstant.player.getID() === game.playerOneId
          ? game.playerTwoName
          : game.playerOneName,
    };
    let oldMessages = game.messages ? game.messages : [];
    ref
      .doc(contextId)
      .collection("match")
      .doc(gameId)
      .update({
        messages: [...oldMessages, msg],
      })
      .then(() => {
        setDisableMessages(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="message-component">
      <div
        className={`messages ${showMessages ? "show" : "hide"} ${
          disableMessages ? "disabled" : ""
        }`}
      >
        {showSwitch && (
          <span>
            <FaRandom onClick={() => sendMessage("switch")} />
          </span>
        )}

        <span>
          <FaAngry onClick={() => sendMessage("angry")} />
        </span>
        <span>
          <FaLaugh onClick={() => sendMessage("laugh")} />
        </span>
      </div>
      <div className="icon" onClick={toggelMessages}>
        <FaFacebookMessenger />
      </div>
    </div>
  );
}
