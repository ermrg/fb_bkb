import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import firebase from "../Firebase";
import Loading from "./Loading";
import tigerSound from "../music/tiger.mp3";
import goatSound from "../music/goat.mp3";
export default function WinnerPopup(props) {
  const { winner, contextId, gameId, mode } = props;
  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState();
  const [rematchMsgSending, setRematchMsgSending] = useState(false);
  const [tigerAudio] = useState(
    typeof Audio !== "undefined" && new Audio(tigerSound)
  );
  const [goatAudio] = useState(
    typeof Audio !== "undefined" && new Audio(goatSound)
  );
  const [rematchAcceptRejctDialog, setRematchAcceptRejctDialog] =
    useState(false);
  const history = useHistory();
  let ref = firebase.firestore().collection("matches");
  useEffect(() => {
    if (winner === "tiger") {
      tigerAudio.play();
      setTimeout(() => {
        tigerAudio.play();
      }, 2000);
    } else {
      goatAudio.play();
      setTimeout(() => {
        goatAudio.play();
      }, 2000);
    }
  }, []);
  useEffect(() => {
    const unsubscribe = ref
      .doc(contextId)
      .collection("match")
      .doc(gameId)
      .onSnapshot((doc) => {
        let updatedGame = doc.data();
        setGame({ ...updatedGame });
        if (
          updatedGame &&
          updatedGame.rematchRequest &&
          !updatedGame.rematchGameId &&
          updatedGame.exited != true
        ) {
          if (updatedGame.rematchRequest.status === "pending") {
            if (
              updatedGame.rematchRequest.receiverId ===
              window.FBInstant.player.getID()
            ) {
              setRematchAcceptRejctDialog(true);
            }
          } else if (updatedGame.rematchRequest.status === "approved") {
            CreateNewGame(updatedGame);
          } else {
            Exit();
          }
        } else {
          Exit();
        }
      });
    return () => unsubscribe();
  }, []);

  const Exit = async () => {
    setLoading(true);
    if (mode && mode === "single") {
      // window.FBInstant.quit();
    } else {
      if (game.exited != true && game.hasFinished != true) {
        await ref.doc(contextId).collection("match").doc(gameId).update({
          hasFinished: true,
          rematchRequest: "",
          exited: true,
        });
      }

      window.FBInstant.quit();
    }

    setLoading(false);
  };

  const Rematch = async () => {
    if (!rematchMsgSending) {
      setLoading(true);
      let msg = {
        type: "rematch",
        content: window.FBInstant.player.getName() + " Wants Rematch",
        status: "pending",
        senderId: window.FBInstant.player.getID(),
        senderName: window.FBInstant.player.getName(),
        receiverId:
          window.FBInstant.player.getID() === game.playerOneId
            ? game.playerTwoId
            : game.playerOneId,
        receiverName:
          window.FBInstant.player.getID() === game.playerOneId
            ? game.playerTwoName
            : game.playerOneName,
      };
      await ref
        .doc(contextId)
        .collection("match")
        .doc(gameId)
        .update({
          rematchRequest: { ...msg },
        })
        .then(() => {
          setRematchMsgSending(true);
        });
      setLoading(false);
    }
  };

  const CreateNewGame = async (game) => {
    setLoading(true);
    if (window.FBInstant.player.getID() === game.rematchRequest.receiverId) {
      let res = await ref.doc(contextId).collection("match").add({
        playerOneId: game.playerOneId,
        playerOneName: game.playerOneName,
        playerOnePhoto: game.playerOnePhoto,
        playerOneRole: "tiger",
        playerTwoId: game.playerTwoId,
        playerTwoName: game.playerTwoName,
        playerTwoPhoto: game.playerTwoPhoto,
        playerTwoRole: "goat",
        hasStarted: false,
        hasJoined: true,
        turn: "goat",
      });
      await ref
        .doc(contextId)
        .collection("match")
        .doc(gameId)
        .update({
          rematchGameId: res.id,
          rematchRequest: { ...game.rematchRequest, status: "created" },
        });
    }
    setLoading(false);
  };
  const RematchAction = async (action) => {
    setLoading(true);
    await ref
      .doc(contextId)
      .collection("match")
      .doc(gameId)
      .update({
        rematchRequest: { ...game.rematchRequest, status: action },
      });
    if (action === "declined") {
      Exit();
    }
    setLoading(false);
  };
  if (game && game.rematchGameId) {
    history.push({
      pathname: "/game-room",
      state: { gameId: game.rematchGameId },
    });
  }
  if (mode && mode === "single") {
    return (
      <div className="winner-popup">
        {loading && <Loading />}
        <div className="message-wrapper">
          <div className="message">{winner.toUpperCase()} Won!</div>

          <div className="winner-options">
            <div className="winner-option" onClick={Exit}>
              Exit
            </div>
            <div
              className={`winner-option rematch ${
                rematchMsgSending ? "disable" : ""
              }`}
              onClick={() =>
                history.push({ pathname: "/", redirectTo: "practice" })
              }
            >
              Home
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (rematchAcceptRejctDialog) {
    return (
      <div className="winner-popup">
        {loading && <Loading />}
        <div className="message-wrapper">
          <div className="message">Opponent wants Re-Match</div>

          <div className="winner-options">
            <div
              className="winner-option approve"
              onClick={() => RematchAction("approved")}
            >
              Approve
            </div>
            <div
              className="winner-option decline"
              onClick={() => RematchAction("declined")}
            >
              Decline
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="winner-popup">
      {loading && <Loading />}
      <div className="message-wrapper">
        <div className="message">
          {winner.toUpperCase()} Won!
          {rematchMsgSending && <div>Rematch request sending....</div>}
        </div>

        <div className="winner-options">
          <div className="winner-option" onClick={Exit}>
            Exit
          </div>
          {contextId && (
            <div
              className={`winner-option rematch ${
                rematchMsgSending ? "disable" : ""
              }`}
              onClick={Rematch}
            >
              Re-Match
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
