import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
//import { NavLink } from "react-router-dom";

import AccountsUIWrapper from "./AccountsUIWrapper.jsx";

export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "default"
    };
  }

  // <div className="">
  //   <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  //     <a className="navbar-brand" href="#">
  //       <span role="img" aria-label="emoji">
  //         🍕
  //       </span>
  //     </a>
  //     <button
  //       className="navbar-toggler"
  //       type="button"
  //       data-toggle="collapse"
  //       data-target="#navbarSupportedContent"
  //       aria-controls="navbarSupportedContent"
  //       aria-expanded="false"
  //       aria-label="Toggle navigation"
  //     >
  //       <span className="navbar-toggler-icon" />
  //     </button>

  //     <div className="collapse navbar-collapse" id="navbarSupportedContent">
  //       <ul className="navbar-nav mr-auto">
  //         <li className="nav-item active">
  //           <NavLink className="nav-link" activeClassName="active" to="/">
  //             <span className="myfont">
  //               <h3>pizzaMate</h3>
  //             </span>{" "}
  //             <span className="nav-link sr-only">(current)</span>
  //           </NavLink>
  //         </li>
  //       </ul>
  //       <AccountsUIWrapper />
  //     </div>
  //   </nav>
  //   <br />
  //   <br />
  // </div>
  render() {
    return (
      <Menu inverted>
        <Menu.Item
          name="  pizzaMate"
          to="/"
          active={this.state.activeItem === "   pizzaMate"}
          onClick={() => this.setState({ activeItem: "   pizzaMate" })}
        >
          <span role="img" aria-label="emoji">
            🍕
          </span>
          <span id="pizza">pizzaMate</span>
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <AccountsUIWrapper />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}
