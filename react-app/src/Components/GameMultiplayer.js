import React, { useEffect, useState } from "react";
import { availablePositions } from "../availablePositions.js";
import goat from "../images/goat.png";
import tiger from "../images/tiger.png";
import $ from "jquery";
import firebase from "../Firebase";
import Loading from "./Loading.js";
import { useHistory } from "react-router";
let globalSelectedGoat = "";
let globalSelectedTiger = "";
let tigerCount = 4;
let goatCount = 20;
export default function GameMultiplayer() {
  const [game, setGame] = useState();
  const [player, setPlayer] = useState("");
  const [opponent, setOpponent] = useState("");
  const [enableMatch, setEnableMatch] = useState(false);
  const [turn, setTurn] = useState("goat");
  const [eatenScore, setEatenScore] = useState(0);
  const history = useHistory()
  let boardW;
  let boardH;
  let maxNoOfGoatEatenToFinishGame = 5;
  let LocalAvailablePositions = availablePositions.movePositon;
  let LocalFeedPositions = availablePositions.feedPosition;
  let gameId = history.location.state.gameId;
  let contextId = history.location.state.contextId;
  let ref = firebase.firestore().collection("matches");

  useEffect(() => {
    getMatches();
    placeTiger(".box1 .p1");
    placeTiger(".box4 .p2");
    placeTiger(".box13 .p4");
    placeTiger(".box16 .p3");
    const unsubscribe = ref
      .doc(contextId)
      .collection("match")
      .doc(gameId)
      .onSnapshot((doc) => {
        // console.log('Stapshor ', doc.data())
        if (doc.exists) {
          let getMatchData = doc.data();
          console.log("game", getMatchData);
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
      // console.log(getMatchData, "getMatchData");
    }
  };

  if (game && !enableMatch) {
    setEnableMatch(true);
  }
  const getPlayerRole = (getMatchData) => {
    // console.log("Data From Backend ", getMatchData);

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
  // console.log("Game: ", game);
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
      globalSelectedGoat =
        "." +
        selectedTigerBoxClass.split(" ")[1] +
        " ." +
        selectedTigerClass.split(" ")[1];
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
      globalSelectedTiger =
        "." +
        selectedTigerBoxClass.split(" ")[1] +
        " ." +
        selectedTigerClass.split(" ")[1];
    }
  }

  function placeTiger(positionClass) {
    let selectedTiger = $(document).find(".tiger.selected");
    console.log("Selected Tiger Length ============", selectedTiger.length);

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
    } else {
      console.log("New Tiger? ============", tigerCount);
      if (tigerCount > 0) {
        let t =
          `<div data-num="${tigerCount}" class="tiger tiger` +
          tigerCount +
          `"><img class="tiger-image" src="` +
          tiger +
          `" /></div>`;
        $(positionClass).append(t);
        // switchTurn();
        tigerCount--;
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
          goatCount--;
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
          console.log("Invalid Goat Move 1");
        }
      }
    } else {
      console.log("Invalid Goat Move 2");
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
            console.log("Invalid Move 1");
            return false;
          }
        }
      });
      if (isFeeding) {
        handleGoatEaten(eatenGoat);
        return true;
      } else {
        console.log("Invalid Move 2");
        return false;
      }
    } else {
      return true;
    }
  }

  function handleGoatEaten(eatenClass) {
    $(eatenClass).find(".goat").remove();
    setEatenScore(eatenScore + 1);
    if (eatenScore >= maxNoOfGoatEatenToFinishGame) {
      handleGameComplete("goat");
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
            console.log("Feed Position Counted");
            availablePosition++;
          }
        }
      });
    });
    return availablePosition;
  }

  function positionClicked(e) {
    $(".just-moved").removeClass("just-moved");
    // if (player.role === turn) {
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
    console.log("position", position);
    if (turn === "goat") {
      let success = placeGoat(position);
      console.log("Place Goat Success", success);
      if (success) {
        sendMovement(position, "goat", globalSelectedGoat);
        let availableTigerPosition = checkIfTigerCornered();
        if (availableTigerPosition === 0) {
          setTimeout(function () {
            handleGameComplete("goat");
          }, 1000);
        }
      }
    } else {
      let success = placeTiger(position);
      if (success) {
        sendMovement(position, "tiger", globalSelectedTiger);
      }
    }
    // }
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
    alert(winner.toUpperCase() + " Won!");
  }
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
      {!enableMatch ? <Loading /> : ""}
      <div className="score">
        {eatenScore ? `Goat Eaten: ${eatenScore}` : ""}
      </div>
      <div
        className={`board ${turn}Turn`}
        style={{ height: boardH, width: boardW }}
      >
        <div className="box box1">
          <div onClick={positionClicked} className="p p1"></div>
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
          <div onClick={positionClicked} className="p p2"></div>
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
          <div onClick={positionClicked} className="p p4"></div>
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
          <div onClick={positionClicked} className="p p3"></div>
          <div onClick={positionClicked} className="p p4"></div>
        </div>
        {opponent && (
          <div className={`playerOpponent playerInfo ${turn === opponent.role ? 'turn-player' : ''}`}>
            <div className="role">{opponent.role}</div>
            <div className="name-image">
              <div className="name">{opponent.name}</div>
              <div className="image">
                <img src={`${opponent.photo}`} className={`${turn === opponent.role ? 'turn-player' : ''}`} />
              </div>
            </div>
          </div>
        )}
        {player && (
          <div className={`playerPlayer playerInfo ${turn === player.role ? 'turn-player' : ''}`}>
            <div className="role">{player.role}</div>
            <div className="name-image">
              <div className="name">{player.name}</div>
              <div className="image">
                <img src={`${player.photo}`} className={`${turn === player.role ? 'turn-player' : ''}`} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
