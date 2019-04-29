# pizzaMate

Project 4 (and 5) for Web Development course(CS5610) in Northeastern University, Silicon Valley (Spring 2019 semester). You can find the couse web page [here](http://johnguerra.co/classes/webDevelopment_spring_2019/ "CS-5610 Web Development Spring 2019").

This project is made by [Xun Wang](https://xw321.github.io/) and [Yan Zhao](https://yzhao430.github.io/), with :heart:.

## Demo

![](https://github.com/xw321/pizzaMate/blob/master/demo.png)

You can find the video demo [here](https://www.youtube.com/watch?v=chpMIP6mXZg&feature=youtu.be) 

You can play around with the [demo](https://pizzamate.herokuapp.com/)

You can see google slides for presentation [here](https://docs.google.com/presentation/d/1yFoyAzsKUo4VTTYOXizdb74unP6tbJOBRv0ttpENku4/edit#slide=id.g559317a0f8_0_47)

## Description

A food sharing website that gives solution to people who don't want to eat alone.

The project idea came from troubles we faced in real life. Often times we found it difficult to sit down and have a nice meal with friends because everyone has different schudles, and some friends were not into certain types of food. Sometimes we desperately want to have some Hotpot or Korean BBQ, which really make no sense if you eat them alone.

So, we think why not have a platform to help those who like food but don't like eating alone, and let people enjoy food together and meet each other. 

## Usability Study

[Usability Report](https://github.com/xw321/pizzaMate/blob/master/imports/README.md)

## Features

- User login via Google.

* Yelp API for searching local restaurants.

- Mapbox visualizing restaurants

* Create/join an event associated with a restaurant in local or specified area

* Group Chat after joining an event

## Design of MongoDB


Collection Name：events 


| column | data type| description |
|-------|-----|------|
| _id | string | event id |
| owner | string | event owner's userId |
| status | string | status of the event |
| isFull | boolean | whether the event is full |
| member | array of object | member registered for the event. Each element in array has two fields: `id`, string, user ID; `vote`, number, indicating what the user voted for this event (going or cancel) |
| appTime | object | JavaScript Date object, indicating the event appointment time |
| displayTime | string | event appointment time |
| displayDate | string | event appointment date |
| restaurantId | string | restaurant id |
| restaurantName | string | name of restaurant |
| peopleLimit | string | event party size limit |


Collection Name：users


| column | data type| description |
|-------|-----|------|
| _id | string | user id |
| services | object | google profile auto-created by google API|
| profile | object | google profile, and other customed fields |
| status | object | online or not, auto-created by a package which monitoring user status |


Collection Name：messages


| column | data type| description |
|-------|-----|------|
| _id | string | default message id |
| event | string | event._id; indicating where this message is placed |
| user | object | the user who sent this message |
| message | string | message content |
| createAt | string | time when the message was sent |



## Requires

Meteor

npm

React

Mongo (it defaults to a local Mongo server running on 3001 without auth)

## Usage

This project uses some APIs which require clinetID and API keys. For obvious reasons, we put them in an unpublished file `settings.json`

You can request these API credentials youself and put them in the  `settings.json` file. You can access them in the server by using `Meteor.settings.YOUR_DATA_FIELD`.


After setting these up, you should be ready to use all features prodied in this project. Clone the repo, then open the terminal on the folder created and run

```
meteor npm install
meteor --settings settings.json
```

then visit (http://localhost:3000) and you should see the app running.

## License

This project is under standard MIT license.
