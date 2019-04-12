import React, { Component } from "react";
import { Breadcrumb, Button, Item } from "semantic-ui-react";
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
        <Item.Content>
          <Breadcrumb size={"small"}>
            <Breadcrumb.Section active>
              {this.props.myEvent.peopleLimit}
            </Breadcrumb.Section>
            <Breadcrumb.Divider icon="user" />
            <Breadcrumb.Divider icon="angle double right" />
            <Breadcrumb.Section>
              <a href={this.props.myEvent.restaurantUrl}>
                {this.props.myEvent.restaurantName}
              </a>
            </Breadcrumb.Section>
            <Breadcrumb.Divider icon="food" />
            <Breadcrumb.Divider icon="angle double right" />
            <Breadcrumb.Section active>
              {this.props.myEvent.appTime}
            </Breadcrumb.Section>
            <Breadcrumb.Divider icon="clock" />
          </Breadcrumb>

          {this.props.myEvent.isFull ? (
            <Button floated="right" disabled>
              Full
            </Button>
          ) : (
            <Button
              disabled={this.checkJoined()}
              color={this.checkJoined() ? "orange" : "red"}
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
