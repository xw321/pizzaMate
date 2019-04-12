import React, { Component } from "react";
// import NavBar from "./NavBar.jsx";
//import "semantic-ui-css/semantic.min.css";

import { Container, Header, Segment } from "semantic-ui-react";

import "../style/App.css";
import "../../client/main.css";

class HomepageLayout extends Component {
  render() {
    return (
      <div className="App">
        <Segment inverted vertical textAlign="center">
          <Container className="content">
            <Header inverted as="h1">
              Single is terrible.
            </Header>
            <Header inverted as="h1">
              Meet new friends by joining or creating new food-sharing event.
            </Header>

            {/* <Button size="huge">Learn more</Button> */}
          </Container>
          <Segment className="seg" vertical as="footer">
            Made by <a href="https://xw321.github.io/">Xun</a> and{" "}
            <a href="https://yzhao430.github.io/">Yan</a>.
          </Segment>
        </Segment>
      </div>
    );
  }
}

export default HomepageLayout;
