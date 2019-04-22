import React, { Component } from "react";
import { Button, List } from "semantic-ui-react";
// import { Events } from "../api/events.js";
// import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import "../../client/main.css";

export default class EventItem extends Component {
  constructor(props) {
    super(props);
  }

  // return true if current user already joined this event
  checkJoined() {
    for (let i = 0; i < this.props.myEvent.member.length; i++) {
      if (this.props.myEvent.member[i].id == Meteor.userId()) {
        return true;
      }
    }
    return false;

    //return this.props.myEvent.member.includes(Meteor.userId());
  }

  getDate() {
    let today = new Date();
    let date = today.getFullYear() + "-";
    let mon =
      today.getMonth() + 1 >= 10
        ? today.getMonth() + 1
        : "0" + (today.getMonth() + 1);

    date += mon;
    date += "-" + today.getDate();
    return date;
  }

  // get formatted current time
  getTime() {
    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes();
    return time;
  }

  isExpired() {
    const nowDate = new Date();
    //console.log("test get time:  " + nowDate.getTime());
    if (nowDate.getTime() > this.props.myEvent.appTime.getTime()) {
      return true;
    }
    return false;
  }

  // When click join button, call method
  onJoin(myEvent) {
    console.log("join called  " + myEvent._id);

    Meteor.call("events.joinEvent", myEvent, (err, res) => {
      if (err) {
        alert("Error Joining");
        console.log(err);
        return;
      }

      console.log("return from join evt:  " + res);
    });
  }

  render() {
    return (
      <List.Item>
        <List.Content>
          <List.Header>
            <a href={this.props.myEvent.restaurantUrl} target={"_blank"}>
              {this.props.myEvent.restaurantName}
            </a>
          </List.Header>
          <List.Description>
            {"Party of " + this.props.myEvent.peopleLimit + ", on "}
            {this.props.myEvent.displayDate}
            {", at " + this.props.myEvent.displayTime}
          </List.Description>
        </List.Content>

        {this.isExpired() ? (
          <Button floated={"right"} disabled size="tiny">
            Expired
          </Button>
        ) : this.props.myEvent.isFull ? (
          <Button color={"teal"} floated={"right"} disabled size="tiny">
            Full
          </Button>
        ) : (
          <Button
            disabled={this.checkJoined()}
            color={this.checkJoined() ? "orange" : "red"}
            size="tiny"
            floated={"right"}
            type="button"
            onClick={() => this.onJoin(this.props.myEvent)}
          >
            {this.checkJoined() ? "Joined!" : "Join"}
          </Button>
        )}
      </List.Item>
    );
  }
}

EventItem.propTypes = {
  myEvent: PropTypes.object.isRequired
};
