import React, { Component } from "react";
import {
  Container,
  Header,
  Segment,
  Grid,
  Icon,
  Button
} from "semantic-ui-react";
// import NavBar from "./NavBar.jsx";
//import "semantic-ui-css/semantic.min.css";

// import AccountsUIWrapper from "./AccountsUIWrapper.jsx";
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
          </Container>
        </Segment>
        <Segment inverted centered vertical style={{ padding: "2em 0em" }}>
          <Container>
            <Grid divided inverted stackable centered>
              <Grid.Row>
                <Grid.Column textAlign={"center"} width={3}>
                  <Header inverted as="h4" content="About" />
                </Grid.Column>
                <Grid.Column width={7} textAlign={"center"}>
                  <Header as="h4" inverted>
                    Made by{" "}
                    <a href="https://xw321.github.io/" target={"_blank"}>
                      Xun
                    </a>{" "}
                    and{" "}
                    <a href="https://yzhao430.github.io/" target={"_blank"}>
                      Yan
                    </a>
                  </Header>
                </Grid.Column>
                <Grid.Column textAlign={"center"} width={3}>
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
