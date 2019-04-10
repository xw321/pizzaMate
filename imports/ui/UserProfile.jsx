import React, { Component } from "react";
import PropTypes from "prop-types";
import { Popup, Button, Card, Icon, Image, List } from "semantic-ui-react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Events } from "../api/events.js";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.renderMyEvents = this.renderMyEvents.bind(this);
  }

  renderMyEvents() {
    console.log("my props.events:  " + this.props.myEvents.length);
    return this.props.myEvents.map(c => (
      <List.Item key={c._id}>
        <List.Icon name="food" />
        <List.Content>
          <a href="/message">{c.restaurantName + " @ " + c.appTime}</a>
          <Popup
            trigger={
              <Button
                icon
                color="red"
                size="tiny"
                type="button"
                floated="right"
                onClick={() => this.handleCancel(c)}
              >
                <Icon name="cancel" />
              </Button>
            }
            content="Cancel this event"
            basic
          />
        </List.Content>
      </List.Item>
    ));
  }

  handleCancel(myEvent) {
    console.log("cancel called  " + myEvent._id);

    Meteor.call("events.leaveEvent", myEvent, (err, res) => {
      if (err) {
        alert("Error leaving");
        console.log(err);
        return;
      }

      console.log(res);
    });
  }

  render() {
    return (
      <Card fluid>
        <Card.Content>
          <Card.Header>My profile</Card.Header>
        </Card.Content>

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
          {/* <Card.Description>Events I created:</Card.Description>
          <List className="list-group list-group-flush">
            {this.renderMyEvents()}
          </List>
          <div className="ui divider" /> */}
          <Card.Description>My Events:</Card.Description>
          <List key={"listevent"} className="list-group list-group-flush">
            {this.renderMyEvents()}
          </List>
        </Card.Content>
      </Card>
    );
  }
}
// add subscribe
UserProfile.propTypes = {
  content: PropTypes.PropTypes.object.isRequired,
  myEvents: PropTypes.arrayOf(PropTypes.object).isRequired
};
export default withTracker(() => {
  Meteor.subscribe("MyEvents");

  return {
    myEvents: Events.find({ member: Meteor.userId() }).fetch()
  };
})(UserProfile);
