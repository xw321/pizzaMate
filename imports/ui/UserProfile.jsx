import React, { Component } from "react";
import PropTypes from "prop-types";
import { Card, Icon, Image } from "semantic-ui-react";
//import { Meteor } from "meteor/meteor";

export default class UserProfile extends Component {
  constructor(props) {
    super(props);
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
          <Card.Description>Joined Events:</Card.Description>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Cras justo odio</li>
            <li className="list-group-item">Dapibus ac facilisis in</li>
            <li className="list-group-item">Vestibulum at eros</li>
          </ul>
        </Card.Content>
      </Card>
    );
  }
}

UserProfile.propTypes = {
  content: PropTypes.PropTypes.object.isRequired
};
