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
        <Container
          fluid
          className={
            window.innerWidth > window.innerHeight ? "big-bg" : "big-bg-vert"
          }
          textAlign="center"
        >
          <Container className="content">
            <Header
              inverted
              as="h1"
              color={window.innerWidth > window.innerHeight ? null : "red"}
            >
              Single is terrible.
            </Header>
            <Header
              inverted
              as="h1"
              color={window.innerWidth > window.innerHeight ? null : "red"}
            >
              Meet new friends by joining or creating new food-sharing event.
            </Header>
          </Container>
        </Container>
        <Segment inverted vertical style={{ padding: "2em 0em" }}>
          <Container>
            <Grid inverted stackable centered>
              <Grid.Row>
                <Grid.Column width={3} textAlign={"center"} />
                <Grid.Column width={10} textAlign={"center"}>
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
                <Grid.Column textAlign={"center"} width={3} />
              </Grid.Row>
            </Grid>
          </Container>
        </Segment>
      </div>
    );
  }
}

export default HomepageLayout;
