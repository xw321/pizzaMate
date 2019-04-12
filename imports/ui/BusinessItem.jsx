import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Item,
  Message,
  Button,
  Checkbox,
  Form,
  Modal
} from "semantic-ui-react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Events } from "../api/events.js";
import EventItem from "./EventItem.jsx";
import { Card, Image, List } from "semantic-ui-react";
import "../../client/main.css";

const inlineStyle = {
  modal: {
    height: 500,
    marginTop: "0px !important",
    marginLeft: "auto",
    display: "inline-block !important",
    marginRight: "auto",
    marginBottom: "50px",
    position: "relative"
  }
};

// This component returns a Card which consists:
// Basic info about current restaurant;
// (TODO) Event info associated with this restaurant
class BusinessItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peopleLimit: 2,
      appDate: "",
      appTime: "",
      currEvent: null,
      modalOpen: false,
      partySizeError: false,
      timeError: false,
      dateError: false,
      formError: false,
      checked: false,
      errorMessage: "",
      res: []
    };
    this.getTime = this.getTime.bind(this);
    this.getDate = this.getDate.bind(this);
    this.getRatingImg = this.getRatingImg.bind(this);
    this.displayCategories = this.displayCategories.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // get rating star img src based on the rating number
  getRatingImg(rating) {
    let prefix = "yelp-rating/small_";
    let imgArr = [
      "0.png",
      "1.png",
      "1.png",
      "1_half.png",
      "2.png",
      "2_half.png",
      "3.png",
      "3_half.png",
      "4.png",
      "4_half.png",
      "5.png"
    ];

    let index = 2 * rating;
    return prefix + imgArr[index];
  }

  // return a comma-seperated string of current restaurant's categories
  displayCategories() {
    let res = "";

    let n = this.props.content.categories.length;
    for (let i = 0; i < n; i++) {
      res +=
        i === n - 1
          ? this.props.content.categories[i].title
          : this.props.content.categories[i].title + ", ";
    }

    return res;
  }

  onJoin(myEvent) {
    console.log("join called  " + myEvent._id);

    Meteor.call("events.joinEvent", myEvent, (err, res) => {
      if (err) {
        alert("Error Joining");
        console.log(err);
        return;
      }
      //this.setState({ joinButton: "joined!", joinButtonColor: "green" });
      console.log("return from join evt:  " + res);
    });
  }

  renderAddress(addressArr) {
    // let res = "";
    // addressArr.forEach(element => {
    //   res += element + "\n";
    // });
    return (
      <div>
        {addressArr.map((element, i) => {
          return (
            <p className="text-right" key={i++}>
              {element}
            </p>
          );
        })}
      </div>
    );
  }
  renderMyEvents() {
    return this.props.myEvents.map(c => <EventItem key={c._id} myEvent={c} />);
  }
  handleOpen() {
    this.setState({ modalOpen: true });
  }

  handleClose() {
    this.setState({ modalOpen: false });
  }

  handleOnMouseOverOrOut(index) {
    const newRes = this.state.res.slice();
    newRes[index] = !newRes[index];
    this.setState({ res: newRes });
  }

  getDate() {
    let today = new Date();
    let date = today.getFullYear() + "-";
    let mon =
      today.getMonth() + 1 >= 10
        ? today.getMonth() + 1
        : "0" + (today.getMonth() + 1);

    date += mon;
    date += "-" + today.getDate();
    return date;
  }

  getTime() {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes();
    return time;
  }

  handleSubmit() {
    console.log("button clicked-----   " + this.props.content.restaurantName);
    let error = false;

    if (this.state.appTime === "" || this.state.appDate === "") {
      this.setState({ dateError: true });
      error = true;
      console.log("check error 1:   " + error);
    } else if (this.state.appDate < this.getDate()) {
      this.setState({ dateError: true });
      error = true;
      console.log("state date:   " + this.state.appDate);
      console.log("curr date:   " + this.getDate());
      console.log("check error 2:   " + error);
      this.setState({ errorMessage: "Cannot select a past date or time;" });
    } else if (
      this.state.appDate == this.getDate() &&
      this.state.appTime < this.getTime()
    ) {
      this.setState({ timeError: true });
      error = true;
      console.log("check error 3:   " + error);
      this.setState({ errorMessage: "Cannot select a past date or time;" });
    } else {
      this.setState({ timeError: false, dateError: false });
      error = false || error;
      console.log("check error 4:   " + error);
    }

    if (this.state.peopleLimit < 2 || this.state.peopleLimit > 42) {
      this.setState({ partySizeError: true });
      error = true;
      console.log("check error 5:   " + error);
      this.setState({
        errorMessage:
          "Please select a party size number between 2 and 42. (don't ask why)"
      });
    } else {
      this.setState({ partySizeError: false });
      error = false || error;
      console.log("check error 6 -- partySize correct:   " + error);
    }

    if (!this.state.checked) {
      error = true;
      console.log("check error 7:   " + error);
    } else {
      error = false || error;
      console.log("check error :  8  -- checked correct" + error);
    }

    console.log("form error state after validation:" + error);
    ///check if still has error
    if (error) {
      console.log("formError----");
      this.setState({ formError: true });
      return;
    } else {
      console.log("Clean----");
      this.setState({ formError: false });
    }

    Meteor.call(
      "events.createNewEvent",
      this.props.content,
      this.state.peopleLimit,
      this.state.appDate + " " + this.state.appTime,
      (err, res) => {
        if (err) {
          console.log("Error calling createEvent    " + err);
          return;
        }

        this.setState({
          peopleLimit: 2,
          appDate: "",
          appTime: "",
          currEvent: null,
          modalOpen: false,
          partySizeError: false,
          timeError: false,
          dateError: false,
          formError: false,
          checked: false,
          errorMessage: ""
        });
        console.log("return res:    " + JSON.stringify(res));
      }
    );
    this.handleClose();
  }

  render() {
    const className = this.props.isMouseOver ? "res-hover" : "res-item";
    console.log(className);
    return (
      <Card
        fluid
        className={className}
        key={this.props.content._id}
        onMouseOver={() => this.props.changeFunction()}
        onMouseOut={() => this.props.changeFunction()}
      >
        <Card.Content>
          <Card.Header>
            <span floated="left">powered by</span>
            <Image
              src={"imgs/Yelp_trademark_RGB.png"}
              alt="yelp-logo-img"
              size="tiny"
              href="https://www.yelp.com/"
            />
          </Card.Header>
        </Card.Content>
        <Card.Content>
          <Item>
            <Item.Image
              floated="left"
              src={this.props.content.image_url}
              alt="restaurant-profile-img"
              size="small"
            />
            <Item.Extra>
              <div>
                <p className="text-right">{this.props.content.display_phone}</p>
              </div>
              <br />
              {this.renderAddress(this.props.content.location.display_address)}
            </Item.Extra>
          </Item>
        </Card.Content>
        <Card.Content>
          <List className="list-group list-group-flush">
            <List.Item>
              <a href={this.props.content.url}>{this.props.content.name}</a>
            </List.Item>
            <List.Item>
              <img
                src={this.getRatingImg(this.props.content.rating)}
                alt="rating"
              />
              &nbsp;
              <span>{this.props.content.review_count + " reviews"}</span>
            </List.Item>
            <List.Item>Categories: {this.displayCategories()}</List.Item>
            <List.Item>Price: {this.props.content.price}</List.Item>
            <div className="ui divider" />
            {this.renderMyEvents()}
            {this.props.myEvents.length === 0 ? null : (
              <div className="ui divider" />
            )}

            <List.Item>
              <Modal
                trigger={
                  <Button size="small" onClick={this.handleOpen} color={"red"}>
                    Create New Event
                  </Button>
                }
                open={this.state.modalOpen}
                onClose={this.handleClose}
                style={inlineStyle.modal}
                size="tiny"
                closeIcon
              >
                <Modal.Header>Create Your Event</Modal.Header>
                <Modal.Content>
                  <Form size={"tiny"} error={this.state.formError}>
                    {this.state.formError ? (
                      <Message negative>
                        <Message.Header>Opps</Message.Header>
                        {this.state.errorMessage}
                      </Message>
                    ) : null}
                    <Form.Field required>
                      <Form.Input
                        required
                        label="Date to Eat"
                        type="date"
                        min={"2019-01-01"}
                        max={"2030-12-31"}
                        value={this.state.appDate}
                        onChange={e =>
                          this.setState({ appDate: e.target.value })
                        }
                        error={this.state.dateError}
                      />
                    </Form.Field>
                    <Form.Field required>
                      <Form.Input
                        required
                        label="Time to Eat"
                        type="time"
                        min={"00:00"}
                        max={"23:59"}
                        value={this.state.appTime}
                        onChange={e =>
                          this.setState({ appTime: e.target.value })
                        }
                        error={this.state.timeError}
                      />
                    </Form.Field>
                    <Form.Field required>
                      <Form.Input
                        required
                        label="Party Size Limit"
                        type="number"
                        min={2}
                        max={42}
                        value={this.state.peopleLimit}
                        placeholder="Party Size Limit"
                        onChange={e =>
                          this.setState({ peopleLimit: e.target.value })
                        }
                        error={this.state.partySizeError}
                      />
                    </Form.Field>
                    <Form.Field required>
                      <Checkbox
                        required
                        label="I agree to share food with new friends and have a good time"
                        onChange={() =>
                          this.setState({
                            checked: !this.state.checked
                          })
                        }
                      />
                    </Form.Field>
                    <Button
                      positive
                      type="submit"
                      disabled={
                        !this.state.appDate ||
                        !this.state.appTime ||
                        !this.state.peopleLimit ||
                        !this.state.checked
                      }
                      onClick={this.handleSubmit.bind(this)}
                    >
                      Submit
                    </Button>
                  </Form>
                </Modal.Content>
              </Modal>
            </List.Item>
          </List>
        </Card.Content>
      </Card>
    );
  }
}

BusinessItem.propTypes = {
  content: PropTypes.object.isRequired,
  myEvents: PropTypes.arrayOf(PropTypes.object).isRequired,
  isMouseOver: PropTypes.bool,
  changeFunction: PropTypes.func
};

export default withTracker(props => {
  // TODO: error subscribing using props
  Meteor.subscribe("restaurantEvents", props.content);

  return {
    myEvents: Events.find({ restaurantId: props.content.id }).fetch()
  };
})(BusinessItem);
