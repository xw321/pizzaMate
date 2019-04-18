/* eslint-disable no-undef */
import { Meteor } from "meteor/meteor";
import "../imports/api/events.js";
import "../imports/api/messages.js";
import "../imports/api/methods.js";
import { WebApp } from "meteor/webapp";

WebApp.addHtmlAttributeHook(() => ({ lang: "en" }));

// Rate Limit. API calls are expensive
const methodName = {
  type: "method",
  name: "searchYelp"
};

if (Meteor.isServer) {
  DDPRateLimiter.addRule(
    {
      methodName
    },
    4,
    1000
  );
}

Meteor.startup(() => {});
