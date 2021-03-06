import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Popup,
  Button,
  Card,
  Icon,
  Image,
  List,
  Segment
} from "semantic-ui-react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Events } from "../api/events.js";

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.renderMyEvents = this.renderMyEvents.bind(this);
  }

  //return a list of current user's events
  renderMyEvents() {
    return this.props.myEvents.map(c => (
      <List.Item key={c._id}>
        <List.Content>
          <List.Header>
            <a href={c.restaurantUrl} target={"_blank"}>
              {c.restaurantName}
            </a>
          </List.Header>
          <List.Description>
            {"Party of " + c.peopleLimit + ", on "}
            {c.displayDate}
            {", at " + c.displayTime}
          </List.Description>
          {c.status === "booked" ? (
            <Button
              className="new-teal"
              disabled
              icon
              size="mini"
              type="button"
              floated="right"
            >
              Booked!
            </Button>
          ) : (
            <Popup
              trigger={
                <Button
                  icon
                  color="red"
                  size="mini"
                  type="button"
                  floated="right"
                  role="button"
                  aria-label="cancel-button-icon"
                >
                  <Icon name="cancel" />
                </Button>
              }
              on="click"
              content={
                <Segment>
                  <p>Are your sure you want to cancel?</p>
                  <Button
                    className="pinkish"
                    role="button"
                    size="mini"
                    content="Confirm Cancel"
                    onClick={() => this.handleCancel(c)}
                    aria-label="cancel-button"
                  />
                </Segment>
              }
              basic
            />
          )}
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
      <Card fluid color={"red"}>
        <Card.Content>
          <Image
            floated={"right"}
            size={"tiny"}
            src={this.props.content.profile.picture}
            alt="user-profile-img"
          />

          <Card.Header>{this.props.content.profile.name}</Card.Header>
        </Card.Content>

        <Card.Content>
          <Card.Description>My Events:</Card.Description>

          <List
            className="list-group list-group-flush"
            animated
            divided
            verticalAlign="middle"
          >
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
    myEvents: Events.find({ "member.id": Meteor.userId() }).fetch()
  };
})(UserProfile);
