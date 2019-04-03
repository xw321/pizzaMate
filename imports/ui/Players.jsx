import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import CanvasPaint from "./CanvasPaint.jsx";
import { Session } from "meteor/session";
import { Games } from "../lib/games.js";
import "../../client/main.css";

function getOpponentName() {
  if (Session.get("inGame")) {
    let myGame = Games.findOne();

    if (myGame !== undefined) {
      if (myGame.status === "waiting") {
        return "";
      } else {
        let prefix = "Opponent player : ";
        let res = "";
        if (myGame.player1 === Meteor.userId()) {
          res =
            Meteor.users.find({ _id: myGame.player2 }).fetch()[0] === undefined
              ? ""
              : prefix +
                Meteor.users.find({ _id: myGame.player2 }).fetch()[0].username;
        } else {
          res =
            Meteor.users.find({ _id: myGame.player1 }).fetch()[0] === undefined
              ? ""
              : prefix +
                Meteor.users.find({ _id: myGame.player1 }).fetch()[0].username;
        }

        return res;
      }
    }
  } else {
    return " ";
  }
}

function isInGame() {
  if (Session.get("inGame")) {
    //TODO findOne needs some querry
    let myGame = Games.findOne();

    if (myGame !== undefined) {
      if (myGame.status === "waiting") {
        //|| myGame.status === "end"
        return false;
      } else {
        return true;
      }
    }
  } else {
    return false;
  }
}

function setStatus() {
  if (Session.get("inGame")) {
    // console.log("in game true");
    let myGame = Games.findOne();

    if (myGame !== undefined) {
      if (myGame.status === "waiting") {
        return "Looking for an opponent...";
      } else if (myGame.status === Meteor.userId()) {
        return "drawing!";
      } else if (myGame.status !== Meteor.userId() && myGame.status !== "end") {
        return "drawing!";
      } else if (myGame.result === Meteor.userId()) {
        return "Your won";
      } else if (
        myGame.status === "end" &&
        myGame.result !== Meteor.userId() &&
        myGame.result !== "tie"
      ) {
        return "Your lost";
      } else if (myGame.result === "tie") {
        return "...";
      } else {
        return "...";
      }
    } else {
      return "not played yet, what are you waiting for?";
    }
  } else {
    return "not played yet, what are you waiting for?";
  }
}

class Players extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isReady: false,
      status: "not played yet, what you waiting for?"
    };
  }

  componentDidMount() {
    Meteor.subscribe("Games");
  }

  readyPlay() {
    Session.set("inGame", true);
    Meteor.call("games.play");
    Meteor.subscribe("MyGame");
    // console.log("on btn clik event " + event);
    // console.log("curr status " + this.state.status);
  }

  render() {
    return (
      <div className="row">
        <div className="battle1 col-6">
          <br />
          <div className="myfont">
            Playing as: &nbsp;{Meteor.user().username}
          </div>
          <div className="myfont">
            Your points: &nbsp;{Meteor.user().points}
          </div>
          <br />
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.readyPlay.bind(this)}
          >
            <span className="myfont">Play!</span>
          </button>
          <br />
          <br />
          <div className="myfont">
            <span>Game Status</span> :{" "}
            <span className="bg-warning"> {this.props.status}</span>
          </div>
          <br />
          <div className="myfont">{this.props.opponent}</div>
          <br />
        </div>
        <div className="battle2 col-6">
          <div className="float-left">
            {this.props.isInGame ? (
              <CanvasPaint />
            ) : (
              <div className="border rounded">
                <br />
                <h3 className="myfont">How to Play</h3>
                <p className="myfont">
                  {" "}
                  There will be a sketh for you to follow with.
                </p>
                <p className="myfont">
                  {" "}
                  Try to imitate it by drwaing on the canvas.
                </p>
                <p className="myfont">
                  {" "}
                  The more accurate one will win the game.
                </p>
                <p className="myfont">
                  Your drawing will be in color
                  <span className="text-primary"> blue.</span>{" "}
                </p>
                <p className="myfont">
                  Your opponent drawing will be in color
                  <span className="text-danger"> red.</span>
                </p>
                <p className="myfont"> Example:</p>
                <br />
                <img src={"imgs/4.png"} height="70%" width="70%" alt="sketch" />
              </div>
            )}
          </div>
          <br />
        </div>
      </div>
    );
  }
}

Players.propTypes = {
  points: PropTypes.arrayOf(PropTypes.object).isRequired,
  players: PropTypes.arrayOf(PropTypes.object).isRequired,
  status: PropTypes.string,
  opponent: PropTypes.string,
  isInGame: PropTypes.bool
};

export default withTracker(() => {
  Meteor.subscribe("userData");
  Meteor.subscribe("userStatus");
  Meteor.subscribe("userList");
  Meteor.subscribe("MyGame");
  return {
    points: Meteor.users
      .find(
        { _id: Meteor.userId() },
        {
          fields: { points: 1 }
        }
      )
      .fetch(),
    user: Meteor.user(),
    players: Meteor.users.find({ type: "ready" }).fetch(),
    status: setStatus(),
    opponent: getOpponentName(),
    isInGame: isInGame()
  };
})(Players);
