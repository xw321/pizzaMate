import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, Icon, Image, List } from "semantic-ui-react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Events } from "../api/events.js";

class UserProfile extends Component {
  constructor(props) {
    super(props);
  }

  renderMyEvents() {
    return this.props.myEvents.map(c => (
      <List.Item key={c._id}>{c.restaurantName + " @ " + c.appTime}</List.Item>
    ));
  }

  renderJoinedEvents() {
    return this.props.joinedEvents.map(c => (
      <List.Item key={c._id}>{c.restaurantName + " @ " + c.appTime}</List.Item>
    ));
  }

  render() {
    return (
      <Card>
        <Card.Header>My profile</Card.Header>
        <Image
          src={this.props.content.profile.picture}
          alt="user-profile-img"
        />
        <Card.Content>
          <Card.Description>
            <Icon name="user" />
            {this.props.content.profile.name}
          </Card.Description>
          <div className="ui divider" />
          <Card.Description>Events I created:</Card.Description>
          <List className="list-group list-group-flush">
            {this.renderMyEvents()}
          </List>
          <div className="ui divider" />
          <Card.Description>Events I Joined:</Card.Description>
          <List className="list-group list-group-flush">
            {this.renderJoinedEvents()}
          </List>
        </Card.Content>
      </Card>
    );
  }
}
// add subscribe
UserProfile.propTypes = {
  content: PropTypes.PropTypes.object.isRequired,
  myEvents: PropTypes.arrayOf(PropTypes.object).isRequired,
  joinedEvents: PropTypes.arrayOf(PropTypes.object).isRequired
};
export default withTracker(() => {
  Meteor.subscribe("MyEvents");

  //TODO: wrong info displayed
  return {
    myEvents: Events.find({ owner: this.userId }).fetch(),
    joinedEvents: Events.find({ owner: { $ne: this.userId } }).fetch()
  };
})(UserProfile);
