import React from "react";
import { Link } from "react-router-dom";
import Game from "./Game";

export default function Practice() {
  return (
    <div>
      <div className="navigation">
        <Link to="/">Home</Link>
      </div>
      <Game />
    </div>
  );
}
