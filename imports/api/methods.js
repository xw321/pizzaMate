import { Meteor } from "meteor/meteor";
import { HTTP } from "meteor/http";
import { check } from "meteor/check";
export const Users = Meteor.users;
/*
 * Reviewed By: Abasiama Akpan
 * Good UI design
 * Good use and Storage of API keys 
 * Nice modularity of functions
 * Good use of eslint
 * Good use of meta headers and descriptions
 * Application is useful
 */
const API_KEY = Meteor.settings.yelp.apiKey;

Meteor.methods({
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
