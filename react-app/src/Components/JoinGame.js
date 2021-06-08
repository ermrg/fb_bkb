import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { backendClient } from "../data";
import { BACKEND_URL } from "./constants";

export default function JoinGame() {
  const [playerTwo, setPlayerTwo] = useState(window.FBInstant.player.getName());
  const [game_code, setGameCode] = useState('');
  const history = useHistory()
  const JoinGameWithCode = () => {
    var facebookStuff = {
      name: "",
      picture: "",
      game_code: "",
      userId: "",
    };

    facebookStuff.name = window.FBInstant.player.getName();
    facebookStuff.picture = window.FBInstant.player.getPhoto();
    facebookStuff.userId = window.FBInstant.player.getID();
    window.FBInstant.player
    .getSignedPlayerInfoAsync(JSON.stringify({game_mode: 'create'}))
    .then(
      function (result) {
        setPlayerTwo(window.FBInstant.player.getName());
        return new backendClient(BACKEND_URL).join(
          game_code,
          result.getPlayerID(),
          result.getSignature(),
          facebookStuff
        ).then(()=>{console.log('Joined')});
      }.bind(this)
    )
    .then(
      function (response) {
        if (response.success) {
          console.log(
            "backend-match-content",
            "Data saved to backend. <br /> " + JSON.stringify(response.data)
          );
          history.push('/game-room')
        } else {
          console.log(
            "backend-match-content",
            "Data not saved to backend " + JSON.stringify(response)
          );
        }
      }.bind(this)
    )
    .catch(
      function (error) {
        console.log(
          "error-messages",
          "Error saving backend data:" + error.message
        );
      }.bind(this)
    );
  }
  return (
    <div>
      <div className="navigation">
        <Link to="/">Home</Link>
      </div>
      <div className="home-wrapper">
        <div className="info">
          <div className="title">
            <div className="second-line"> Your Name</div>
            <div className="form">
              <input name="name" type="text" value={playerTwo} onChange={(e) => setPlayerTwo(e.target.value)} />
              <input name="code" type="text" value={game_code} placeholder="Code" onChange={(e) => setGameCode(e.target.value)}/>
              <button className="create-game" onClick={JoinGameWithCode} >Join Game</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
