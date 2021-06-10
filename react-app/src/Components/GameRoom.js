import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import firebase from "../Firebase";
import Loading from "./Loading";

export default function GameRoom(props) {
  const [game, setGame] = useState();
  const [playerJoined, setPlayerJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  let ref = firebase.firestore().collection("matches");
  let contextId = window.FBInstant.context.getID();
  let gameId = history.location.state.gameId;
  // let contextId = "5535029736568755";
  // let gameId = "tByHBfp2ZWOvP7ZAd3SZ";
  useEffect(() => {
    getMatches();
    const unsubscribe = ref
      .doc(contextId)
      .collection("match")
      .doc(gameId)
      .onSnapshot((doc) => {
        let updatedGame = doc.data();
        console.log('Rematch : ',updatedGame)
        if (updatedGame.playerTwoId) {
          setPlayerJoined(true);
        }
        setGame({ ...updatedGame });
      });
    return () => unsubscribe();
  }, [gameId]);

  const getMatches = async () => {
    const doc = await ref.doc(contextId).collection("match").doc(gameId).get();

    if (doc.exists) {
      let getMatchData = doc.data();
      setGame({ ...getMatchData });
    }
    setLoading(false);
  };

  const SwitchRole = async () => {
    setLoading(true);

    await ref
      .doc(contextId)
      .collection("match")
      .doc(gameId)
      .set({
        ...game,
        playerOneRole: game.playerTwoRole,
        playerTwoRole: game.playerOneRole,
      });
    setLoading(false);
  };
console.log(contextId, gameId, game)
  const StartMatch = async () => {
    setLoading(true);
    await ref
      .doc(contextId)
      .collection("match")
      .doc(gameId)
      .update({
        hasStarted: true,
      });
    setLoading(false);
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
    <div class="home-wrapper">
      <div className="navigation">
        <Link to="/">Cancel</Link>
      </div>
      {loading && <Loading />}
      <div class="game-room">
        {game && (
          <div class="game-option">
            <div class="friends">
              <div class="friend">
                <div class="thumbnail">
                  <img src={`${game.playerOnePhoto}`} />
                </div>
                <div class="name-wrapper">
                  <div class="name">
                    <span class="player player1">{game.playerOneRole}</span>
                    <div className="player-info">
                      <span class="first-player">{game.playerOneName}</span>
                    </div>
                  </div>
                </div>
              </div>
              {playerJoined ? (
                <div class="friend">
                  <div class="thumbnail">
                    <img src={`${game.playerTwoPhoto}`} />
                  </div>
                  <div class="name-wrapper">
                    <div class="name">
                      <div>
                        <span class="player player2">{game.playerTwoRole}</span>
                        <div className="player-info">
                          <span class="second-player">
                            {game.playerTwoName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <span>Waiting ... </span>
              )}
              {playerJoined &&
                game.playerOneId == window.FBInstant.player.getID() && (
                  <div class="switch" onClick={SwitchRole}>
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
        )}
      </div>
    </div>
  );
}
