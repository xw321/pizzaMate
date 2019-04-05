import React, { Component } from "react";
import ReactMapGL, { NavigationControl, Marker } from "react-map-gl";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import CityPin from "./city-pin.jsx";
import "mapbox-gl/dist/mapbox-gl.css";
//import mapConfig from "./mapConfig.jsx";
//import { Meteor } from "meteor/meteor";

const TOKEN =
  "pk.eyJ1IjoiYWRvdWRvdSIsImEiOiJjanUyMWg4cW0wN3FsM3lwY2dyNTJsb3h0In0.sdXoWdlnsVa3oUEZ-BEfLw";
class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 37.7749,
        longitude: -122.4194,
        zoom: 12,
        bearing: 0,
        pitch: 0,
        width: 600,
        height: 600
      },
      popupInfo: null,
      token: ""
    };
  }

  componentDidMount() {
    this.renderMarker();
  }

  renderMarker() {
    return this.props.markers.map(c => (
      <Marker
        key={c.id}
        longitude={c.coordinates.longitude}
        latitude={c.coordinates.latitude}
      >
        <CityPin
          size={20}
          onClick={() => this.setState({ popupInfo: "city" })}
        />
      </Marker>
    ));
  }

  handleOnViewportChange(viewport) {
    this.setState({ viewport: viewport });
  }

  render() {
    return (
      <div>
        <ReactMapGL
          {...this.state.viewport}
          mapboxApiAccessToken={TOKEN}
          mapstyle={"mapbox://styles/mapbox/streets-v9"}
          onViewportChange={v => this.handleOnViewportChange(v)}
        >
          <div
            style={{ position: "absolute", top: 36, left: 0, padding: "10px" }}
          >
            <NavigationControl
              onViewportChange={v => this.handleOnViewportChange(v)}
            />
          </div>

          {this.renderMarker()}
        </ReactMapGL>
      </div>
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
