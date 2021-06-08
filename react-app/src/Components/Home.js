import React, { Component, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import firebase from "../Firebase";

export default function Home(props) {
  const { redirectTo, gameId } = props;
  const history = useHistory();
  if (redirectTo === "game-room") {
    history.push({
      pathname: "/game-room",
      state: { gameId: gameId },
    });
  }
  console.log('GameId', gameId)
  return (
    <div className="home-wrapper home">
      <div className="info">
        <div className="title">
          <h3>BKB</h3>
        </div>
      </div>
      <div className="option-wrapper">
        {/* <div className="menu">
          <a href="{% url 'multiplayer_offline' %}">Multiplayer Offline</a>
        </div> */}

        <div className="menu">
          {/* <a>Multiplayer OnLine</a> */}
          <div className="sub-menu menu">
            {/* <a>Random Opponent</a> */}
            <Link to="/practice">Practice</Link>
            <Link to="/create-game">Challenge Your Friend</Link>
            {/* <Link to="/join-game">Join Game</Link> */}
          </div>
        </div>
      </div>
    </div>
  );
}
