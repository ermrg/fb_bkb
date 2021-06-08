import React, { useEffect, useState } from "react";
import { availablePositions } from "../availablePositions.js";
import goat from "../images/goat.png";
import tiger from "../images/tiger.png";
import $ from "jquery";
import { useHistory } from "react-router";
import firebase from "../Firebase";

export default function GameMultuplayer() {
  const [game, setGame] = useState();
  const [playerRole, serPlayerRole] = useState("");
  const history = useHistory();
  let boardW;
  let boardH;
  let turn = "goat";
  let goatCount = 20;
  let tigerCount = 4;
  let eatenScore = 0;
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
  }, []);

  const getMatches = async () => {
    const doc = await ref.doc(contextId).collection("match").doc(gameId).get();

    if (doc.exists) {
      let getMatchData = doc.data();
      getPlayerRole(getMatchData);
      setGame({ ...getMatchData });
    }
  };
  const getPlayerRole = (getMatchData) => {
    let currentPlayerId = window.FBInstant.player.getID();
    if (currentPlayerId === getMatchData.playerOneId) {
      serPlayerRole(getMatchData.playerOneRole);
    } else {
      serPlayerRole(getMatchData.playerTwoRole);
    }
  };
  console.log("Game: ", game);
  function goatClicked(e) {
    // e.stopPropagation();
    console.log("goat Clicker");
    if (goatCount === 0 && turn === "goat") {
      $(".goat").removeClass("selected");
      $(e).addClass("selected");
    }
  }

  function tigerClicked(e) {
    // e.stopPropagation();
    console.log("tiger Clicker");

    if (turn === "tiger") {
      $(".tiger").removeClass("selected");
      $(e).addClass("selected");
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
          let value = $(document).find(".tiger.selected").html();
          console.log($(document).find(".tiger.selected").length);

          $(document).find(".tiger.selected").remove();
          let t =
            `<div class="tiger tiger${tiger}"><img class="tiger-image" src="` +
            tiger +
            `"/></div>`;
          $(positionClass).append(t);
          switchTurn();
        }
      } else {
        // console.log('Invalid Move 3')
      }
    } else {
      if (tigerCount > 0) {
        let t =
          `<div class="tiger tiger` +
          tigerCount +
          `"><img class="tiger-image" src="` +
          tiger +
          `" /></div>`;
        $(positionClass).append(t);
        switchTurn();
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
          let goatClass = "goat goat" + goatCount;
          let t =
            `<div class="${goatClass}"><img class="goat-image" src="` +
            goat +
            `"/></div>`;
          $(positionClass).append(t);
          switchTurn();
          goatCount--;
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
          let value = $(document).find(".goat.selected").html();
          $(document).find(".goat.selected").remove();
          let t =
            `<div class="goat selected"><img class="goat-image" src="` +
            goat +
            `"/> </div>`;
          $(positionClass).append(t);
          switchTurn();
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
    eatenScore++;
    $(".score").html(eatenScore);
    if (eatenScore >= maxNoOfGoatEatenToFinishGame) {
      alert("Game Over, Tiger Won");
    }
  }

  function switchTurn() {
    if (turn === "tiger") {
      turn = "goat";
      $(".board").removeClass("tigerTurn").addClass("goatTurn");
      $(".tiger").removeClass("selected");
    } else {
      turn = "tiger";
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
    if (playerRole === turn) {
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
      let goatPosition = "";
      boxClass = boxClass.split(" ");
      goatClass = goatClass.split(" ");
      goatPosition = "." + boxClass[1] + " ." + goatClass[1];
      if (turn === "goat") {
        placeGoat(goatPosition);
        let availableTigerPosition = checkIfTigerCornered();
        console.log(availableTigerPosition);
        if (availableTigerPosition === 0) {
          setTimeout(function () {
            alert("Game Over! Goat Won");
          }, 1000);
        }
      } else {
        placeTiger(goatPosition);
      }
    }
  }

  let v_width = $("body").width();
  if (v_width < 912) {
    boardW = v_width - 50;
    boardH = v_width + v_width * 0.1;
  }
  if (v_width < 400) {
    boardW = v_width - 30;
    boardH = v_width + v_width * 0.2;
  }
  return (
    <div>
      <div className="board-wrapper">
        <div
          className="board goatTurn"
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
        </div>
      </div>
    </div>
  );
}
