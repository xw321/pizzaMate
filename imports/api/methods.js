import { Meteor } from "meteor/meteor";
import { Games } from "../lib/games.js";
export const Users = Meteor.users;

let playerQueue = [];

let gameId = "";

Meteor.methods({
  "user.addToGame"(user1) {
    console.log("add to Game is called");
    // Make sure the user is logged in before inserting a task
    if (!this.userId) {
      throw new Meteor.Error("not-authorized");
    }
    Users.update(Meteor.userId(), { $set: { type: "ready" } });

    playerQueue.push(user1);
    console.log("playerQueue length " + playerQueue.length);
    if (playerQueue.length >= 2) {
      let player1 = playerQueue.shift();
      let player2 = playerQueue.shift();
      Users.update(player1._id, { $set: { type: "inGame" } });
      Users.update(player2._id, { $set: { type: "inGame" } });

      let gameObj = {
        player1: player1,
        player2: player2,
        createdAt: Date.now()
      };

      return Games.insert(gameObj, function(err, record) {
        if (err) return;
        console.log("game id inside Mongo insert" + JSON.stringify(record));
        gameId = JSON.stringify(record);
        return gameId;
      });
    }
  }
});
