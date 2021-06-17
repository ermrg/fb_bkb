import React, { Component } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./Components/Home";
import "./App.css";
import GameRoom from "./Components/GameRoom";
import Game from "./Components/Game";
import Practice from "./Components/Practice";
import firebase from "./Firebase";
import GameMultuplayer from "./Components/GameMultiplayer";
import Loading from "./Components/Loading";

export default class App extends Component {
  state = { redirectTo: "", gameId: "", loading: true };
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
          if (contextType != "SOLO") {
            let contextId = window.FBInstant.context.getID();
            let ref = firebase.firestore().collection("matches");
            var entryPointData = window.FBInstant.getEntryPointData();
            let gameDoc = await ref
              .doc(contextId)
              .collection("match")
              .doc(entryPointData.gameId)
              .get();
            if (gameDoc.exists) {
              let game = gameDoc.data();
              if (game.hasFinished != true && game.exited != true) {
                let player = window.FBInstant.player;
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
                  loading: false,
                });
              } else {
                this.setState({
                  redirectTo: "",
                  gameId: "",
                });
              }
            } else {
              console.log("Game not found");
            }
          }
          this.setState({
            loading: false,
          });
        });
      });
    };
  }

  render() {
    return (
      <Router>
        {this.state.loading && <Loading />}
        <Switch>
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
      </Router>
    );
  }
}
