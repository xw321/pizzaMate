import React, { Component } from "react";
import { Menu, Grid } from "semantic-ui-react";
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
      activeItem: "default"
    };
    this.renderMyEvents = this.renderMyEvents.bind(this);
  }

  renderMyEvents() {
    return this.props.myEvents.map(c => (
      <Menu.Item
        key={c._id}
        active={this.state.activeItem === c._id}
        onClick={() => this.setState({ activeItem: c._id })}
      >
        {c.peopleLimit + " people @ " + c.restaurantName + " @ " + c.appTime}
      </Menu.Item>
    ));
  }

  renderChatBoard() {
    return this.state.activeItem === "default" ? (
      <div>Select an event to chat</div>
    ) : (
      <ChatBoard event={this.state.activeItem} />
    );
  }

  render() {
    return (
      <Grid columns={2}>
        <Grid.Row centered>
          <Grid.Column width={6}>
            <h3>My Events Channels</h3>
            <Menu fluid pointing vertical floated="right">
              {this.renderMyEvents()}
            </Menu>
          </Grid.Column>
          <Grid.Column stretched width={10}>
            {this.renderChatBoard()}
          </Grid.Column>
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
    myEvents: Events.find({ member: Meteor.userId() }).fetch()
  };
})(GroupChat);
