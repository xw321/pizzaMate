import React, { Component } from "react";

import { NavLink } from "react-router-dom";

import AccountsUIWrapper from "./AccountsUIWrapper.jsx";

export default class NavBar extends Component {
  render() {
    return (
      <div className="px-5 mx-5">
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-3 mx-5">
          <a className="navbar-brand" href="#">
            <span role="img" aria-label="heart emoji">
              🎨
            </span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <NavLink className="nav-link" activeClassName="active" to="/">
                  <span className="myfont">Home</span>{" "}
                  <span className="nav-link sr-only">(current)</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  activeClassName="active"
                  to="/top"
                >
                  &nbsp;&nbsp;&nbsp; <span className="myfont">Top Players</span>
                </NavLink>
              </li>
            </ul>
            <AccountsUIWrapper />
          </div>
        </nav>
      </div>
    );
  }
}
