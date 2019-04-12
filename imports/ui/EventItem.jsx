import React, { Component } from "react";
import { Icon, Button, Item } from "semantic-ui-react";
// import { Events } from "../api/events.js";
// import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import "../../client/main.css";

export default class EventItem extends Component {
  constructor(props) {
    super(props);
  }

  checkJoined() {
    return this.props.myEvent.member.includes(Meteor.userId());
  }

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
      <Item key={this.props.myEvent._id}>
        <Icon name="food" />
        <Item.Content>
          {this.props.myEvent.peopleLimit +
            " people @ " +
            this.props.myEvent.restaurantName +
            " @ " +
            this.props.myEvent.appTime}

          {this.props.myEvent.isFull ? (
            <Button disabled>Full</Button>
          ) : (
            <Button
              disabled={this.checkJoined()}
              color={this.checkJoined() ? "green" : "red"}
              size="tiny"
              type="button"
              floated="right"
              onClick={() => this.onJoin(this.props.myEvent)}
            >
              {this.checkJoined() ? "joined!" : "join"}
            </Button>
          )}
        </Item.Content>
      </Item>
    );
  }
}

EventItem.propTypes = {
  myEvent: PropTypes.object.isRequired
};
