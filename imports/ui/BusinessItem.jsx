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
    this.getRatingImg = this.getRatingImg.bind(this);
    this.displayCategories = this.displayCategories.bind(this);
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

  renderMyEvents() {
    return this.props.myEvents.map(c => (
      <li key={c._id}>
        {c.peopleLimit + " ppl @ " + c.appTime + "  @@  " + c.restaurantName}
      </li>
    ));
  }

  handleClick() {
    //TODO
    console.log("button clicked");
    Meteor.call(
      "events.createNewEvent",
      this.props.content,
      8, //size limit
      "2019/04/30-18:30",
      (err, res) => {
        if (err) {
          //alert("Error calling createEvent");
          console.log("Error calling createEvent    " + err);
          return;
        }

        console.log("return res:    " + JSON.stringify(res));
      }
    );
  }

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
                trigger={<Button primary>Create New Event</Button>}
                style={inlineStyle.modal}
                closeIcon
              >
                <Modal.Header>Create Your Event</Modal.Header>
                <Form size={"tiny"}>
                  <Form.Field>
                    <label>Time to Eat</label>
                    <input placeholder="Time to Eat" />
                  </Form.Field>
                  <Form.Field>
                    <label>Party Size Limit</label>
                    <input type="number" placeholder="Party Size Limit" />
                  </Form.Field>
                  <Form.Field>
                    <Checkbox label="I agree to share food with new friends and have a good time" />
                  </Form.Field>
                  <Button
                    positive
                    type="submit"
                    onClick={this.handleClick.bind(this)}
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

export default withTracker(() => {
  // TODO: error subscribing using props
  Meteor.subscribe("restaurantEvents");

  return {
    myEvents: Events.find({}).fetch()
  };
})(BusinessItem);
