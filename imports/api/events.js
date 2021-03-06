import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";
import { Meteor } from "meteor/meteor";
//import { updateEvents } from "react-mapbox-gl/lib/map-events";

export const Events = new Mongo.Collection("events");

if (Meteor.isServer) {
  Meteor.publish("MyEvents", function() {
    return Events.find({ "member.id": Meteor.userId() });
  });

  Meteor.publish("restaurantEvents", function(restaurantObj) {
    return Events.find({ restaurantId: restaurantObj.id });
  });

  Meteor.publish("newEvents", function() {
    return Events.find({}, { sort: { createAt: -1 } });
  });
  Meteor.publish("currEventObj", function(eventId) {
    return Events.find({ _id: eventId });
  });
}

Meteor.methods({
  // Create new event specified by restaurant, party size, and time
  "events.createNewEvent"(
    business,
    sizeLimit,
    appTimeObj,
    displayDate,
    displayTime
  ) {
    check(displayDate, String);
    check(displayTime, String);

    if (Meteor.isServer) {
      if (!Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }
      Events.insert({
        createAt: Date.now(),
        owner: this.userId,
        status: "ongoing",
        isFull: false,
        member: [
          {
            id: this.userId,
            vote: -1
          }
        ],
        appTime: appTimeObj,
        displayDate: displayDate,
        displayTime: displayTime,
        restaurantId: business.id,
        restaurantUrl: business.url,
        restaurantName: business.name,
        peopleLimit: sizeLimit
      });
    }
  },

  // Join specific event
  "events.joinEvent"(event) {
    if (Meteor.isServer) {
      if (!Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }
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
          // only one slot left, set isFull flag to true
          Events.update(
            { _id: event._id },
            {
              $addToSet: {
                member: {
                  id: this.userId,
                  vote: -1
                }
              },
              $set: { isFull: true }
            }
          );
          Meteor.users.update(
            { _id: Meteor.userId() },
            {
              $addToSet: { "profile.joinedEvents": event._id }
            }
          );
        } else {
          Events.update(
            { _id: event._id },
            {
              $addToSet: {
                member: {
                  id: this.userId,
                  vote: -1
                }
              }
            }
          );
          Meteor.users.update(
            { _id: Meteor.userId() },
            {
              $addToSet: { "profile.joinedEvents": event._id }
            }
          );
        }
      } else {
        console.log("event not found!");
      }
    }
  },

  //Leave specific event
  "events.leaveEvent"(event) {
    if (Meteor.isServer) {
      if (!Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }
      console.log("server leave events   " + event._id);

      let myEvent = Events.findOne({ _id: event._id });
      if (myEvent !== undefined) {
        let currMemberSize = myEvent.member.length;

        if (currMemberSize <= 0) {
          // empty event, need remove
          Events.remove({ _id: event._id });
        } else if (currMemberSize === 1 && event.member[0].id === this.userId) {
          // only curr user left in this event
          Events.remove({ _id: event._id });
          Meteor.users.update(
            { _id: Meteor.userId() },
            {
              $pull: { "profile.joinedEvents": event._id }
            }
          );
        } else {
          Events.update(
            { _id: event._id },
            {
              $pull: { member: { id: Meteor.userId() } },
              $set: { isFull: false, status: "ongoing" }
            }
          );

          Events.update(
            { _id: event._id, "member.vote": 0 },
            { $set: { "member.$.vote": -1 } },
            { multi: true }
          );

          Events.update(
            { _id: event._id, "member.vote": 1 },
            { $set: { "member.$.vote": -1 } },
            { multi: true }
          );

          Meteor.users.update(
            { _id: Meteor.userId() },
            {
              $pull: { "profile.joinedEvents": event._id }
            }
          );
        }
      } else {
        console.log("event not found in CANCEL EVENT !");
      }
    }
  },

  "events.booking"(eventId) {
    if (Meteor.isServer) {
      if (!Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }
      Events.update(
        { _id: eventId },
        {
          $set: { status: "booking" }
        }
      );
    }
  },
  "events.booked"(eventId) {
    if (Meteor.isServer) {
      if (!Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }
      let currEvent = Events.findOne({ _id: eventId });
      if (currEvent.status === "booked") {
        Meteor.call("sendConfirmationEmail", currEvent);
      } else {
        Events.update(
          { _id: eventId },
          {
            $set: { status: "booked" }
          }
        );
      }
    }
  },

  "events.expire"(eventId) {
    if (Meteor.isServer) {
      if (!Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }
      Events.update(
        { _id: eventId },
        {
          $set: { status: "expired" }
        }
      );
    }
  },
  "events.remove"(event) {
    if (Meteor.isServer) {
      if (!Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }
      Events.remove({ _id: event._id });
    }
  },

  "events.bookingFailed"(eventId) {
    if (Meteor.isServer) {
      if (!Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }
      // Remove members who voted 0
      Events.update(
        { _id: eventId },
        {
          $pull: { member: { vote: 0 } }
        },
        { multi: true }
      );

      // set back event status
      Events.update(
        { _id: eventId },
        {
          $set: { status: "ongoing", isFull: false }
        }
      );

      // check if all members voted NO, which will make the event empty, and we need to remove it
      let updatedEvent = Events.findOne({ _id: eventId });
      console.log("find event here");
      if (updatedEvent && updatedEvent.member.length === 0) {
        Events.remove({ _id: eventId });
      } else {
        // reset votes
        Events.update(
          { _id: eventId, "member.vote": 0 },
          { $set: { "member.$.vote": -1 } },
          { multi: true }
        );

        Events.update(
          { _id: eventId, "member.vote": 1 },
          { $set: { "member.$.vote": -1 } },
          { multi: true }
        );
      }
    }
  },

  "events.vote"(eventId, vote) {
    if (Meteor.isServer) {
      if (!Meteor.userId()) {
        throw new Meteor.Error("not-authorized");
      }

      Events.update(
        { _id: eventId, "member.id": Meteor.userId() },
        { $set: { "member.$.vote": vote } }
      );
    }
  }
});
