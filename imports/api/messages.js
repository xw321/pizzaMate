import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";

export const Messages = new Mongo.Collection("messages");

/*
Messages DB:
    _id: default
    event : event._id
    user: whoever sent this message
    createAt: current time
    messages: message
*/
if (Meteor.isServer) {
  Meteor.publish("myMessages", function(eventId) {
    return Messages.find({ event: eventId }, { sort: { createAt: 1 } });
  });
}

Meteor.methods({
  // insert new message to db
  "messages.sendMessage"(eventId, message) {
    if (Meteor.isServer) {
      check(message, String);
      if (!Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }

      Messages.insert({
        event: eventId,
        user: Meteor.user(),
        message: message,
        createAt: Date.now()
      });
    }
  }
});
