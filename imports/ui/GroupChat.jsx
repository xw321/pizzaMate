import React, { Component } from "react";
import { Icon, Statistic, Menu, Grid, Label } from "semantic-ui-react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
import { Events } from "../api/events.js";
import ChatBoard from "./ChatBoard.jsx";
import "../../client/main.css";

class GroupChat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "default",
      restaurantName: "",
      restaurantUrl: ""
    };
    this.renderMyEvents = this.renderMyEvents.bind(this);
  }

  renderMyEvents() {
    return this.props.myEvents.map(c => (
      <Menu.Item
        key={c._id}
        active={this.state.activeItem === c._id}
        onClick={() =>
          this.setState({
            activeItem: c._id,
            restaurantName: c.restaurantName,
            restaurantUrl: c.restaurantUrl
          })
        }
      >
        <span id="eventList">
          <Icon name="food" />
          {c.restaurantName}
          {"   -   Party of " + c.peopleLimit + ", on "}
          {c.displayDate}
          {", at " + c.displayTime}

          {c.status === "booked" ? (
            <Label size="tiny" color="teal">
              <Icon name="check" />
              Booked!
            </Label>
          ) : null}
        </span>
      </Menu.Item>
    ));
  }

  renderChatBoard() {
    let myProp =
      this.props.myEvents.length === 0
        ? "You don't have an event yet :("
        : "Select an event to chat";
    return this.state.activeItem === "default" ? (
      <div>
        <h3>{myProp}</h3>
      </div>
    ) : (
      <ChatBoard event={this.state.activeItem} />
    );
  }

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={4} />
          <Grid.Column width={8}>
            <h1>Greet before you eat</h1>
          </Grid.Column>
          <Grid.Column width={4} />
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={2} />
          <Grid.Column width={6}>
            <h3>My Events Channels</h3>
            <Menu fluid pointing vertical>
              {this.renderMyEvents()}
            </Menu>
          </Grid.Column>
          <Grid.Column stretched width={6}>
            {this.state.activeItem === "default" ? null : (
              <Statistic size={"tiny"}>
                <Statistic.Label>You are talking event @:</Statistic.Label>
                <Statistic.Value>
                  <a href={this.state.restaurantUrl} target={"_blank"}>
                    {this.state.restaurantName}
                  </a>
                </Statistic.Value>
              </Statistic>
            )}
            {this.renderChatBoard()}
          </Grid.Column>
          <Grid.Column width={2} />
        </Grid.Row>
      </Grid>
    );
  }
}

GroupChat.propTypes = {
  myEvents: PropTypes.arrayOf(PropTypes.object)
};
export default withTracker(() => {
  Meteor.subscribe("MyEvents");

  return {
    myEvents: Events.find({ "member.id": Meteor.userId() }).fetch()
  };
})(GroupChat);
