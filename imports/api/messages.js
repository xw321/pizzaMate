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
  Meteor.publish("myMessages", function(currEvent) {
    return Messages.find({ event: currEvent._id });
  });
}
