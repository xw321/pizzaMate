import React, { Component } from "react";
import PropTypes from "prop-types";

// This component returns a Card which consists:
// Basic info about current restaurant;
// (TODO) Event info associated with this restaurant
export default class BusinessItem extends Component {
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

  render() {
    return (
      <div className="card">
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
          </ul>
        </div>
      </div>
    );
  }
}

BusinessItem.propTypes = {
  content: PropTypes.PropTypes.object.isRequired
};
