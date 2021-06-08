import React, { Component } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./Components/Home";
import "./App.css";
import CreateGame from "./Components/CreateGame";
import JoinGame from "./Components/JoinGame";
import GameRoom from "./Components/GameRoom";
import Game from "./Components/Game";
import Practice from "./Components/Practice";
import firebase from "./Firebase";
import GameMultuplayer from "./Components/GameMultiplayer";

export default class App extends Component {
  // constructor(props) {
  // super(props);
  state = { redirectTo: "", gameId: "" };
  // }
  componentDidMount() {
    var s = document.createElement("script");
    s.src = "https://connect.facebook.net/en_US/fbinstant.6.2.js";
    // s.src = "mock/fbinstant.6.0.mock.js";
    s.id = "fbinstant";
    document.head.appendChild(s);
    s.onload = async () => {
      await window.FBInstant.initializeAsync().then(async () => {
        await window.FBInstant.startGameAsync().then(async () => {
          let contextType = window.FBInstant.context.getType();
          console.log("Context Type: ", contextType, contextType != "SOLO");
          if (contextType != "SOLO") {
            console.log("Second Player Recognized");
            let contextId = window.FBInstant.context.getID();
            console.log("Context Id: ", contextId);
            let ref = firebase.firestore().collection("matches");
            var entryPointData = window.FBInstant.getEntryPointData();
            console.log("Entry Points", entryPointData);
            let gameDoc = await ref
              .doc(contextId)
              .collection("match")
              .doc(entryPointData.gameId)
              .get();
            console.log("Second player doc", gameDoc, gameDoc.exists);
            if (gameDoc.exists) {
              let game = gameDoc.data();
              let player = window.FBInstant.player;
              console.log("Update Player Two");
              await ref
                .doc(contextId)
                .collection("match")
                .doc(entryPointData.gameId)
                .set({
                  ...game,
                  playerTwoId: player.getID(),
                  playerTwoName: player.getName(),
                  playerTwoPhoto: player.getPhoto(),
                  playerTwoRole: "goat",
                  hasJoined: true,
                });
              this.setState({
                redirectTo: "game-room",
                gameId: entryPointData.gameId,
              });
            }
          }
        });
      });
    };
  }

  render() {
    console.log("State", this.state);
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/create-game">
              <CreateGame />
            </Route>
            <Route exact path="/game-room">
              <GameRoom />
            </Route>
            <Route exact path="/practice">
              <Practice />
            </Route>
            <Route exact path="/game-multiplayer">
              <GameMultuplayer />
            </Route>
            <Route path="/game">
              <Game />
            </Route>
            <Route path="/">
              <Home
                redirectTo={this.state.redirectTo}
                gameId={this.state.gameId}
              />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
