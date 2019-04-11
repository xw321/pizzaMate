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
      myJoinButtonColor: "red"
    };
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
              color={this.state.myJoinButtonColor}
              size="tiny"
              type="button"
              floated="right"
              onClick={() => this.onJoin(this.props.myEvent)}
            >
              {this.state.myJoinButton}
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
