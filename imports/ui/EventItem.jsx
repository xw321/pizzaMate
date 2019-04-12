import React, { Component } from "react";
import { Button, Item } from "semantic-ui-react";
//import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import "../../client/main.css";

export default class EventItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myJoinButton: "join",
      myJoinButtonColor: "red",
      isJoined: false
    };
  }

  componentDidMount() {
    this.checkJoined(this.props.myEvent);
  }

  checkJoined(evt) {
    console.log("called here");
    //let res = false;

    Meteor.call("events.isJoined", evt._id, (err, res) => {
      if (err) {
        alert("Error calling check joined");
        console.log(err);
        return;
      }

      console.log("res length:  " + res);

      this.setState({ isJoined: res });
    });
  }

  onJoin(myEvent) {
    console.log("join called  " + myEvent._id);

    Meteor.call("events.joinEvent", myEvent, (err, res) => {
      if (err) {
        alert("Error Joining");
        console.log(err);
        return;
      }
      this.setState({ myJoinButton: "joined!", myJoinButtonColor: "green" });
      console.log("return from join evt:  " + res);
    });
  }

  render() {
    console.log("render-----is jon?   " + this.state.isJoined);
    return (
      <Item key={this.props.myEvent._id}>
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
              disabled={this.state.isJoined}
              color={
                this.state.isJoined ? "green" : this.state.myJoinButtonColor
              }
              size="tiny"
              type="button"
              floated="right"
              onClick={() => this.onJoin(this.props.myEvent)}
            >
              {this.state.isJoined ? "joined" : this.state.myJoinButton}
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
