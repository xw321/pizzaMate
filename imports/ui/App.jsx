import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import NavBar from "./NavBar.jsx";
import MainContainer from "./MainContainer.jsx";
import { withTracker } from "meteor/react-meteor-data";
import "../../client/main.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomepageLayout from "./HomepageLayout.jsx";
import GroupChat from "./GroupChat.jsx";

const HomeComponent = () => {
  return (
    <div className="title col-md-12">
      {Meteor.user() ? <MainContainer /> : <HomepageLayout />}
    </div>
  );
};

const NotFoundPage = () => (
  <div>
    <h2 className="myfont">Opps...Page not found</h2>
    <div />
  </div>
);

const chatPage = () => (
  <div>
    {Meteor.user() ? (
      <GroupChat />
    ) : (
      <h2 className="myfont">Please login first</h2>
    )}
  </div>
);

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <NavBar />
          <Switch>
            <Route exact path="/" component={HomeComponent} />
            <Route exact path="/message" component={chatPage} />
            <Route component={NotFoundPage} />
          </Switch>
          <br />
        </div>
      </Router>
    );
  }
}

export default withTracker(() => {
  return {
    user: Meteor.user()
  };
})(App);
