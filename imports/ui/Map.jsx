import React, { Component } from "react";
import ReactMapGL, { NavigationControl, Marker } from "react-map-gl";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import "mapbox-gl/dist/mapbox-gl.css";
import "../../client/main.css";

// used to compute map viewport
const degreeToPixels = [
  { zoom: 0, pixels: 1.7492 },
  { zoom: 1, pixels: 3.4984 },
  { zoom: 2, pixels: 6.9968 },
  { zoom: 3, pixels: 13.9936 },
  { zoom: 4, pixels: 27.9872 },
  { zoom: 5, pixels: 55.9744 },
  { zoom: 6, pixels: 111.9488 },
  { zoom: 7, pixels: 223.8976 },
  { zoom: 8, pixels: 447.7952 },
  { zoom: 9, pixels: 895.5904 },
  { zoom: 10, pixels: 1791.1808 },
  { zoom: 11, pixels: 3582.3616 },
  { zoom: 12, pixels: 7164.7232 },
  { zoom: 13, pixels: 14329.4464 },
  { zoom: 14, pixels: 28658.8928 },
  { zoom: 15, pixels: 57317.7856 },
  { zoom: 16, pixels: 114635.5712 },
  { zoom: 17, pixels: 229271.1424 },
  { zoom: 18, pixels: 458542.2848 },
  { zoom: 19, pixels: 917084.5696 },
  { zoom: 20, pixels: 1834169.1392 },
  { zoom: 21, pixels: 3668338.2784 },
  { zoom: 22, pixels: 7336676.5568 },
  { zoom: 23, pixels: 14673353.1136 },
  { zoom: 24, pixels: 29346706.2272 }
];

const mapStyle = { position: "absolute", top: 36, left: 0, padding: "10px" };
class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      res: [],
      search: false,
      viewport: {
        latitude: 37.3355,
        longitude: -121.893,
        zoom: 12,
        bearing: 0,
        pitch: 0,
        width: 450,
        height: 450
      },
      currentLat: 0.0,
      currentLon: 0.0,
      popupInfo: null,
      token: "",
      markers: []
    };
    this.yRange = [];
    this.xRange = [];
    console.log("constructor");
  }

  componentDidMount() {
    // console.log("SearchBoard did mount");

    // set viewport and current position marker
    if (this.props.markers && this.props.markers.length !== 0) {
      let newViewport0 = Object.assign({}, this.state.viewport);
      console.log("markers is :  " + this.props.markers.length);
      newViewport0.latitude = this.props.markers[0].coordinates.latitude;
      newViewport0.longitude = this.props.markers[0].coordinates.longitude;
      this.setState({
        viewport: newViewport0,
        currentLat: this.props.markers[0].coordinates.latitude,
        currentLon: this.props.markers[0].coordinates.longitude
      });
      console.log(
        "-------first viewport" + JSON.stringify(this.state.viewport)
      );
    } else {
      for (let i = 0; i < degreeToPixels.length; i++) {
        const obj = degreeToPixels[i];
        this.yRange.push(this.state.viewport.height / obj.pixels);
        this.xRange.push(this.state.viewport.width / obj.pixels);
      }
      navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const newViewport = Object.assign({}, this.state.viewport);
        newViewport.latitude = latitude;
        newViewport.longitude = longitude;
        this.setState({
          viewport: newViewport,
          currentLat: latitude,
          currentLon: longitude
        });
      });
    }
  }

  // change viewport location to newly searched results
  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("markers is :  " + nextProps.markers.length);
    const newViewport0 = Object.assign({}, this.state.viewport);
    if (nextProps.markers && nextProps.markers.length !== 0) {
      newViewport0.latitude = nextProps.markers[0].coordinates.latitude;
      newViewport0.longitude = nextProps.markers[0].coordinates.longitude;
      this.setState({
        viewport: newViewport0
      });
    }
  }

  renderMarker() {
    return this.props.markers.map((c, index) => {
      const className = this.props.isMouseOverArray[index]
        ? "pin-picture-hover"
        : "pin-picture";
      //const resInfo = c.info;
      return (
        <Marker
          key={c.id}
          longitude={c.coordinates.longitude}
          latitude={c.coordinates.latitude}
        >
          <img
            className={className}
            src={"/imgs/food-pin.png"}
            alt={"icon of res "}
            //onClick={() => this.setState({ popupInfo: "city" })}
            onMouseOver={() => this.props.changeFunction(index)}
            onMouseOut={() => this.props.changeFunction(index)}
          />
        </Marker>
      );
    });
  }

  handleOnViewportChange(viewport) {
    this.setState({ viewport: viewport });
  }

  handleOnMouseOverOrOut(index) {
    const newRes = this.state.res.slice();
    newRes[index] = !newRes[index];
    this.setState({ res: newRes });
  }

  renderCurrentPosition() {
    return (
      <Marker
        key={"current-position"}
        latitude={this.state.currentLat}
        longitude={this.state.currentLon}
      >
        <div id={"currentPosition"} />
      </Marker>
    );
  }

  render() {
    //console.log("render--->" + this.props.token);
    return (
      <ReactMapGL
        {...this.state.viewport}
        mapboxApiAccessToken={this.props.token}
        mapStyle={"mapbox://styles/mapbox/navigation-guidance-day-v4"}
        onViewportChange={v => this.handleOnViewportChange(v)}
      >
        <div style={mapStyle}>
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
  markers: PropTypes.arrayOf(PropTypes.object).isRequired,
  isMouseOverArray: PropTypes.arrayOf(PropTypes.bool).isRequired,
  changeFunction: PropTypes.func,
  token: PropTypes.string.isRequired
  // myEvents: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default withTracker(() => {
  return {};
})(Map);
