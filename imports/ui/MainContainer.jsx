import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
// import { withTracker } from "meteor/react-meteor-data";
// import PropTypes from "prop-types";
import { EJSON } from "meteor/ejson";
import { Input, Grid } from "semantic-ui-react";
import BusinessItem from "./BusinessItem.jsx";
import UserProfile from "./UserProfile.jsx";
import Map from "./Map.jsx";
import "../../client/main.css";

export default class MainContainer extends Component {
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
    return this.state.businesses.map(c => (
      <BusinessItem key={c._id} content={c} />
    ));
  }

  renderMap() {
    return <Map markers={this.state.businesses} />;
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

          // this.setState({
          //   lat: lat,
          //   longt: longt,
          //   message: "",
          //   businesses: []
          // });
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
      <Grid columns={3}>
        <Grid.Row centered>
          <Grid.Column width={4}>
            <UserProfile content={Meteor.user()} />
          </Grid.Column>
          <Grid.Column width={7}>
            <span>
              <h2>
                <span role="img" aria-label="emoji">
                  🍕
                </span>
                pizzaMate
              </h2>
            </span>
            <br />
            <Grid columns={3}>
              <Grid.Row centered>
                <Grid.Column width={5}> &nbsp;</Grid.Column>
                <Grid.Column width={7}>
                  <label>
                    {" "}
                    Search restaurant
                    <Input
                      fluid
                      icon="search"
                      type="text"
                      placeholder="Search for restaurant"
                      value={this.state.message}
                      onChange={this.onChange.bind(this)}
                      onKeyPress={this.onKey.bind(this)}
                    />
                  </label>
                </Grid.Column>

                <Grid.Column width={4}> &nbsp;</Grid.Column>
              </Grid.Row>
            </Grid>
            <br />
            <br />
            <div>{this.renderMap()}</div>
          </Grid.Column>
          <Grid.Column width={5}> {this.renderBusinesses()} </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
