import { Mongo } from "meteor/mongo";
//import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";

export const Messages = new Mongo.Collection("messages");

/*
Messages DB:
    _id: default
    event : event._id
    member : [] of customUserObj (i.e., only id and name)
    messages: [] of messageObj => {text, owner, createAt}


*/
if (Meteor.isServer) {
  Meteor.publish("myMessages", function(eventId) {
    return Messages.find({ event: eventId }, { sort: { createAt: 1 } });
  });
}

Meteor.methods({
  "messages.sendMessage"(eventId, message) {
    //check(newText, String);

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
});
