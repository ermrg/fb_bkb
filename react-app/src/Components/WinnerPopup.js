import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import firebase from "../Firebase";
import Loading from "./Loading";
export default function WinnerPopup(props) {
  const { winner, contextId, gameId } = props;
  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState();
  const [rematchMsgSending, setRematchMsgSending] = useState(false);
  const [rematchAcceptRejctDialog, setRematchAcceptRejctDialog] =
    useState(false);
  const history = useHistory();
  let ref = firebase.firestore().collection("matches");
  useEffect(() => {
    const unsubscribe = ref
      .doc(contextId)
      .collection("match")
      .doc(gameId)
      .onSnapshot((doc) => {
        let updatedGame = doc.data();
        setGame({ ...updatedGame });
        if (updatedGame.rematchRequest && !updatedGame.rematchGameId) {
          console.log("Game", updatedGame);
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
        }
      });
    return () => unsubscribe();
  }, []);

  const Exit = async () => {
    setLoading(true);
    await ref
      .doc(contextId)
      .collection("match")
      .doc(gameId)
      .update({
        hasFinished: true,
        rematchRequest: '',
        exited: true
      })
      .then(() => {
        setLoading(false);
        // should create new context here
        history.push("/");
      });
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
    setLoading(false);
  };
  if (game && game.rematchGameId) {
    history.push({
      pathname: "/game-room",
      state: { gameId: game.rematchGameId },
    });
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
        {rematchAcceptRejctDialog ? (
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
        ) : (
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
        )}
      </div>
    </div>
  );
}
