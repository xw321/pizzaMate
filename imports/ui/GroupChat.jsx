import React, { Component } from "react";
import { Grid } from "semantic-ui-react";

import "../../client/main.css";

export default class GroupChat extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid columns={2}>
        <Grid.Row centered>
          <Grid.Column width={4}>first</Grid.Column>
          <Grid.Column width={12}>second</Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
