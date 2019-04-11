import React, { Component } from "react";
import { Segment, Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

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
      <Segment inverted size={"mini"}>
        <Menu inverted pointing secondary>
          <Menu.Item
            name="  pizzaMate"
            active={this.state.activeItem === "   pizzaMate"}
          >
            <Link to="/" id="pizza">
              pizzaMate
            </Link>
          </Menu.Item>
          <Menu.Item name="mess" active={this.state.activeItem === "mess"}>
            <Link to="/message">Message</Link>
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <AccountsUIWrapper />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </Segment>
    );
  }
}
