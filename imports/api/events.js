import { Mongo } from "meteor/mongo";
//import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";

export const Events = new Mongo.Collection("events");

if (Meteor.isServer) {
  Meteor.publish("MyEvents", function() {
    return Events.find({ member: this.userId });
  });

  // todo change querry
  Meteor.publish("restaurantEvents", function(restaurantObj) {
    return Events.find({ restaurantId: restaurantObj.id });
  });
}

Meteor.methods({
  "events.createNewEvent"(business, sizeLimit, appTime) {
    Events.insert({
      createAt: Date.now(),
      owner: Meteor.userId(),
      status: "ongoing",
      isFull: false,
      member: [Meteor.userId()],
      appTime: appTime,
      restaurantId: business.id,
      restaurantName: business.name,
      peopleLimit: sizeLimit
    });
  },

  //TODO
  "events.joinEvent"(event) {
    //let myEvent = Events.findOne({ _id: event._id });

    Events.update(
      { _id: event._id },
      {
        // push to array, if this user if not in the array already
        // check if is full
        $addToSet: { member: Meteor.userId() }
      }
    );
  }
});
