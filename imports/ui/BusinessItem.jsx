import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Checkbox, Form, Modal } from "semantic-ui-react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Events } from "../api/events.js";

const inlineStyle = {
  modal: {
    marginTop: "0px !important",
    marginLeft: "auto",
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
      peopleLimit: -1,
      appTime: "1970-01-01",
      currEvent: null,
      modalOpen: false
    };
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
    //TODO
    // console.log("this.val:   " + myEvent._id);

    Meteor.call("events.joinEvent", myEvent, (err, res) => {
      if (err) {
        alert("Error Joining");
        console.log(err);
        return;
      }

      console.log(res);
    });
  }

  renderMyEvents() {
    return this.props.myEvents.map(c => (
      <li key={c._id}>
        {c.peopleLimit + " people @ " + c.appTime}
        <button
          type="button"
          className="btn btn-info btn-sm float-right"
          onClick={() => this.onJoin(c)}
        >
          Join the Event
        </button>
      </li>
    ));
  }
  handleOpen() {
    this.setState({ modalOpen: true });
  }

  handleClose() {
    this.setState({ modalOpen: false });
  }

  handleSubmit() {
    // event.preventDefault();
    // const form = event.currentTarget;
    // console.log("form obj     " + form);
    // if (form.checkValidity() === false) {
    //   event.preventDefault();
    //   event.stopPropagation();
    // }
    // this.setState({ validated: true });
    //do meteor call here
    console.log("button clicked-----   " + this.props.content.restaurantName);
    Meteor.call(
      "events.createNewEvent",
      this.props.content,
      this.state.peopleLimit,
      this.state.appTime,
      (err, res) => {
        if (err) {
          console.log("Error calling createEvent    " + err);
          return;
        }

        console.log("return res:    " + JSON.stringify(res));
      }
    );
    this.handleClose();
  }

  // onChange(evt) {
  //   console.log("change", evt.target.value);
  //   this.setState({
  //     peopleLimit: evt.target.value
  //   });
  // }

  // onChangeTime(evt) {
  //   console.log("change", evt.target.value);
  //   this.setState({
  //     appTime: evt.target.value
  //   });
  // }

  render() {
    return (
      <div className="card">
        <div className="card-header">
          {" "}
          <a href="https://www.yelp.com/">
            <img
              className="float-left pr-3"
              src={"imgs/Yelp_trademark_RGB.png"}
              alt="yelp-logo-img"
              height="15%"
              width="15%"
            />
          </a>
        </div>
        <div className="card-body">
          <img
            className="float-left pr-3"
            src={this.props.content.image_url}
            alt="restaurant-profile-img"
            height="30%"
            width="30%"
          />

          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <a href={this.props.content.url}>{this.props.content.name}</a>
            </li>
            <li className="list-group-item">
              <img
                src={this.getRatingImg(this.props.content.rating)}
                alt="rating"
              />
              &nbsp;
              <span>{this.props.content.review_count + " reviews"}</span>
            </li>
            <li className="list-group-item">
              Categories: {this.displayCategories()}
            </li>
            <li className="list-group-item">
              Price: {this.props.content.price}
            </li>
            <li className="list-group-item">
              Location: {this.props.content.location.display_address}
            </li>
            <li className="list-group-item">
              Phone: {this.props.content.display_phone}
            </li>
            {this.renderMyEvents()}
            <li className="list-group-item">
              <Modal
                trigger={
                  <Button onClick={this.handleOpen} primary>
                    Create New Event
                  </Button>
                }
                open={this.state.modalOpen}
                onClose={this.handleClose}
                style={inlineStyle.modal}
                size="tiny"
                closeIcon
              >
                <Modal.Header>
                  Create Your Event (Sorry for the ugly form, we will fix it
                  next week :(
                </Modal.Header>{" "}
                <div className="ui divider" /> <div className="ui divider" />
                <Form size={"tiny"}>
                  <Form.Field required>
                    <label>Time to Eat</label>
                    <input
                      type="datetime-local"
                      onChange={e => this.setState({ appTime: e.target.value })}
                    />
                  </Form.Field>
                  <Form.Field required>
                    <label>Party Size Limit</label>
                    <input
                      type="number"
                      min={5}
                      placeholder="Party Size Limit"
                      onChange={e =>
                        this.setState({ peopleLimit: e.target.value })
                      }
                    />
                  </Form.Field>
                  <Form.Field required>
                    <Checkbox
                      required
                      label="I agree to share food with new friends and have a good time"
                    />
                  </Form.Field>
                  <Button
                    positive
                    type="submit"
                    onClick={this.handleSubmit.bind(this)}
                  >
                    Submit
                  </Button>
                </Form>
              </Modal>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

BusinessItem.propTypes = {
  content: PropTypes.PropTypes.object.isRequired,
  myEvents: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default withTracker(props => {
  // TODO: error subscribing using props
  Meteor.subscribe("restaurantEvents", props.content);

  return {
    myEvents: Events.find({ restaurantId: props.content.id }).fetch()
  };
})(BusinessItem);
