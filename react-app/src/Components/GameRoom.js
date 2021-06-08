import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import firebase from "../Firebase";

export default function GameRoom() {
  const [game, setGame] = useState();
  const [playerJoined, setPlayerJoined] = useState(false);
  let ref = firebase.firestore().collection("matches");
  let contextId = window.FBInstant.context.getID();

  useEffect(() => {
    getMatches();
    const unsubscribe = ref.doc(contextId).onSnapshot((doc) => {
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
    const doc = await ref.doc(contextId).get();

    if (doc.exists) {
      console.log("Game Room data, ");
      let getMatchData = doc.data();
      console.log("Game Room data, ", getMatchData);
      setGame({ ...getMatchData });
    }
  };

  console.log("Game Room game, ", game);
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
              {playerJoined && game.playerOneId == window.FBInstant.player.getID() && (
                <div class="switch">
                  <i class="fas fa-random"></i> Switch
                </div>
              )}
            </div>
            {playerJoined && game.playerOneId == window.FBInstant.player.getID() && (
            <button class="start-match" type="submit">
              Start
            </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
