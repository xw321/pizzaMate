/* eslint-disable no-undef */
import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import { Games } from "../lib/games.js";
import Counter from "./Counter.jsx";
//import Battle from "./Battle.jsx";

function isGameEnd() {
  if (Session.get("inGame")) {
    let myGame = Games.findOne();

    if (myGame !== undefined) {
      if (myGame.status === "end") {
        return true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }
}

function getRandImg() {
  let prefix = "imgs/";
  let imgArr = ["u.png", "plane.png", "peace.png", "Drawing1.png"];
  let game = Games.findOne();
  let index = 0;
  if (game !== undefined) {
    index = game.gameStartAt % imgArr.length;
  }
  return prefix + imgArr[index];
}

class CanvasPaint extends Component {
  redraw() {
    const ctx = this.canvas.getContext("2d");

    if (this.props.isGameEnd) {
      ctx.clearRect(0, 0, 400, 400);
    } else {
      if (this.props.game !== undefined && this.props.game[0] !== undefined) {
        let movesArr = this.props.game[0].moves;
        if (movesArr !== undefined) {
          for (let p = 0; p < movesArr.length; p++) {
            if (movesArr[p].playerID === Meteor.userId()) {
              ctx.fillStyle = "blue";
            } else {
              ctx.fillStyle = "red";
            }
            ctx.fillRect(movesArr[p].moveX, movesArr[p].moveY, 5, 5);
          }
        } else {
          console.log("moves arr undefined!!!!");
        }
      }
    }
  }

  componentDidMount() {
    Meteor.subscribe("Games");
    Meteor.subscribe("MyGame");
    this.redraw();
  }

  componentDidUpdate() {
    this.redraw();
  }

  onClick(evt) {
    let rect = this.canvas.getBoundingClientRect();
    const x = evt.clientX - rect.left;

    const y = evt.clientY - rect.top;

    console.log(
      "Click on " + x + " , " + y + " by user: " + Meteor.user().username
    );

    // Insert in the database. Meteor will automatically redraw the component when the db changes
    // Points.insert({
    //   x,
    //   y,
    //   player: Meteor.user().username
    // });
    Meteor.call("games.makeMove", x, y);
  }

  render() {
    return (
      <div>
        <br />
        <h4 className="myfont">
          Intimate the sketch in the middle of the canvas
        </h4>
        <img
          src={this.props.myImg}
          height="20%"
          width="20%"
          alt={this.props.myImg}
        />
        <br />
        <br />
        <div>
          {this.props.isGameEnd ? (
            <div>
              <h2 className="text-center subtitle myfont text-danger bg-dark">
                <span className="text-center">&nbsp;{"Game End!"}&nbsp;</span>
              </h2>
            </div>
          ) : (
            <Counter />
          )}
        </div>
        <br />
        <br />
        <canvas
          width="400"
          height="400"
          style={{ backgroundColor: "#eee" }}
          ref={canvas => (this.canvas = canvas)}
          onClick={this.onClick.bind(this)}
        />
        <br />
        <br />
        <br />
      </div>
    );
  }
}

CanvasPaint.propTypes = {
  game: PropTypes.arrayOf(PropTypes.object).isRequired,
  isGameEnd: PropTypes.bool,
  myImg: PropTypes.string
};

export default withTracker(() => {
  Meteor.subscribe("Games");
  Meteor.subscribe("MyGame");

  return {
    //Games.find({}).fetch()
    game: Games.find({}).fetch(),
    isGameEnd: isGameEnd(),
    myImg: getRandImg()
  };
})(CanvasPaint);
