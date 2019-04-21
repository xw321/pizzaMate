import React, { Component } from "react";
// import NavBar from "./NavBar.jsx";
//import "semantic-ui-css/semantic.min.css";

import AccountsUIWrapper from "./AccountsUIWrapper.jsx";

import {
  Container,
  Header,
  Segment,
  Grid,
  List,
  Icon,
  Button
} from "semantic-ui-react";

import "../style/App.css";
import "../../client/main.css";

class HomepageLayout extends Component {
  render() {
    return (
      <div className="App">
        <Segment id="big-bg" inverted vertical textAlign="center">
          <Container className="content">
            <Header inverted as="h1">
              Single is terrible.
            </Header>
            <Header inverted as="h1">
              Meet new friends by joining or creating new food-sharing event.
            </Header>

            <AccountsUIWrapper />
          </Container>
          <Segment className="seg" vertical as="footer" />
        </Segment>
        <Segment inverted vertical style={{ padding: "5em 0em" }}>
          <Container>
            <Grid textAlign={"center"} divided inverted stackable centered>
              <Grid.Row textAlign={"center"}>
                <Grid.Column width={3}>
                  <Header inverted as="h4" content="About" />
                  <List link inverted>
                    <List.Item as="a">Sitemap</List.Item>
                  </List>
                </Grid.Column>

                <Grid.Column width={7} textAlign={"center"}>
                  <Header as="h4" inverted>
                    Made by <a href="https://xw321.github.io/">Xun</a> and{" "}
                    <a href="https://yzhao430.github.io/">Yan</a>.
                  </Header>
                </Grid.Column>
                <Grid.Column width={3}>
                  <Header inverted as="h4">
                    <a
                      href="https://github.com/xw321/pizzaMate"
                      target={"_blank"}
                    >
                      <Button secondary>
                        <Icon name="github" />
                        Source
                      </Button>
                    </a>
                  </Header>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>
      </div>
    );
  }
}

export default HomepageLayout;
