import React, { Component } from "react";
import { Segment, Label, Image, Feed, Input } from "semantic-ui-react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
//import { Events } from "../api/events.js";
import { Messages } from "../api/messages.js";
import { check } from "meteor/check";
import "../../client/main.css";

class ChatBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ""
    };
  }

  // render chat message info: name, content, picture
  renderOtherChart(myChat) {
    return (
      <Feed.Event key={myChat._id}>
        <Feed.Label>
          <Image src={myChat.user.profile.picture} />
        </Feed.Label>
        <Feed.Content>
          <Feed.Date>{myChat.user.profile.name}</Feed.Date>
          <Feed.Summary>
            <Label basic pointing={"left"}>
              <p>{myChat.message}</p>
            </Label>
          </Feed.Summary>
        </Feed.Content>
      </Feed.Event>
    );
  }

  renderChatInfo() {
    return this.props.chatInfo.map(myChat => {
      return this.renderOtherChart(myChat);
    });
  }

  // update message content
  handleOnChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  // call method to insert new message
  handleKeyPress(event) {
    console.log("message sent: " + this.state.message);
    check(this.state.message, String);
    if (/^\s+$/.test(this.state.message)) {
      return;
    }
    if (event.key === "Enter") {
      Meteor.call(
        "messages.sendMessage",
        this.props.event,
        this.state.message,
        error => {
          if (error !== undefined && error !== null) {
            // show some tips
          } else {
            this.setState({
              message: ""
            });
          }
        }
      );
    }
  }

  // auto-scroll-to-bottom
  scrollToBottom() {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  // auto-scroll-to-bottom
  componentDidMount() {
    this.scrollToBottom();
  }
  // auto-scroll-to-bottom
  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    return (
      <Segment>
        <Segment style={{ overflow: "auto", height: 600 }}>
          {this.props.chatInfo.length === 0 ? (
            <p>No message yet. You guys are SHY.</p>
          ) : (
            <Feed>{this.renderChatInfo()}</Feed>
          )}

          <div
            style={{ float: "left", clear: "both" }}
            ref={el => {
              this.messagesEnd = el;
            }}
          />
        </Segment>
        <Input
          fluid
          icon="send"
          type="text"
          placeholder="message group"
          value={this.state.message}
          onChange={e => this.setState({ message: e.target.value })}
          onKeyPress={e => {
            this.handleKeyPress(e);
          }}
        />
      </Segment>
    );
  }
}

ChatBoard.propTypes = {
  event: PropTypes.string.isRequired,
  chatInfo: PropTypes.array
};
export default withTracker(props => {
  Meteor.subscribe("myMessages", props.event);

  return {
    chatInfo: Messages.find({}).fetch()
  };
})(ChatBoard);
