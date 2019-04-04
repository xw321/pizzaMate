import { Mongo } from "meteor/mongo";
//import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";

export const Events = new Mongo.Collection("events");

Meteor.methods({
  "events.createNewEvent"(businessName, sizeLimit, appTime) {
    Events.insert({
      createAt: Date.now(),
      owner: Meteor.userId(),
      status: "ongoing",
      isFull: false,
      member: [Meteor.user()],
      appTime: appTime,
      restaurant: businessName,
      peopleLimit: sizeLimit
    });
  }
});
