import React, { useEffect, useState } from "react";
import { availablePositions } from "../availablePositions.js";
import goat from "../images/goat.png";
import tiger from "../images/tiger.png";
import $ from "jquery";
import firebase from "../Firebase";
import Loading from "./Loading.js";
import { useHistory } from "react-router";
import WinnerPopup from "./WinnerPopup.js";
import { Link } from "react-router-dom";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import MessageComponent from "./MessageComponent.js";
import ShowMessageComponent from "./ShowMessageComponent.js";

import switchTurnSound from "../music/switchturn.mp3";
import tigerSound from "../music/tiger.mp3";
import goatSound from "../music/goat.mp3";

let globalEatenScore = 0;
let globalGoatCount = 20;
export default function GameMultiplayer() {
  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState();
  const [player, setPlayer] = useState("");
  const [opponent, setOpponent] = useState("");
  const [enableMatch, setEnableMatch] = useState(false);
  const [turn, setTurn] = useState("goat");
  const [winner, setWinner] = useState("");
  const [eatenScore, setEatenScore] = useState(0);
  const [goatCount, setGoatCount] = useState(20);
  const [globalSelectedGoat, setGlobalSelectedGoat] = useState("");
  const [globalSelectedTiger, setGlobalSelectedTiger] = useState("");
  const [displayMessage, setDisplayMessage] = useState("");
  const history = useHistory();
  const [tigerAudio] = useState(
    typeof Audio !== "undefined" && new Audio(tigerSound)
  );
  const [goatAudio] = useState(
    typeof Audio !== "undefined" && new Audio(goatSound)
  );
  const [switchTurnAudio] = useState(
    typeof Audio !== "undefined" && new Audio(switchTurnSound)
  );
  let boardW;
  let boardH;
  let maxNoOfGoatEatenToFinishGame = 4;
  let LocalAvailablePositions = availablePositions.movePositon;
  let LocalFeedPositions = availablePositions.feedPosition;
  let gameId = history.location.state.gameId;
  let contextId = history.location.state.contextId;
  let ref = firebase.firestore().collection("matches");

  useEffect(() => {
    globalEatenScore = 0;
    globalGoatCount = 20;
    // setEatenScore(0);
    // setGoatCount(20);
    getMatches();
    const unsubscribe = ref
      .doc(contextId)
      .collection("match")
      .doc(gameId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          let getMatchData = doc.data();
          receiveDBChange(getMatchData);
        } else {
          console.log("Game Not Found");
        }
      });
    return () => unsubscribe();
  }, []);
  const getMatches = async () => {
    const doc = await ref.doc(contextId).collection("match").doc(gameId).get();
    if (doc.exists) {
      let getMatchData = doc.data();
      setGame({ ...getMatchData });
      getPlayerRole(getMatchData);
    }
  };

  if (game && !enableMatch) {
    setEnableMatch(true);
  }
  const getPlayerRole = (getMatchData) => {
    let currentPlayerId = window.FBInstant.player.getID();
    if (currentPlayerId === getMatchData.playerOneId) {
      setPlayer({
        role: getMatchData.playerOneRole,
        id: getMatchData.playerOneId,
        name: getMatchData.playerOneName,
        photo: getMatchData.playerOnePhoto,
      });
      setOpponent({
        role: getMatchData.playerTwoRole,
        id: getMatchData.playerTwoId,
        name: getMatchData.playerTwoName,
        photo: getMatchData.playerTwoPhoto,
      });
    } else {
      setOpponent({
        role: getMatchData.playerOneRole,
        id: getMatchData.playerOneId,
        name: getMatchData.playerOneName,
        photo: getMatchData.playerOnePhoto,
      });
      setPlayer({
        role: getMatchData.playerTwoRole,
        id: getMatchData.playerTwoId,
        name: getMatchData.playerTwoName,
        photo: getMatchData.playerTwoPhoto,
      });
    }
  };
  function goatClicked(e) {
    // e.stopPropagation();
    if (globalGoatCount === 0 && turn === "goat") {
      $(".goat").removeClass("selected");
      $(e).addClass("selected");
      let selectedTiger = $(document).find(".goat.selected");
      let selectedTigerClass = $(selectedTiger).closest(".p").attr("class");
      let selectedTigerBoxClass = $(selectedTiger)
        .closest(".box")
        .attr("class");
      setGlobalSelectedGoat(
        "." +
          selectedTigerBoxClass.split(" ")[1] +
          " ." +
          selectedTigerClass.split(" ")[1]
      );
      // globalSelectedGoat =
      //   "." +
      //   selectedTigerBoxClass.split(" ")[1] +
      //   " ." +
      //   selectedTigerClass.split(" ")[1];
    }
  }

  function tigerClicked(e) {
    // e.stopPropagation();
    if (turn === "tiger") {
      $(".tiger").removeClass("selected");
      $(e).addClass("selected");
      let selectedTiger = $(document).find(".tiger.selected");
      let selectedTigerClass = $(selectedTiger).closest(".p").attr("class");
      let selectedTigerBoxClass = $(selectedTiger)
        .closest(".box")
        .attr("class");
      setGlobalSelectedTiger(
        "." +
          selectedTigerBoxClass.split(" ")[1] +
          " ." +
          selectedTigerClass.split(" ")[1]
      );
      // globalSelectedTiger = "." + selectedTigerBoxClass.split(" ")[1] + " ." + selectedTigerClass.split(" ")[1];
    }
  }

  function placeTiger(positionClass) {
    let selectedTiger = $(document).find(".tiger.selected");
    if (selectedTiger.length) {
      let selectedTigerClass = $(selectedTiger).closest(".p").attr("class");
      let selectedTigerBoxClass = $(selectedTiger)
        .closest(".box")
        .attr("class");
      selectedTigerClass =
        "." +
        selectedTigerBoxClass.split(" ")[1] +
        " ." +
        selectedTigerClass.split(" ")[1];
      let availabilityCheck = checkAvailableTigerPosition(
        selectedTigerClass,
        positionClass
      );
      if (availabilityCheck) {
        let ifAlreadyGoatExit = $(positionClass).find(".goat");
        let ifAlreadyTigerExit = $(positionClass).find(".tiger");
        if ($(ifAlreadyGoatExit).length + $(ifAlreadyTigerExit).length === 0) {
          let value = $(document).find(".tiger.selected").attr("data-num");

          $(document).find(".tiger.selected").remove();
          let t =
            `<div data-num="${value}" class="tiger tiger${value} just-moved"><img class="tiger-image" src="` +
            tiger +
            `"/></div>`;
          $(positionClass).append(t);
          return true;
          // switchTurn();
        }
      } else {
        // console.log('Invalid Move 3')
      }
    }
  }

  function placeGoat(positionClass) {
    let selectedGoat = $(document).find(".goat.selected");

    let ifAlreadyGoatExit = $(positionClass).find(".goat");
    let ifAlreadyTigerExit = $(positionClass).find(".tiger");
    if ($(ifAlreadyGoatExit).length + $(ifAlreadyTigerExit).length === 0) {
      if (selectedGoat.length === 0) {
        if (globalGoatCount > 0) {
          let goatClass = "goat goat" + globalGoatCount;
          let t =
            `<div class="${goatClass} just-moved"><img class="goat-image" src="` +
            goat +
            `"/></div>`;
          globalGoatCount--;

          console.log("Goat count", globalGoatCount);
          // let newGoatCount = globalGoatCount - 1;
          // console.log('New Goat Count')
          setGoatCount(goatCount - 1);

          $(positionClass).append(t);
          return true;
        }
      } else {
        let selectedGoatClass = $(selectedGoat).closest(".p").attr("class");
        let selectedGoatBoxClass = $(selectedGoat)
          .closest(".box")
          .attr("class");
        selectedGoatClass =
          "." +
          selectedGoatBoxClass.split(" ")[1] +
          " ." +
          selectedGoatClass.split(" ")[1];
        let availabilityCheck = checkAvailableGoatPosition(
          selectedGoatClass,
          positionClass
        );
        if (availabilityCheck) {
          $(document).find(".goat.selected").remove();
          let t =
            `<div class="goat selected just-moved"><img class="goat-image" src="` +
            goat +
            `"/> </div>`;
          $(positionClass).append(t);
          return true;
        } else {
          // console.log("Invalid Goat Move 1");
        }
      }
    } else {
      // console.log("Invalid Goat Move 2");
    }
  }

  function checkAvailableGoatPosition(position, target) {
    let validPositions = LocalAvailablePositions[position];
    let isValid = validPositions.indexOf(target);
    return isValid >= 0;
  }

  function checkAvailableTigerPosition(position, target) {
    let validPositions = LocalAvailablePositions[position];
    let isValid = validPositions.indexOf(target);
    if (isValid === -1) {
      let feedingPositions = LocalFeedPositions[position];
      let isFeeding = false;
      let eatenGoat = "";
      feedingPositions.map(function (fp) {
        if (fp.destination === target) {
          let chekDestination = $(fp.destination).html();
          let goatExist = $(fp.food).find(".goat");
          if (goatExist.length && chekDestination === "") {
            eatenGoat = fp.food;
            isFeeding = true;
            return true;
          } else {
            // console.log("Invalid Move 1");
            return false;
          }
        }
      });
      if (isFeeding) {
        handleGoatEaten(eatenGoat);
        return true;
      } else {
        // console.log("Invalid Move 2");
        return false;
      }
    } else {
      return true;
    }
  }

  function handleGoatEaten(eatenClass) {
    $(eatenClass).find(".goat").remove();
    globalEatenScore++;
    setEatenScore(eatenScore + 1);
    tigerAudio.volume = 0.5;
    tigerAudio.play();
    setTimeout(() => {
      goatAudio.play();
    }, 1000);
    if (globalEatenScore > maxNoOfGoatEatenToFinishGame) {
      handleGameComplete("tiger");
    }
  }

  function switchTurn(newTurn) {
    switchTurnAudio.play();
    if (newTurn === "goat") {
      setTurn("goat");
      $(".board").removeClass("tigerTurn").addClass("goatTurn");
      $(".tiger").removeClass("selected");
    } else {
      setTurn("tiger");
      $(".board").removeClass("goatTurn").addClass("tigerTurn");
      $(".goat").removeClass("selected");
    }
  }

  function checkifGoatCornered() {
    let moveAvailable = 0;
    let points = Object.keys(LocalAvailablePositions);
    let emptyPoints = [];

    points.map((p) => {
      if ($(p).html().trim().length === 0) {
        emptyPoints.push(p);
      }
    });
    emptyPoints.map((ep) => {
      let validPositions = LocalAvailablePositions[ep];

      validPositions.map((vp) => {
        if ($(vp).find(".goat").length) {
          console.log($(vp));
          moveAvailable++;
        }
      });
    });
    return moveAvailable;
  }

  function checkIfTigerCornered() {
    let tigers = $(document).find(".tiger");
    $(tigers).removeClass("selected");
    let availablePosition = 0;
    tigers.map(function () {
      let className = $(this).closest(".p").attr("class");
      let boxClass = $(this).closest(".box").attr("class");
      let position =
        "." + boxClass.split(" ")[1] + " ." + className.split(" ")[1];
      let validPositions = LocalAvailablePositions[position];
      let feedingPositions = LocalFeedPositions[position];
      validPositions.map(function (p) {
        let hasFilled = $(p).html();
        if (hasFilled === "") {
          availablePosition++;
        }
      });
      feedingPositions.map(function (p, key) {
        let hasFilled = $(p.destination).html();
        if (hasFilled.trim() === "") {
          let ifGoatExist = $(p.food).find(".goat");
          if (ifGoatExist.length) {
            availablePosition++;
          }
        }
      });
    });
    return availablePosition;
  }

  function positionClicked(e) {
    $(".just-moved").removeClass("just-moved");
    if (player.role === turn) {
      if (e.target.nodeName === "IMG") {
        let cls = $(e.target).attr("class");
        if (cls.indexOf("tiger") >= 0) {
          tigerClicked($(e.target).closest(".tiger"));
        } else {
          goatClicked($(e.target).closest(".goat"));
        }
        return;
      }
      let box = $(e.target).closest(".box").first();
      let boxClass = $(box).attr("class");
      let goatClass = $(e.target).attr("class");
      let position = "";
      boxClass = boxClass.split(" ");
      goatClass = goatClass.split(" ");
      position = "." + boxClass[1] + " ." + goatClass[1];
      if (turn === "goat") {
        let success = placeGoat(position);
        if (success) {
          sendMovement(position, "goat", globalSelectedGoat);
          let availableTigerPosition = checkIfTigerCornered();
          if (availableTigerPosition === 0) {
            handleGameComplete("goat");
          }
        }
      } else {
        let success = placeTiger(position);
        if (success) {
          sendMovement(position, "tiger", globalSelectedTiger);
          if (globalGoatCount === 0) {
            let availableGoatPosition = checkifGoatCornered();
            if (availableGoatPosition === 0) {
              handleGameComplete("tiger", true);
            }
          }
        }
      }
    }
  }
  function sendMovement(position, playedTurn, selected) {
    let data = {
      playerId: player.id,
      position: position,
      selected: selected,
      turn: playedTurn,
    };
    //updata momevent
    ref
      .doc(contextId)
      .collection("match")
      .doc(gameId)
      .set({
        ...game,
        movementChanged: true,
        movement: { ...data },
        turn: turn == "goat" ? "tiger" : "goat",
      });
  }

  function receiveDBChange(data) {
    if (data.movementChanged && data.movement) {
      if (data.movement.selected) {
        if (
          !$(data.movement.selected)
            .find("." + data.movement.turn)
            .hasClass("selected")
        ) {
          $(data.movement.selected)
            .find("." + data.movement.turn)
            .addClass("selected");
        }
      }
      $(".just-moved").removeClass("just-moved");
      if (data.movement.turn === "tiger") {
        placeTiger(data.movement.position);
      } else {
        placeGoat(data.movement.position);
      }
      switchTurn(data.turn);
    }
    if (data.winner) {
      playWinnerVictory(data.winnerRole);
    }
    checkMessages(data.messages);
    setGame({ ...data });
  }
  function checkMessages(messages = []) {
    let unreadMessages = [];
    messages.map((m) => {
      if (
        m.status == "pending" &&
        m.receiverId == window.FBInstant.player.getID()
      ) {
        unreadMessages.push(m.message);
        return (m.status = "displayed");
      }
    });
    if (unreadMessages.length) {
      setDisplayMessage(unreadMessages[0]);
      unreadMessages.splice(0, 1);
      unreadMessages.map((um) => {
        setTimeout(() => {
          setDisplayMessage(um);
        }, 2000);
      });
    }
    setTimeout(() => {
      ref
        .doc(contextId)
        .collection("match")
        .doc(gameId)
        .update({
          messages: messages,
        })
        .catch((err) => {
          console.log("Game Multiplayer Error: ", err);
        });
    }, 2000);
  }

  function handleGameComplete(winner, forceSend = false) {
    if (winner === player.role || forceSend) {
      ref
        .doc(contextId)
        .collection("match")
        .doc(gameId)
        .set({
          ...game,
          winner: forceSend ? opponent.id : player.id,
          winnerRole: forceSend ? opponent.role : player.role,
          hasFinished: true,
        });
    }
  }
  function playWinnerVictory(winner) {
    setTimeout(() => {
      setWinner(winner);
    }, 4000);
  }
  function Rematch() {
    handleGameComplete(player.role, true);
  }
  const Exit = async () => {
    setLoading(true);
    ref.doc(contextId).collection("match").doc(gameId).update({
      hasFinished: true,
      rematchRequest: "",
      exited: true,
    });
    window.FBInstant.quit();
    setLoading(false);
  };
  let v_width = $("body").width();
  if (v_width < 912) {
    boardW = v_width - 50;
    boardH = boardW;
  }
  if (v_width < 400) {
    boardW = v_width - 30;
    boardH = boardW - boardW * 0.1;
  }
  return (
    <div>
      <div className="displayMessageContainer">
        <ShowMessageComponent msg={displayMessage} />
      </div>
      <div className="board-wrapper">
        <div className="navigation">
          <a onClick={Rematch} className="rematch">
            <span>Rematch</span>
          </a>
          <Link to="/">
            <FaHome fontSize={35} style={{ margin: 5 }} />
          </Link>

          <a onClick={Exit}>
            <FaSignOutAlt fontSize={35} style={{ margin: 5 }} />
          </a>
        </div>
        {loading && <Loading />}
        {winner && (
          <WinnerPopup winner={winner} contextId={contextId} gameId={gameId} />
        )}
        {!enableMatch ? <Loading /> : ""}
        <div className="score">
          <span style={{ color: "greenyellow" }}>
            {globalGoatCount ? `Goat: ${globalGoatCount}` : ""}
          </span>
          <span>
            <br />
            {globalEatenScore ? `Eaten: ${globalEatenScore}` : ""}
          </span>
        </div>
        <div
          className={`board ${turn}Turn`}
          style={{ height: boardH, width: boardW }}
        >
          <div className="box box1">
            <div onClick={positionClicked} className="p p1">
              <div data-num="1" className="tiger tiger1">
                <img className="tiger-image" src={tiger} />
              </div>
            </div>
            <div onClick={positionClicked} className="p p2"></div>
            <div onClick={positionClicked} className="p p3"></div>
            <div onClick={positionClicked} className="p p4"></div>
          </div>
          <div className="box box2">
            <div onClick={positionClicked} className="p p1"></div>
            <div onClick={positionClicked} className="p p2"></div>
            <div onClick={positionClicked} className="p p3"></div>
            <div onClick={positionClicked} className="p p4"></div>
          </div>
          <div className="box box3">
            <div onClick={positionClicked} className="p p1"></div>
            <div onClick={positionClicked} className="p p2"></div>
            <div onClick={positionClicked} className="p p3"></div>
            <div onClick={positionClicked} className="p p4"></div>
          </div>
          <div className="box box4">
            <div onClick={positionClicked} className="p p1"></div>
            <div onClick={positionClicked} className="p p2">
              <div data-num="2" className="tiger tiger2">
                <img className="tiger-image" src={tiger} />
              </div>
            </div>
            <div onClick={positionClicked} className="p p3"></div>
            <div onClick={positionClicked} className="p p4"></div>
          </div>
          <div className="box box5">
            <div onClick={positionClicked} className="p p1"></div>
            <div onClick={positionClicked} className="p p2"></div>
            <div onClick={positionClicked} className="p p3"></div>
            <div onClick={positionClicked} className="p p4"></div>
          </div>
          <div className="box box6">
            <div onClick={positionClicked} className="p p1"></div>
            <div onClick={positionClicked} className="p p2"></div>
            <div onClick={positionClicked} className="p p3"></div>
            <div onClick={positionClicked} className="p p4"></div>
          </div>
          <div className="box box7">
            <div onClick={positionClicked} className="p p1"></div>
            <div onClick={positionClicked} className="p p2"></div>
            <div onClick={positionClicked} className="p p3"></div>
            <div onClick={positionClicked} className="p p4"></div>
          </div>
          <div className="box box8">
            <div onClick={positionClicked} className="p p1"></div>
            <div onClick={positionClicked} className="p p2"></div>
            <div onClick={positionClicked} className="p p3"></div>
            <div onClick={positionClicked} className="p p4"></div>
          </div>
          <div className="box box9">
            <div onClick={positionClicked} className="p p1"></div>
            <div onClick={positionClicked} className="p p2"></div>
            <div onClick={positionClicked} className="p p3"></div>
            <div onClick={positionClicked} className="p p4"></div>
          </div>
          <div className="box box10">
            <div onClick={positionClicked} className="p p1"></div>
            <div onClick={positionClicked} className="p p2"></div>
            <div onClick={positionClicked} className="p p3"></div>
            <div onClick={positionClicked} className="p p4"></div>
          </div>
          <div className="box box11">
            <div onClick={positionClicked} className="p p1"></div>
            <div onClick={positionClicked} className="p p2"></div>
            <div onClick={positionClicked} className="p p3"></div>
            <div onClick={positionClicked} className="p p4"></div>
          </div>
          <div className="box box12">
            <div onClick={positionClicked} className="p p1"></div>
            <div onClick={positionClicked} className="p p2"></div>
            <div onClick={positionClicked} className="p p3"></div>
            <div onClick={positionClicked} className="p p4"></div>
          </div>
          <div className="box box13">
            <div onClick={positionClicked} className="p p1"></div>
            <div onClick={positionClicked} className="p p2"></div>
            <div onClick={positionClicked} className="p p3"></div>
            <div onClick={positionClicked} className="p p4">
              <div data-num="3" className="tiger tiger3">
                <img className="tiger-image" src={tiger} />
              </div>
            </div>
          </div>
          <div className="box box14">
            <div onClick={positionClicked} className="p p1"></div>
            <div onClick={positionClicked} className="p p2"></div>
            <div onClick={positionClicked} className="p p3"></div>
            <div onClick={positionClicked} className="p p4"></div>
          </div>
          <div className="box box15">
            <div onClick={positionClicked} className="p p1"></div>
            <div onClick={positionClicked} className="p p2"></div>
            <div onClick={positionClicked} className="p p3"></div>
            <div onClick={positionClicked} className="p p4"></div>
          </div>
          <div className="box box16">
            <div onClick={positionClicked} className="p p1"></div>
            <div onClick={positionClicked} className="p p2"></div>
            <div onClick={positionClicked} className="p p3">
              <div data-num="4" className="tiger tiger4">
                <img className="tiger-image" src={tiger} />
              </div>
            </div>
            <div onClick={positionClicked} className="p p4"></div>
          </div>
          {opponent && (
            <div className={`playerOpponent playerInfo`}>
              <div className="role">{opponent.role}</div>
              <div className="name-image">
                <div className="name">{opponent.name}</div>
                <div className="image">
                  <img
                    src={`${opponent.photo}`}
                    className={`${turn === opponent.role ? "turn-player" : ""}`}
                  />
                </div>
              </div>
            </div>
          )}
          {player && (
            <div className={`playerPlayer playerInfo`}>
              <div className="role">{player.role}</div>
              <div className="name-image">
                <div className="name">{player.name}</div>
                <div className="image">
                  <img
                    src={`${player.photo}`}
                    className={`${turn === player.role ? "turn-player" : ""}`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="message-wrapper">
          <MessageComponent contextId={contextId} gameId={gameId} game={game} />
        </div>
      </div>
    </div>
  );
}
