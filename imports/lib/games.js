import { Mongo } from "meteor/mongo";
//import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";
import { gameLogic } from "./gameLogic.js";

export const Games = new Mongo.Collection("games");

Meteor.methods({
  "games.play"() {
    let diedgame = Games.findOne({
      status: "end",
      $or: [{ player1: Meteor.userId() }, { player2: Meteor.userId() }]
    });
    // before this player can play a new game, we need to remove exsiting game that has this player
    if (diedgame !== undefined) {
      gameLogic.removeGame(diedgame._id);
    }
    const game = Games.findOne({ status: "waiting" });

    if (game === undefined) {
      console.log("no waiting game found, Starting a new Game");

      gameLogic.newGame();
    } else if (
      game !== undefined &&
      game.player1 !== this.userId &&
      game.player2 === ""
    ) {
      console.log("Join Game");
      gameLogic.joinGame(game);
    }
  },

  "games.makeMove"(x, y) {
    //let game = Games.findOne({ status: Meteor.userId() });
    if (x === -1 && y === -1) {
      console.log("call by counter, time is up");
    }
    let game = Games.findOne({
      $or: [{ player1: Meteor.userId() }, { player2: Meteor.userId() }]
    });

    if (game !== undefined) {
      let currtime = Date.now();
      if (currtime - game.gameStartAt <= 30000) {
        //console.log("makeMove ---- still have time");
        gameLogic.addNewMove(x, y);
        gameLogic.updateTurn(game);
      } else {
        // time is up, need to check who is winner
        // winner variable is a userId
        //console.log("makeMove ---- time is up, call checkWinner()");
        let winner = gameLogic.checkWinner();
        console.log("winner is >>>>>>>>>>>     " + winner);
        gameLogic.setGameResult(game._id, winner);
      }
    }
  }
});
