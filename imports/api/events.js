import { Mongo } from "meteor/mongo";
//import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";

export const Events = new Mongo.Collection("events");

if (Meteor.isServer) {
  Meteor.publish("MyEvents", function() {
    return Events.find({ member: Meteor.userId() });
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
      owner: this.userId,
      status: "ongoing",
      isFull: false,
      member: [this.userId],
      appTime: appTime,
      restaurantId: business.id,
      restaurantName: business.name,
      peopleLimit: sizeLimit
    });
  },

  "events.joinEvent"(event) {
    //let myEvent = Events.findOne({ _id: event._id });
    console.log("server join events   " + event._id);
    console.log("join events called by:  " + this.userId);
    Events.update(
      { _id: event._id },
      {
        $addToSet: { member: this.userId }
      }
    );

    Meteor.users.update(
      { _id: this.userId },
      {
        $addToSet: { joinedEvents: this.userId }
      }
    );
  },

  "events.leaveEvent"(event) {
    //let myEvent = Events.findOne({ _id: event._id });
    console.log("server leave events   " + event._id);
    Events.update(
      { _id: event._id },
      {
        $pull: { member: Meteor.userId() }
      }
    );
  }
});
