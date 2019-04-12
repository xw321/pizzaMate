import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import { EJSON } from "meteor/ejson";
import { Button, Item, Segment, Input, Grid } from "semantic-ui-react";
import BusinessItem from "./BusinessItem.jsx";
import EventItem from "./EventItem.jsx";
import UserProfile from "./UserProfile.jsx";
import Map from "./Map.jsx";
import { Events } from "../api/events.js";
import "../../client/main.css";

class MainContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lat: 0,
      longt: 0,
      message: "",
      businesses: [],
      isloading: false
    };
    this.onChange = this.onChange.bind(this);
    this.onKey = this.onKey.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  renderBusinesses() {
    return this.state.businesses.map((c, index) => {
      const className = c.highLight ? "res-hover" : "res-item";
      //const resInfo = c.info;
      return (
        <BusinessItem
          key={c._id}
          content={c}
          className={className}
          onMouseOver={() => this.handleOnMouseOverOrOut(index)}
          onMouseOut={() => this.handleOnMouseOverOrOut(index)}
        />
      );
    });
  }

  renderMap() {
    return <Map markers={this.state.businesses} />;
  }

  componentDidMount() {
    let lat = 0.0;
    let longt = 0.0;
    navigator.geolocation.getCurrentPosition(position => {
      // get current location
      lat = position.coords.latitude;
      longt = position.coords.longitude;
      console.log("--------latitude:  " + lat + "    longitude:  " + longt);
      this.setState({
        lat: lat,
        longt: longt
      });
      console.log("latitude:  " + lat + "    longitude:  " + longt);
    });
  }
  //Update state.message upon input update
  onChange(evt) {
    console.log("change", evt.target.value);
    this.setState({
      message: evt.target.value
    });
    console.log("After change  ", this.state.message);
    let lat = 0.0;
    let longt = 0.0;
    navigator.geolocation.getCurrentPosition(position => {
      // get current location
      lat = position.coords.latitude;
      longt = position.coords.longitude;
      console.log("--------latitude:  " + lat + "    longitude:  " + longt);
      this.setState({
        lat: lat,
        longt: longt
      });
      console.log("latitude:  " + lat + "    longitude:  " + longt);
    });
  }

  // When user press Enter, get current location, and send location, input text to server.
  // Server would call Yelp api and return an array of businesses. Update returned array in state.businesses
  onKey(evt) {
    if (evt.key === "Enter") {
      this.setState({ isloading: true });
      if (navigator.geolocation) {
        // call backend yelp api
        console.log(
          "KEYPRESS_____latitude:  " +
            this.state.lat +
            "    longitude:  " +
            this.state.longt
        );
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
              businesses: businessesArr,
              isloading: false
            });
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    }
  }

  handleClear() {
    this.setState({ businesses: [], message: "" });
  }

  renderNewEvents() {
    return this.props.newEvents.map(c => <EventItem key={c._id} myEvent={c} />);
  }

  render() {
    return (
      <Grid columns={3}>
        <Grid.Row centered>
          <Grid.Column textAlign="center">
            <span>
              <h1 id="pizza">
                <span role="img" aria-label="emoji">
                  🍕
                </span>
                pizzaMate
              </h1>
            </span>

            <div>
              <Input
                loading={this.state.isloading}
                icon="search"
                type="text"
                placeholder="Search for restaurant"
                value={this.state.message}
                onChange={this.onChange.bind(this)}
                onKeyPress={this.onKey.bind(this)}
                aria-label="search"
              />
              {this.state.businesses.length === 0 ? null : (
                <Button
                  content="Clear Results"
                  onClick={this.handleClear.bind(this)}
                />
              )}
            </div>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row centered>
          <Grid.Column width={4}>
            <UserProfile content={Meteor.user()} />
          </Grid.Column>
          <Grid.Column width={7}>{this.renderMap()}</Grid.Column>
          <Grid.Column width={5}>
            <Segment style={{ overflow: "auto", maxHeight: 800 }}>
              {this.state.businesses.length === 0 ? (
                <Item.Group>
                  <Item>
                    <Item.Content verticalAlign="middle">
                      <Item.Header>New Events Near You</Item.Header>
                    </Item.Content>
                  </Item>
                  <div className="ui divider" />
                  {this.renderNewEvents()}
                </Item.Group>
              ) : (
                this.renderBusinesses()
              )}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

MainContainer.propTypes = {
  newEvents: PropTypes.arrayOf(PropTypes.object)
};

export default withTracker(() => {
  Meteor.subscribe("newEvents");

  return {
    newEvents: Events.find({}, { sort: { createAt: -1 } }).fetch()
  };
})(MainContainer);
