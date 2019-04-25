import React, { Component } from "react";
import {
  Segment,
  Button,
  Label,
  Image,
  Feed,
  Input,
  Popup,
  Container,
  Icon,
  Message
} from "semantic-ui-react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import { Meteor } from "meteor/meteor";
//import { Events } from "../api/events.js";
import { Messages } from "../api/messages.js";
import { check } from "meteor/check";
import "../../client/main.css";
import { Events } from "../api/events.js";

class ChatBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      isOpen: false,
      voted: false,
      bigPopupIsOpen: false
    };
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

  handleOpen() {
    this.setState({ isOpen: true });

    this.timeout = setTimeout(() => {
      this.setState({ isOpen: false });
    }, 3500);
  }

  handleClose() {
    this.setState({ isOpen: false });
    clearTimeout(this.timeout);
  }
  // render chat message info: name, content, picture
  renderOtherChart(myChat) {
    return (
      <Feed.Event key={myChat._id}>
        <Feed.Label>
          <Image src={myChat.user.profile.picture} />
        </Feed.Label>
        <Feed.Content>
          <Feed.Date>
            {myChat.user.profile.name}
            {myChat.user._id === Meteor.userId() ? " (you)" : " "}
          </Feed.Date>
          <Feed.Summary>
            <Label className="chat-label" basic pointing={"left"}>
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

  didIVote() {
    console.log("called here--didIvote");
    for (let i = 0; i < this.props.currEventObj.member.length; i++) {
      if (
        this.props.currEventObj.member[i].id === Meteor.userId() &&
        this.props.currEventObj.member[i].vote !== -1
      ) {
        console.log("i voted:" + this.props.currEventObj.member[i].vote);
        return true;
      }
    }
    return false;
  }

  allVoted() {
    for (let i = 0; i < this.props.currEventObj.member.length; i++) {
      if (this.props.currEventObj.member[i].vote === -1) {
        return false;
      }
    }
    return true;
  }

  numberOfVotes() {
    let res = 0;
    for (let i = 0; i < this.props.currEventObj.member.length; i++) {
      if (this.props.currEventObj.member[i].vote !== -1) {
        res++;
      }
    }
    return res;
  }

  allVotedYes() {
    for (let i = 0; i < this.props.currEventObj.member.length; i++) {
      if (this.props.currEventObj.member[i].vote !== 1) {
        console.log("some voted -1");
        return false;
      }
    }
    if (
      this.props.currEventObj.isFull &&
      this.props.currEventObj.member.length ===
        this.props.currEventObj.peopleLimit
    ) {
      console.log("ALL voted 1");
      return true;
    } else {
      return false;
    }
  }

  handleBook(evt) {
    evt.preventDefault();
    // change event status to "booking", which indicates there is a voting for finalizing event
    Meteor.call("events.booking", this.props.currEventObj._id);

    setTimeout(
      function() {
        this.setState({ bigPopupIsOpen: false });
      }.bind(this),
      2000
    );
    /*
    after clicking the button, all member in the group should have a message leting user choose confim going or not;


    Flow is like this:
    - call method, then voting button pop up;
    - Within a time frame, ideally, waiting for all member voted, then trigger check funcion;
        - if at least one user choose not to go, remove that user from group by calling "leaveEvent" method, 
          set back the event status, and isFull flag;
        - if all user choose CONFIRM, prompt payment window, if payment success, call the send email method, 
          and set the "let's book" button to disabled "BOOKED!" button, change event status to "booked";
    */
  }

  // para: isGoing is a bool, TRUE means going to book, false otherwise
  // call methods and update member's vote
  handleVote(evt, isGoing) {
    evt.preventDefault();
    this.setState({ voted: true });

    if (isGoing) {
      //do things
      Meteor.call("events.vote", this.props.currEventObj._id, 1, (err, res) => {
        if (err) {
          alert("Error vote");
          console.log(err);
          return;
        }

        console.log("return from join evt:  " + res);
      });
    } else {
      // do other things
      Meteor.call("events.vote", this.props.currEventObj._id, 0, (err, res) => {
        if (err) {
          alert("Error vote");
          console.log(err);
          return;
        }

        console.log("return from join evt:  " + res);
      });
      //Meteor.call("events.leaveEvent", this.props.currEventObj);
    }
    //alert("book reservation feature - coming soon!");
  }

  finalizeBooking() {
    // call method, set status to "booked", and sent email
    if (
      this.allVoted() &&
      this.allVotedYes() &&
      this.props.currEventObj.status !== "booked"
    ) {
      console.log("send confim email here");
      console.log("event detail:" + JSON.stringify(this.props.currEventObj));
      Meteor.call("events.booked", this.props.currEventObj._id);
    }
  }

  handleFailedVoting() {
    // call method, remove who voted 0, set isFull to false, set status to "ongoing"
    setTimeout(
      function() {
        Meteor.call("events.bookingFailed", this.props.currEventObj._id);
      }.bind(this),
      5000
    );
  }

  render() {
    return (
      <Segment>
        <Container textAlign={"center"}>
          <Label className={this.props.currEventObj.isFull ? "new-teal" : null}>
            <Icon name="user" />
            {this.props.currEventObj.member.length +
              "/" +
              this.props.currEventObj.peopleLimit}
          </Label>
        </Container>
        <Segment style={{ overflow: "auto", height: 500 }}>
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
        {!this.props.currEventObj.isFull ? (
          <p />
        ) : this.allVoted() && this.allVotedYes() ? (
          <Message icon positive>
            <Icon name="check" />
            <Message.Content>
              <Message.Header>
                All member voted and event is booked.
              </Message.Header>
              Check your email for confirmation. (Also check your spam!)
              {this.finalizeBooking()}
            </Message.Content>
          </Message>
        ) : this.allVoted() && !this.allVotedYes() ? (
          <Message>
            <Message.Header>
              All member voted,but some voted NOT TO COME.
            </Message.Header>
            We will have to remove who voted NO and wait for the event to be
            full again.
            {this.handleFailedVoting()}
          </Message>
        ) : this.didIVote() ? (
          <Message>
            Waiting for group to vote... Currently {this.numberOfVotes()} of{" "}
            {this.props.currEventObj.peopleLimit} voted.
            <Button
              className="new-teal"
              disabled
              size={"tiny"}
              floated={"right"}
              content={"Vooted!"}
            />
          </Message>
        ) : this.props.currEventObj.status === "booking" ? (
          <Message icon>
            <Icon name="circle notched" loading />
            <Message.Content>
              <Message.Header> Waiting for group to vote... </Message.Header>
              Currently {this.numberOfVotes()} of{" "}
              {this.props.currEventObj.peopleLimit} voted.
              <Button.Group floated="right" size="tiny">
                <Button
                  size="tiny"
                  disabled={this.didIVote()}
                  className="new-teal"
                  onClick={e => {
                    this.handleVote(e, true);
                  }}
                >
                  Book!
                </Button>
                <Button.Or />
                <Button
                  size="tiny"
                  className="pinkish"
                  disabled={this.didIVote()}
                  onClick={e => {
                    this.handleVote(e, false);
                  }}
                >
                  Im not ready
                </Button>
              </Button.Group>
            </Message.Content>
          </Message>
        ) : null}
        <Input
          fluid
          aria-label="message-input"
          action={
            this.props.currEventObj.status === "booked" ? (
              <Button
                disabled
                className="new-teal"
                icon="calendar check"
                content="Booked!"
              />
            ) : this.props.currEventObj.isFull ? (
              <Popup
                trigger={
                  <Button
                    disabled={this.props.currEventObj.status === "booking"}
                    className="new-teal"
                    icon="calendar check"
                    content="Let's Book!"
                  />
                }
                on="click"
                open={this.state.bigPopupIsOpen}
                onClose={() => this.setState({ bigPopupIsOpen: false })}
                onOpen={() => this.setState({ bigPopupIsOpen: true })}
                content={
                  <Segment>
                    <p>
                      You are about to start a vote in the group. Once all
                      members agree to book, each member will place a deposit
                      for reserving this event. There will be NO refund if you
                      want to cancel. Are your sure you want to proceed?
                    </p>
                    <Button
                      className="new-teal"
                      content="Confirm"
                      onClick={e => {
                        this.handleBook(e);
                      }}
                    />
                  </Segment>
                }
                basic
              />
            ) : (
              <Popup
                trigger={<Button icon="calendar check" content="Let's Book!" />}
                on="click"
                open={this.state.isOpen}
                onClose={this.handleClose.bind(this)}
                onOpen={this.handleOpen.bind(this)}
                content={
                  "You can start to book a reservation when the group is full."
                }
                basic
              />
            )
          }
          type="text"
          placeholder="Message group"
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
  chatInfo: PropTypes.array,
  currEventObj: PropTypes.object
};
export default withTracker(props => {
  Meteor.subscribe("myMessages", props.event);
  Meteor.subscribe("currEventObj", props.event);

  return {
    chatInfo: Messages.find({}).fetch(),
    currEventObj: Events.find({ _id: props.event }).fetch()[0]
  };
})(ChatBoard);
