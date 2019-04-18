import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";

import AccountsUIWrapper from "./AccountsUIWrapper.jsx";

export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "default"
    };
  }

  render() {
    return (
      // <Segment color={"red"} inverted size={"mini"}>
      <Menu color={Meteor.user() ? "red" : "grey"} inverted pointing secondary>
        <Menu.Item
          name="  pizzaMate"
          active={this.state.activeItem === "   pizzaMate"}
        >
          <Link to="/" id="pizza">
            <h4 id="pizza">
              <span role="img" aria-label="emoji">
                🍕
              </span>
              pizzaMate
            </h4>
          </Link>
        </Menu.Item>

        {Meteor.user() ? (
          <Menu.Item name="mess" active={this.state.activeItem === "mess"}>
            <Link to="/message">
              <h4>Message</h4>
            </Link>
          </Menu.Item>
        ) : null}

        <Menu.Menu position="right">
          <Menu.Item>
            <AccountsUIWrapper />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}
