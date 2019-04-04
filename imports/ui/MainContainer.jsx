import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import { EJSON } from "meteor/ejson";
import { Input } from "semantic-ui-react";
import BusinessItem from "./BusinessItem.jsx";
import UserProfile from "./UserProfile.jsx";
import "../../client/main.css";

class MainContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lat: 0.0,
      longt: 0.0,
      message: "",
      businesses: []
    };
    this.onChange = this.onChange.bind(this);
    this.onKey = this.onKey.bind(this);
  }

  renderBusinesses() {
    return this.state.businesses.map((c, i) => (
      <BusinessItem key={i++} content={c} />
    ));
  }

  //Update state.message upon input update
  onChange(evt) {
    console.log("change", evt.target.value);
    this.setState({
      message: evt.target.value
    });
    console.log("After change  ", this.state.message);
  }

  // When user press Enter, get current location, and send location, input text to server.
  // Server would call Yelp api and return an array of businesses. Update returned array in state.businesses
  onKey(evt) {
    if (evt.key === "Enter") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          // get current location
          let lat = position.coords.latitude;
          let longt = position.coords.longitude;
          console.log("latitude:  " + lat + "    longitude:  " + longt);

          this.setState({
            lat: lat,
            longt: longt,
            message: "",
            businesses: []
          });
        });

        // call backend yelp api
        Meteor.call(
          "searchYelp",
          this.state.lat,
          this.state.longt,
          this.state.message,
          (err, res) => {
            if (err) {
              alert("Error calling Yelp API");
              console.log(err);
              return;
            }

            // console.log(
            //   "return res:    " +
            //     JSON.stringify(EJSON.parse(res["content"])["businesses"])
            // );
            // Format returned result, and set it in the state
            let businessesArr = EJSON.parse(res["content"])["businesses"];
            this.setState({
              businesses: businessesArr
            });
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col-2">
          <UserProfile content={Meteor.user()} />
        </div>

        <div className="col-5">
          <h2>Search</h2>
          <Input
            icon="search"
            type="text"
            placeholder="Search for restaurant"
            value={this.state.message}
            onChange={this.onChange.bind(this)}
            onKeyPress={this.onKey.bind(this)}
          />
          <br />
          <br />
        </div>

        <div className="col-5">
          <div>{this.renderBusinesses()}</div>
        </div>
      </div>
    );
  }
}

MainContainer.propTypes = {
  points: PropTypes.arrayOf(PropTypes.object).isRequired,
  players: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default withTracker(() => {
  Meteor.subscribe("userData");
  Meteor.subscribe("userStatus");
  Meteor.subscribe("userList");
  Meteor.subscribe("MyGame");
  return {
    points: Meteor.users
      .find(
        { _id: Meteor.userId() },
        {
          fields: { points: 1 }
        }
      )
      .fetch(),
    user: Meteor.user(),
    players: Meteor.users.find({ type: "ready" }).fetch()
  };
})(MainContainer);
