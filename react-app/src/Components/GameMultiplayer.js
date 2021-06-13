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
let globalEatenScore = 0
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
  const history = useHistory();
  let boardW;
  let boardH;
  let maxNoOfGoatEatenToFinishGame = 4;
  let LocalAvailablePositions = availablePositions.movePositon;
  let LocalFeedPositions = availablePositions.feedPosition;
  let gameId = history.location.state.gameId;
  let contextId = history.location.state.contextId;
  let ref = firebase.firestore().collection("matches");

  useEffect(() => {
    globalEatenScore = 0
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
    if (goatCount === 0 && turn === "goat") {
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
        if (goatCount > 0) {
          let goatClass = "goat goat" + goatCount.length;
          let t =
            `<div class="${goatClass} just-moved"><img class="goat-image" src="` +
            goat +
            `"/></div>`;
          $(positionClass).append(t);
          // goatCount--;
          setGoatCount(goatCount - 1);
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
    globalEatenScore ++
    console.log('Goat Eaten', globalEatenScore)
    // eatenScore++;
    setEatenScore(eatenScore + 1);
    if (eatenScore >= maxNoOfGoatEatenToFinishGame) {
      handleGameComplete("tiger");
    }
  }

  function switchTurn(newTurn) {
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
          console.log($(vp))
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
          if (goatCount === 0) {
            let availableGoatPosition = checkifGoatCornered();
            console.log('availableGoatPosition', availableGoatPosition)
            if (availableGoatPosition === 0) {
              handleGameComplete("tiger");
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
    setGame({ ...data });
  }
  function handleGameComplete(winner) {
    if (winner === player.role) {
      ref
        .doc(contextId)
        .collection("match")
        .doc(gameId)
        .set({
          ...game,
          winner: player.id,
          winnerRole: player.role,
        });
    }
  }
  function playWinnerVictory(winner) {
    setTimeout(()=>{
      setWinner(winner);
    }, 4000)
  }
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
      window.FBInstant.quit()
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
    <div className="board-wrapper">
      <div className="navigation">
        <a onClick={Exit}>Exit</a>
      </div>
      {loading && <Loading />}
      {winner && (
        <WinnerPopup winner={winner} contextId={contextId} gameId={gameId} />
      )}
      {!enableMatch ? <Loading /> : ""}
      <div className="score">
        {globalEatenScore ? `Goat Eaten: ${globalEatenScore}` : ""}
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
          <div
            className={`playerOpponent playerInfo ${
              turn === opponent.role ? "turn-player" : ""
            }`}
          >
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
          <div
            className={`playerPlayer playerInfo ${
              turn === player.role ? "turn-player" : ""
            }`}
          >
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
    </div>
  );
}
