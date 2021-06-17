import React, { Component, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import firebase from "../Firebase";
import tigerLogo from "../images/tiger_1024x1024.png";
import Loading from "./Loading";
import { FaUser, FaUserFriends } from "react-icons/fa";
import audioFile from "../music/background.mp3";

export default function Home(props) {
  const { redirectTo, gameId } = props;
  const [loading, setLoading] = useState(false);
  const [audio] = useState(
    typeof Audio !== "undefined" && new Audio(audioFile)
  );
  const history = useHistory();
  if (redirectTo === "game-room") {
    history.push({
      pathname: "/game-room",
      state: { gameId: gameId },
    });
  }

  const CreateGameToFirestore = async () => {
    let contextId = window.FBInstant.context.getID();
    let ref = firebase.firestore().collection("matches");
    setLoading(true);
    await ref
      .doc(contextId)
      .collection("match")
      .add({
        playerOneId: window.FBInstant.player.getID(),
        playerOneName: window.FBInstant.player.getName(),
        playerOnePhoto: window.FBInstant.player.getPhoto(),
        playerOneRole: "tiger",
        hasStarted: false,
        hasJoined: false,
        turn: "goat",
      })
      .then(async (res) => {
        let base64Imge = await getBase64FromUrl(
          window.FBInstant.player.getPhoto()
        );

        window.FBInstant.updateAsync({
          action: "CUSTOM",
          cta: "Play Now",
          template: "join_fight",
          image: base64Imge,
          text: `${window.FBInstant.player.getName()} Challaged You`,
          data: {
            gameId: res.id,
          },
          strategy: "IMMEDIATE",
          notification: "NO_PUSH",
        })
          .then(function () {
            setLoading(false);
            history.push({
              pathname: "/game-room",
              state: { gameId: res.id },
            });
          })
          .catch(function (err) {
            console.error("Update Async error", err);
          });
      })
      .catch(function (err) {
        console.error("Can not get data", err);
      });
  };
  const InviteFirednd = () => {
    if (audio.paused) {
      audio.loop = true;
      audio.volume = 0.3;
      audio.play();
    }
    window.FBInstant.context
      .chooseAsync({ minSize: 2, maxSize: 2 })
      .then(function () {
        CreateGameToFirestore();
      });
  };
  const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  };
  return (
    <div className="home-wrapper home">
      {loading && <Loading />}
      <div className="info">
        <div className="title">
          <img src={tigerLogo} height="250" width="250" />
          <p>Baagchaal Ko Baadshah</p>
        </div>
      </div>
      <div className="option-wrapper">
        {/* <div className="menu">
          <a href="{% url 'multiplayer_offline' %}">Multiplayer Offline</a>
        </div> */}

        <div className="menu">
          <div className="sub-menu menu">
            <Link to="/practice">
              <span className="icon" style={{ fontSize: 30 }}>
                <FaUser />
              </span>
              Player
            </Link>
            <a onClick={InviteFirednd}>
              <span className="icon">
                <FaUserFriends />
              </span>
              Invite
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
