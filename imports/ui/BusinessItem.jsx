import React, { Component } from "react";
import PropTypes from "prop-types";
//import { Button, Checkbox, Form, Modal } from "semantic-ui-react";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Events } from "../api/events.js";

// const inlineStyle = {
//   modal: {
//     marginTop: "0px !important",
//     marginLeft: "auto",
//     marginRight: "auto",
//     marginBottom: "50px",
//     position: "relative"
//   }
// };

// This component returns a Card which consists:
// Basic info about current restaurant;
// (TODO) Event info associated with this restaurant
class BusinessItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peopleLimit: 0,
      appTime: "",
      currEvent: null
    };
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

  onJoin(myEvent) {
    //TODO
    console.log("this.val:   " + myEvent._id);

    Meteor.call("events.joinEvent", myEvent, (err, res) => {
      if (err) {
        alert("Error calling Yelp API");
        console.log(err);
        return;
      }

      console.log("res -- " + res);
    });
  }

  renderMyEvents() {
    return this.props.myEvents.map(c => (
      <li key={c._id}>
        {c.peopleLimit + " people @ " + c.appTime}
        <button
          type="button"
          className="btn btn-info btn-sm"
          onClick={() => this.onJoin(c)}
        >
          Join the Event
        </button>
      </li>
    ));
  }

  handleSubmit(event) {
    const form = event.currentTarget;
    console.log("form obj     " + form);
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({ validated: true });
    //do meteor call here
    console.log("button clicked");
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
  }

  onChange(evt) {
    console.log("change", evt.target.value);
    this.setState({
      peopleLimit: evt.target.value
    });
  }

  onChangeTime(evt) {
    console.log("change", evt.target.value);
    this.setState({
      appTime: evt.target.value
    });
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
              <button
                type="button"
                className="btn btn-primary"
                data-toggle="modal"
                data-target="#exampleModal"
              >
                Create New Event
              </button>

              <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">
                        Create Your Event
                      </h5>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <form onSubmit={e => this.handleSubmit(e)}>
                        <div className="form-group">
                          <label
                            htmlFor="recipient-name"
                            className="col-form-label"
                          >
                            Time to Eat:
                          </label>
                          <input
                            className="form-control"
                            type="datetime-local"
                            placeholder="2019-04-05T18:45:00"
                            id="example-datetime-local-input"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label
                            htmlFor="message-text"
                            className="col-form-label"
                          >
                            People Limit:
                          </label>
                          <input
                            className="form-control"
                            type="number"
                            min="2"
                            id="message-text"
                            required
                            onChange={this.onChange.bind(this)}
                          />
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="defaultCheck1"
                            required
                          />
                          <label
                            className="form-check-label"
                            htmlFor="defaultCheck1"
                          >
                            I agree to share food with new friends and have a
                            good time.
                          </label>
                        </div>
                        <div>
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer" />
                  </div>
                </div>
              </div>
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
