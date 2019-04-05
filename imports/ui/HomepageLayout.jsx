import React, { Component } from "react";
// import NavBar from "./NavBar.jsx";
//import "semantic-ui-css/semantic.min.css";

import { Container, Header, Segment } from "semantic-ui-react";

import "./App.css";

class HomepageLayout extends Component {
  render() {
    return (
      <div className="App">
        <Segment inverted vertical textAlign="center">
          <Container className="content">
            <Header inverted as="h1">
              Pizza Mate
            </Header>
            <p>
              Single is terrible. Meet new friends by joining or creating new
              food-sharing event.
            </p>
            {/* <Button size="huge">Learn more</Button> */}
          </Container>
          <Segment inverted vertical as="footer">
            Made by <a href="https://xw321.github.io/">Xun</a> and{" "}
            <a href="https://yzhao430.github.io/">Yan</a>.
          </Segment>
        </Segment>
      </div>
    );
  }
}

export default HomepageLayout;
