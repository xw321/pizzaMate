import React, { Component } from "react";
//import MapGL, {NavigationControl} from "react-map-gl";
import ReactMapGL, { NavigationControl, Marker } from "react-map-gl";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";
import CityPin from "./city-pin.jsx";
import mapConfig from "./mapConfig.jsx";

const TOKEN = mapConfig.key;
class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 37.3382,
        longitude: -121.8863,
        zoom: 12,
        bearing: 0,
        pitch: 0,
        width: 600,
        height: 600
      },
      popupInfo: null
    };
  }

  componentDidMount() {
    this.renderMarker();
  }

  renderMarker() {
    // console.log("makers >>>>>>>   " + this.props.markers);
    // let newLongitude = this.props.markers[0].coordinates.longitude;
    // let newLatitude = this.props.markers[0].coordinates.longitude;
    // let newViewPort = {
    //   latitude: newLatitude,
    //   longitude: newLongitude,
    //   zoom: 12,
    //   bearing: 0,
    //   pitch: 0,
    //   width: 600,
    //   height: 600
    // };
    // this.setState({ viewport: newViewPort });
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
    );
  }
}

Map.propTypes = {
  markers: PropTypes.arrayOf(PropTypes.object).isRequired
  // myEvents: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default withTracker(() => {
  // TODO: error subscribing using props
  //Meteor.subscribe("restaurantEvents");

  return {
    //myEvents: Events.find({}).fetch()
  };
})(Map);
