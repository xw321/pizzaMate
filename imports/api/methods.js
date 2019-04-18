import { Meteor } from "meteor/meteor";
import { HTTP } from "meteor/http";
import { check } from "meteor/check";
import { ServiceConfiguration } from "meteor/service-configuration";
import { Accounts } from "meteor/accounts-base";
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
    console.log("para" + params);
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
    const URL = `https://api.yelp.com/v3/businesses/${id}`;
    const options = {
      headers: {
        Authorization: `Bearer ${API_KEY}`
      }
    };
    return HTTP.get(URL, options);
  }
});
