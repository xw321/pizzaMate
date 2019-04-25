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
      <Menu inverted color={Meteor.user() ? "red" : "black"} pointing>
        <Menu.Item
          role="navigation"
          name="  pizzaMate"
          active={this.state.activeItem === "   pizzaMate"}
        >
          <Link to="/">
            <h4 className="pizza-logo">
              <span role="img" aria-label="emoji">
                🍕
              </span>
              pizzaMate
            </h4>
          </Link>
        </Menu.Item>

        {Meteor.user() ? (
          <Menu.Item
            name="mess"
            active={this.state.activeItem === "mess"}
            role="navigation"
          >
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
