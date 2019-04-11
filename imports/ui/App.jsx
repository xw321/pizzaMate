import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import NavBar from "./NavBar.jsx";
//import CanvasPaint from "./CanvasPaint.jsx";
import MainContainer from "./MainContainer.jsx";
import { withTracker } from "meteor/react-meteor-data";
import "../../client/main.css";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomepageLayout from "./HomepageLayout.jsx";
// <div>
//   <div>
//     <h1 className="myfont"> Drawing Battle</h1>
//   </div>
//   <div className="frontText">
//     <p className="myfont">
//       Try your drawing skills by imitating the sketch
//     </p>
//   </div>
//   <div className="g-signin2" data-onsuccess="onSignIn"></div>

//   <div className="back">
//     <img
//       src={"imgs/6.jpeg"}
//       height="85%"
//       width="100%"
//       alt="frontpage"
//     />
//   </div>
// </div>
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

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <NavBar />
          <Switch>
            <Route exact path="/" component={HomeComponent} />
            {/* <Route exact path="/play/" component={PlayComponent} /> */}
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
