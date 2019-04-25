import { Meteor } from "meteor/meteor";
import { HTTP } from "meteor/http";
import { check } from "meteor/check";
import { ServiceConfiguration } from "meteor/service-configuration";
import { Accounts } from "meteor/accounts-base";
import { Email } from "meteor/email";
export const Users = Meteor.users;

const settings = Meteor.settings.google;

// google login services config
if (settings) {
  ServiceConfiguration.configurations.remove({
    service: "google"
  });

  ServiceConfiguration.configurations.insert({
    service: "google",
    clientId: settings.clientId,
    secret: settings.secret
  });
}

// customize user profile with google services
Accounts.onCreateUser((options, user) => {
  user.profile = user.services.google;
  user.profile.interestedEvents = [];
  user.profile.joinedEvents = [];
  return user;
});

const API_KEY = Meteor.settings.yelp.apiKey;

// Yelp api call methods
Meteor.methods({
  // Search businesses with terms and location
  searchYelp(params) {
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    //console.log("para" + params);
    const URL = "https://api.yelp.com/v3/businesses/search";
    const options = {
      headers: {
        Authorization: `Bearer ${API_KEY}`
      },
      params: params
    };
    return HTTP.get(URL, options);
  },
  //Search specific business with budiness Id
  getYelpDetail(id) {
    check(id, String);
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    const URL = `https://api.yelp.com/v3/businesses/${id}`;
    const options = {
      headers: {
        Authorization: `Bearer ${API_KEY}`
      }
    };
    return HTTP.get(URL, options);
  },

  getMapToken() {
    if (Meteor.isServer) {
      return Meteor.settings.mapbox.token;
    }
  },

  sendConfirmationEmail(event) {
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    // don’t allow sending email unless the user is logged in
    if (!Meteor.user()) throw new Meteor.Error(403, "not logged in");

    // and here is where you can throttle the number of emails this user
    // is allowed to send per day
    let receiverArr = [];

    event.member.forEach(function(user) {
      let emailAddress = Meteor.users.find({ _id: user.id }).fetch()[0].profile
        .email;
      receiverArr.push(emailAddress);
    });

    Email.send({
      to: receiverArr,
      from: "pizzamate.usa@gmail.com",
      subject: "Your Reservation Confirmation for " + event.restaurantName,
      text:
        "Thanks for using pizzaMate.\n\nYour event at " +
        event.restaurantName +
        " on " +
        event.displayDate +
        ", at " +
        event.displayTime +
        ", party of " +
        event.peopleLimit +
        " was confirmed.\n\nWe would be happy to provide the service of booking the event for you." +
        " Unfortunately, we are not partnered with Yelp or any other reservation booking services providers yet, so we cannot use the reservation APIs.\n\nTo complete your event, you have to reserve a table by yourself :-(" +
        "\n\nLove,\npizzaMate"
    });
  },

  sendExpirationEmail(event) {
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();
    console.log("SEND CANCEL EMAIL");

    // don’t allow sending email unless the user is logged in
    if (!Meteor.user()) throw new Meteor.Error(403, "not logged in");

    // and here is where you can throttle the number of emails this user
    // is allowed to send per day
    let receiverArr = [];

    event.member.forEach(function(user) {
      let emailAddress = Meteor.users.find({ _id: user.id }).fetch()[0].profile
        .email;
      receiverArr.push(emailAddress);
    });

    Email.send({
      to: receiverArr,
      from: "pizzamate.usa@gmail.com",
      subject: "Your Event at " + event.restaurantName + " was expired",
      text:
        "We are sorry to inform you that your event at " +
        event.restaurantName +
        " on " +
        event.displayDate +
        ", at " +
        event.displayTime +
        ", party of " +
        event.peopleLimit +
        " was expired.\n\n Good luck on your future events!" +
        "\n\nLove,\npizzaMate"
    });
  }
});
