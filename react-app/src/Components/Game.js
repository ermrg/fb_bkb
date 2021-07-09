import React, { useEffect, useState } from "react";
import { availablePositions } from "../availablePositions.js";
import goat from "../images/goat.png";
import tiger from "../images/tiger.png";
import $ from "jquery";
import WinnerPopup from "./WinnerPopup.js";
import switchTurnSound from "../music/switchturn.mp3";
import tigerSound from "../music/tiger.mp3";
import goatSound from "../music/goat.mp3";

let boardW;
let boardH;
// let eatenScore = 0;
let maxNoOfGoatEatenToFinishGame = 4;
let LocalAvailablePositions = availablePositions.movePositon;
let LocalFeedPositions = availablePositions.feedPosition;
export default function Game(props) {
  const { date } = props;
  const [turn, setTurn] = useState("goat");
  const [eatenScore, setEatenScore] = useState(0);
  const [goatCount, setGoatCount] = useState(0);
  const [winner, setWinner] = useState("");
  // const game = {
  //   hasJoined: true,
  //   hasStarted: true,
  //   movement: {
  //     playerId: "3872493182848314",
  //     position: ".box4 .p1",
  //     selected: ".box4 .p2",
  //     turn: "tiger",
  //   },
  //   movementChanged: true,
  //   playerOneId: "3872493182848314",
  //   playerOneName: "Arun",
  //   playerOnePhoto:
  //     "https://platform-lookaside.fbsbx.com/platform/instantgames/profile_pic.jpg?igpid=3872493182848314&height=256&width=256&ext=1626596845&hash=AeRA5Mg2F1dmCvfI-M4",
  //   playerOneRole: "tiger",
  //   playerTwoId: "5599785686729941",
  //   playerTwoName: "हरि प्रिया",
  //   playerTwoPhoto:
  //     "https://platform-lookaside.fbsbx.com/platform/instantgames/profile_pic.jpg?igpid=5599785686729941&height=256&width=256&ext=1626596863&hash=AeRLLGP52UiR7I5aPaQ",
  //   playerTwoRole: "goat",
  //   turn: "goat",
  //   winner: "",
  // };
  const [tigerAudio] = useState(
    typeof Audio !== "undefined" && new Audio(tigerSound)
  );
  const [goatAudio] = useState(
    typeof Audio !== "undefined" && new Audio(goatSound)
  );
  const [switchTurnAudio] = useState(
    typeof Audio !== "undefined" && new Audio(switchTurnSound)
  );
  useEffect(() => {
    setGoatCount(20);
    setEatenScore(0);
    setTurn("goat");
    setWinner("");
  }, [date]);
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
          let value = $(document).find(".tiger.selected").attr("data-num");
          console.log($(document).find(".tiger.selected").length);

          $(document).find(".tiger.selected").remove();
          let t =
            `<div data-num="${value}" class="tiger tiger${value}"><img class="tiger-image just-moved" src="` +
            tiger +
            `"/></div>`;
          $(positionClass).append(t);
          switchTurn();
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
          let goatClass = "goat goat" + goatCount;
          let t =
            `<div class="${goatClass}"><img class="goat-image just-moved" src="` +
            goat +
            `"/></div>`;
          $(positionClass).append(t);
          switchTurn();
          // goatCount--;
          setGoatCount(goatCount - 1);
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
            `<div class="goat selected just-moved"><img class="goat-image" src="` +
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
    setEatenScore(eatenScore + 1);
    tigerAudio.volume = 0.5;
    tigerAudio.play();
    setTimeout(() => {
      goatAudio.play();
    }, 1000);
    // $(".score").html(eatenScore);
    if (eatenScore >= maxNoOfGoatEatenToFinishGame) {
      playWinnerVictory("tiger");
    }
  }

  function switchTurn() {
    switchTurnAudio.play();
    if (turn === "tiger") {
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

  function positionClicked(e) {
    $(".just-moved").removeClass("just-moved");
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
      if (availableTigerPosition === 0) {
        playWinnerVictory("goat");
      }
    } else {
      placeTiger(goatPosition);
      if (goatCount === 0) {
        let availableGoatPosition = checkifGoatCornered();
        console.log("availableGoatPosition", availableGoatPosition);
        if (availableGoatPosition === 0) {
          playWinnerVictory("tiger");
        }
      }
    }
  }
  function playWinnerVictory(winner) {
    setTimeout(() => {
      setWinner(winner);
    }, 2000);
  }
  let v_width = $("body").width();
  if (v_width < 912) {
    boardW = v_width - 50;
    boardH = boardW;
  }
  if (v_width < 400) {
    boardW = v_width - 30;
    boardH = boardW + boardW * 0.1;
  }
  return (
    <div>
      <div className="board-wrapper">
        <div className="score">
          <span style={{ color: "greenyellow" }}>
            {goatCount ? `Goat: ${goatCount}` : ""}
          </span>
          <span>
            <br />
            {eatenScore ? `Eaten: ${eatenScore}` : ""}
          </span>
        </div>
        {winner && <WinnerPopup winner={winner} mode="single" />}
        <div
          className="board goatTurn"
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
          <div
            className={`playerOpponent playerInfo ${
              turn === "tiger" ? "turn-player" : ""
            }`}
          >
            <div className="role">Tiger</div>
          </div>
          <div
            className={`playerPlayer playerInfo ${
              turn === "goat" ? "turn-player" : ""
            }`}
          >
            <div className="role">Goat</div>
          </div>
        </div>
      </div>
    </div>
  );
}
