import React, { Component } from "react";
import NavBar from "./NavBar.jsx";
//import "semantic-ui-css/semantic.min.css";

import { Button, Container, Header, Segment } from "semantic-ui-react";

import "./App.css";

class HomepageLayout extends Component {
  render() {
    return (
      <div className="App">
        <Segment inverted vertical textAlign="center">
          <NavBar />
          <Container className="content">
            <Header inverted as="h1">
              Cover your page.
            </Header>
            <p>
              Cover is a one-page template for building simple and beautiful
              home pages. Download, edit the text, and add your own fullscreen
              background photo to make it your own.
            </p>
            <Button size="huge">Learn more</Button>
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
