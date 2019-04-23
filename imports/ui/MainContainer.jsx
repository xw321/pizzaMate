import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import { EJSON } from "meteor/ejson";
import {
  Image,
  Button,
  Item,
  Segment,
  Input,
  List,
  Grid
} from "semantic-ui-react";
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
      isloading: false,
      location: "",
      mouseOver: [],
      token: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onKey = this.onKey.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  renderBusinesses() {
    return this.state.businesses.map((c, index) => (
      // const className = c.highLight ? "res-hover" : "res-item";
      //const resInfo = c.info;
      // return (
      <BusinessItem
        key={c._id}
        content={c}
        isMouseOver={this.state.mouseOver[index]}
        changeFunction={() => this.changeMouseOverStatus(index)}
      />
    ));
  }

  // function handles mouse over business/marker effect
  changeMouseOverStatus(index) {
    const newArray = this.state.mouseOver.slice();
    newArray[index] = !newArray[index];
    this.setState({
      mouseOver: newArray
    });
  }

  UNSAFE_componentWillMount() {
    Meteor.call("getMapToken", (err, res) => {
      console.log("API");
      if (err) {
        alert("Error calling MAp API");
        console.log(err);
        return;
      }

      this.setState({ token: res });
    });
  }

  // return a mapbox instance
  renderMap() {
    if (this.state.token !== "") {
      return (
        <Map
          markers={this.state.businesses}
          isMouseOverArray={this.state.mouseOver}
          changeFunction={i => this.changeMouseOverStatus(i)}
          token={this.state.token}
        />
      );
    }
  }

  componentDidMount() {
    // get user location onload
    let lat = 0.0;
    let longt = 0.0;
    navigator.geolocation.getCurrentPosition(position => {
      // get current location
      lat = position.coords.latitude;
      longt = position.coords.longitude;
      this.setState({
        lat: lat,
        longt: longt
      });
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
    // Just a safer way to ensure we have user lcoation
    navigator.geolocation.getCurrentPosition(position => {
      // get current location
      lat = position.coords.latitude;
      longt = position.coords.longitude;

      this.setState({
        lat: lat,
        longt: longt
      });
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
        this.setState({
          businesses: [],
          mouseOver: []
        });

        let params = {
          latitude: this.state.lat,
          longitude: this.state.longt,
          radius: 30000,
          term: this.state.message
        };

        // Depending on the location input, if user didn't specify a location,
        // then we search by user current location; else we search by user input location
        if (this.state.location.length === 0) {
          params = {
            latitude: this.state.lat,
            longitude: this.state.longt,
            radius: 30000,
            term: this.state.message
          };
        } else {
          params = {
            location: this.state.location,
            radius: 30000,
            term: this.state.message
          };
        }

        // call yelp API
        Meteor.call("searchYelp", params, (err, res) => {
          console.log("API");
          if (err) {
            alert("Error calling Yelp API");
            console.log(err);
            return;
          }
          // Format returned result, and set it in the state
          let businessesArr = EJSON.parse(res["content"])["businesses"];
          this.setState({
            businesses: businessesArr,
            isloading: false,
            mouseOver: Array(businessesArr.length).fill(false)
          });
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    }
  }

  // clear searched results
  handleClear() {
    this.setState({ businesses: [], message: "", location: "" });
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
              <h1 className="pizza-logo">
                <span role="img" aria-label="emoji">
                  🍕
                </span>
                pizzaMate
              </h1>
            </span>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered>
          <Grid.Column width={4} />
          <Grid.Column width={4}>
            <Input
              fluid
              label={"Find"}
              loading={this.state.isloading}
              icon="search"
              type="text"
              placeholder="Restaurants"
              value={this.state.message}
              onChange={this.onChange.bind(this)}
              onKeyPress={this.onKey.bind(this)}
              aria-label="search"
            />
          </Grid.Column>
          <Grid.Column width={4}>
            <Input
              fluid
              label={"Near"}
              loading={this.state.isloading}
              icon="search"
              type="text"
              placeholder="Location"
              value={this.state.location}
              onChange={e => this.setState({ location: e.target.value })}
              onKeyPress={this.onKey.bind(this)}
              aria-label="search-location"
            />
          </Grid.Column>
          <Grid.Column width={4} />
        </Grid.Row>

        <Grid.Row centered>
          <Grid.Column width={4}>
            <UserProfile content={Meteor.user()} />
          </Grid.Column>
          <Grid.Column width={7}>{this.renderMap()}</Grid.Column>
          <Grid.Column width={5}>
            {this.state.businesses.length === 0 ? null : (
              <Button
                fluid
                basic
                color={"red"}
                content="Clear Results"
                onClick={this.handleClear.bind(this)}
              />
            )}
            <Segment style={{ overflow: "auto", maxHeight: 700 }}>
              {this.state.isloading ? (
                <Image size={"large"} src={"imgs/loading.gif"} centered />
              ) : this.state.businesses.length === 0 ? (
                <Item.Group>
                  <Item>
                    <Item.Content verticalAlign="middle">
                      <Item.Header>New Events Near You</Item.Header>
                    </Item.Content>
                  </Item>
                  <div className="ui divider" />
                  <List animated divided verticalAlign="middle">
                    {this.renderNewEvents()}
                  </List>
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
