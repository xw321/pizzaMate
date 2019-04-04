import React, { Component } from "react";

class NewEventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointmentTime: "",
      partySizeLimit: 0
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ partySizeLimit: event.target.value });
  }

  handleSubmit(event) {
    //console.log("evt:   " + JSON.stringify(event));
    alert("A name was submitted: " + this.state.partySizeLimit);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Time to Eat:
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        <label>
          Party Size Limit:
          <input
            type="number"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default NewEventForm;
