# meteor-drawing-battle


Project 3 for Web Development course(CS5610) in Northeastern University, Silicon Valley (Spring 2019 semester). You can find the couse web page [here](http://johnguerra.co/classes/webDevelopment_spring_2019/ "CS-5610 Web Development Spring 2019").




This project is made by [Xun Wang](https://xw321.github.io/) and [Yan Zhao](https://yzhao430.github.io/), with :heart:.


## Demo

![](https://github.com/xw321/meteor-drawing-battle/blob/master/demo.png)

You can find the video demo [here](https://youtu.be/iIFxPu_nby8) 

You can play around with the [demo](https://my-drawing-battle.herokuapp.com/)





## Description

A fun real-time drawing battle online game. The game can be played by two registered users in a collaborative yet competitive way.


The game will be played as follows:


* Two users will be given a monochrome sketch at first;


* Then the two players would both paint on an empty canvas together (in two colors, of course), and try to mimic and finish the sketch in a given time.


* When time is up, the one who has more accurate/close drawing “dots” on the canvas will be the winner.


* Users will be rewarded points after each game played.





## Features


* User signup and login.


* System find and match two players together for a game.


* Collaborative and reactive drawing canvas during a game played.


* A page showing current top points players.





## Requires

Meteor

npm

React

Mongo (it defaults to a local Mongo server running on 3001 without auth)

## Usage

Clone the repo, then open the terminal on the folder created and run

```
meteor npm install
meteor
```

then visit (http://localhost:3000) and you should see the app running.

To test play the game locally, you could try open one windwon in chrome, and open another Incongnito chrom window. Register two different players on each window, then you should be able to play two players locally. (You must be bored)

## Database


Do we need this section anymore?




## License




This project is under standard MIT license.
