import React from "react";
import { Link } from "react-router-dom";
import Game from "./Game";

export default function Multiplayer() {
  // FBInstant.context.getPlayersAsync()
  // .then(function(players) {
  //   _leaderboard.render(players);
  // }); 
  return (
    <div>
      <div className="navigation">
        <Link to="/">Home</Link>
      </div>
      <Game />
    </div>
  );
}
