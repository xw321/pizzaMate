import { Mongo } from "meteor/mongo";
//import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";

export const Events = new Mongo.Collection("events");

if (Meteor.isServer) {
  Meteor.publish("MyEvents", function() {
    return Events.find({ member: Meteor.userId() });
  });

  Meteor.publish("restaurantEvents", function(restaurantObj) {
    return Events.find({ restaurantId: restaurantObj.id });
  });

  Meteor.publish("newEvents", function() {
    return Events.find({}, { sort: { createAt: -1 } });
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
    console.log("server join events   " + event._id);
    console.log("join events called by:  " + this.userId);
    let myEvent = Events.findOne({ _id: event._id });
    if (myEvent !== undefined) {
      let currMemberSize = myEvent.member.length;
      let sizeLimit = myEvent.peopleLimit;
      if (currMemberSize === sizeLimit) {
        // event full, cannot join
        Events.update(
          { _id: event._id },
          {
            isFull: true
          }
        );
        console.log("event is FULL!");
      } else if (sizeLimit - currMemberSize === 1) {
        // only one slot left
        Events.update(
          { _id: event._id },
          {
            $addToSet: { member: this.userId },
            $set: { isFull: true }
          }
        );
        Meteor.users.update(
          { _id: this.userId },
          {
            $addToSet: { joinedEvents: this.userId }
          }
        );
      } else {
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
      }
    } else {
      console.log("event nor found!");
    }
  },

  "events.leaveEvent"(event) {
    console.log("server leave events   " + event._id);

    let myEvent = Events.findOne({ _id: event._id });
    if (myEvent !== undefined) {
      let currMemberSize = myEvent.member.length;

      if (currMemberSize <= 0) {
        // empty event, need remove
        Events.remove({ _id: event._id });
      } else if (currMemberSize === 1 && event.member[0] === this.userId) {
        // only curr user left in this event
        Events.remove({ _id: event._id });
      } else {
        Events.update(
          { _id: event._id },
          {
            $pull: { member: Meteor.userId() }
          }
        );
      }
    } else {
      console.log("event not found in CANCEL EVENT !");
    }
  }
});
