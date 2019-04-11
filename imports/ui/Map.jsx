import React, { Component } from "react";
import ReactMapGL, { NavigationControl, Marker } from "react-map-gl";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
//import CityPin from "./city-pin.jsx";
import "mapbox-gl/dist/mapbox-gl.css";
import { Meteor } from "meteor/meteor";
//import mapConfig from "./mapConfig.jsx";
//import { Meteor } from "meteor/meteor";
import "../../client/main.css";


const degreeToPixels = [ { zoom: 0, pixels: 1.7492 }, { zoom: 1, pixels: 3.4984 }, { zoom: 2, pixels: 6.9968 }, { zoom: 3, pixels: 13.9936 },
  { zoom: 4, pixels: 27.9872 }, { zoom: 5, pixels: 55.9744 }, { zoom: 6, pixels: 111.9488 }, { zoom: 7, pixels: 223.8976 },
  { zoom: 8, pixels: 447.7952 }, { zoom: 9, pixels: 895.5904 }, { zoom: 10, pixels: 1791.1808 }, { zoom: 11, pixels: 3582.3616 },
  { zoom: 12, pixels: 7164.7232 }, { zoom: 13, pixels: 14329.4464 }, { zoom: 14, pixels: 28658.8928 }, { zoom: 15, pixels: 57317.7856 },
  { zoom: 16, pixels: 114635.5712 }, { zoom: 17, pixels: 229271.1424 }, { zoom: 18, pixels: 458542.2848 }, { zoom: 19, pixels: 917084.5696 },
  { zoom: 20, pixels: 1834169.1392 }, { zoom: 21, pixels: 3668338.2784 }, { zoom: 22, pixels: 7336676.5568 }, { zoom: 23, pixels: 14673353.1136 },
  { zoom: 24, pixels: 29346706.2272 }];

const TOKEN =
  "pk.eyJ1IjoiYWRvdWRvdSIsImEiOiJjanUyMWg4cW0wN3FsM3lwY2dyNTJsb3h0In0.sdXoWdlnsVa3oUEZ-BEfLw";

const mapStyle = { position: "absolute", top: 36, left: 0, padding: "10px" };
class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      res: [],
      search: false,
      searchField:"",
      viewport: {
        latitude: 37.3355,
        longitude: -121.8930,
        zoom: 12,
        bearing: 0,
        pitch: 0,
        width: 600,
        height: 600
      },
      currentLat: 0.0,
      currentLon: 0.0,
      popupInfo: null,
      token: "",
      markers: [],
    };
    this.yRange = [];
    this.xRange = [];
    console.log("constructor");
  }

  // componentDidMount() {
  //   this.renderMarker();
  // }
  componentDidMount() {
    Meteor.call("token.getMapToken", (error, result) => {
      this.setState({
        token: result,
      });
    });
    for (let i = 0; i < degreeToPixels.length; i++) {
      const obj = degreeToPixels[i];
      this.yRange.push(this.state.viewport.height / obj.pixels);
      this.xRange.push(this.state.viewport.width / obj.pixels);
    }
    // console.log("SearchBoard did mount");
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const newViewport = Object.assign({}, this.state.viewport);
      newViewport.latitude = latitude;
      newViewport.longitude = longitude;
      this.setState({
        viewport: newViewport,
        currentLat: latitude,
        currentLon: longitude});
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const newRes = [];
    for (let i = 0; i < nextProps.markers.length; i++) {
      newRes.push(false);
    }
    this.setState({
      res: newRes,
      markers: nextProps.markers,
    });
  }

  renderMarker() {
    console.log("render markers");
    return this.state.markers.map((c, index) => {
      const className = this.state.res[index] ? "pin-picture-hover" : "pin-picture";
      //const resInfo = c.info;
      return (
        <Marker
          key={c.id}
          longitude={c.coordinates.longitude}
          latitude={c.coordinates.latitude}
        >
          <img
            className={className}
            src={"/imgs/mark.png"}
            alt={"icon of res "}
            //onClick={() => this.setState({ popupInfo: "city" })}
            onMouseOver={() => this.handleOnMouseOverOrOut(index)}
            onMouseOut={() => this.handleOnMouseOverOrOut(index)}

          />
        </Marker>
      );
    });
  }

  handleOnViewportChange(viewport) {
    this.setState({ viewport: viewport });
  }

  handleOnMouseOverOrOut(index){
    const newRes = this.state.res.slice();
    newRes[index] = !newRes[index];
    this.setState({res: newRes});
  }

  renderCurrentPosition(){
    return (
      <Marker key={"current-position"} latitude={this.state.currentLat} longitude={this.state.currentLon}>
        <div id={"currentPosition"} />
      </Marker>
    );
  }

  render() {
    console.log("render");
    return (

      <div>
        <ReactMapGL
          {...this.state.viewport}
          mapboxApiAccessToken={TOKEN}
          mapstyle={"mapbox://styles/mapbox/navigation-guidance-day-v4"}
          onViewportChange={v => this.handleOnViewportChange(v)}
        >
          <div
            style={mapStyle}
          >
            <NavigationControl
              onViewportChange={v => this.handleOnViewportChange(v)}
            />
          </div>
          {this.renderCurrentPosition()}


        {this.renderMarker()}
      </ReactMapGL>
    );
  }
}

Map.propTypes = {
  markers: PropTypes.arrayOf(PropTypes.object).isRequired
  // myEvents: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default withTracker(() => {
  return {};
})(Map);
