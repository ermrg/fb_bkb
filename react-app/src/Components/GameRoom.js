import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import firebase from "../Firebase";

export default function GameRoom(props) {
  const [game, setGame] = useState();
  const [playerJoined, setPlayerJoined] = useState(false);
  const history = useHistory();
  let ref = firebase.firestore().collection("matches");
  let contextId = window.FBInstant.context.getID();
  let gameId = history.location.state.gameId;
  console.log("GameID", gameId);
  useEffect(() => {
    getMatches();
    const unsubscribe = ref
      .doc(contextId)
      .collection("match")
      .doc(gameId)
      .onSnapshot((doc) => {
        console.log("Event Listner Called. Current data: ");
        console.log("Event Listner Called. Current data: ", doc.data());
        let updatedGame = doc.data();
        if (updatedGame.playerTwoId) {
          setPlayerJoined(true);
        }
        setGame({ ...updatedGame });
      });
    return () => unsubscribe();
  }, []);

  const getMatches = async () => {
    const doc = await ref.doc(contextId).collection("match").doc(gameId).get();

    if (doc.exists) {
      console.log("Game Room data, ");
      let getMatchData = doc.data();
      console.log("Game Room data, ", getMatchData);
      setGame({ ...getMatchData });
    }
  };

  const StartMatch = async () => {
    await ref
      .doc(contextId)
      .collection("match")
      .doc(gameId)
      .set({
        ...game,
        hasStarted: true,
      });
  };

  const RedirectToGame = () => {
    history.push({
      pathname: "/game-multiplayer",
      state: { contextId: contextId, gameId: gameId },
    });
  };
  if (game && game.hasStarted == true) {
    RedirectToGame();
  }
  return (
    <div>
      <div className="navigation">
        <Link to="/">Home</Link>
      </div>
      <div class="home-wrapper game-room">
        <div class="info">
          <div class="title">
            <div class="friends">
              <div class="friend">
                <div class="thumbnail"></div>
                <div class="name-wrapper">
                  <div class="name">
                    <span class="player player1">
                      {game && game.playerOneRole}{" "}
                    </span>{" "}
                    <span class="first-player">
                      {game && game.playerOneName}
                    </span>
                  </div>
                  <div class="name">
                    {playerJoined ? (
                      <div>
                        <span class="player player2">
                          {game.playerTwoRole}{" "}
                        </span>{" "}
                        <span class="second-player">{game.playerTwoName}</span>
                      </div>
                    ) : (
                      <span>Waiting ... </span>
                    )}
                  </div>
                </div>
              </div>
              {playerJoined &&
                game.playerOneId == window.FBInstant.player.getID() && (
                  <div class="switch">
                    <i class="fas fa-random"></i> Switch
                  </div>
                )}
            </div>
            {playerJoined &&
              game.playerOneId == window.FBInstant.player.getID() && (
                <button class="start-match" type="submit" onClick={StartMatch}>
                  Start
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
