import React, {Component} from "react";
//import MapGL, {NavigationControl} from "react-map-gl";
import ReactMapGL, {NavigationControl,} from "react-map-gl";

const TOKEN = "pk.eyJ1IjoiYWRvdWRvdSIsImEiOiJjanUyMWg4cW0wN3FsM3lwY2dyNTJsb3h0In0.sdXoWdlnsVa3oUEZ-BEfLw";
// const navStyle = {
//   position: "absolute",
//   top: 0,
//   left: 0,
//   padding: "10px"
// };


export default class Map extends Component {
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
        height: 600,
      }
    };
  }

  // renderMap() {
  //   return (
      
  //   );
  // }

  handleOnViewportChange(viewport) {
    this.setState({viewport: viewport});
  }

  render() {
    // const {viewport, updateViewport} = this.state;
    return (
      <ReactMapGL
        {...this.state.viewport}
        mapboxApiAccessToken={TOKEN}
        mapstyle = {"mapbox://styles/mapbox/streets-v9"}
        onViewportChange={(v) => this.handleOnViewportChange(v)}>
        <div style={{position: "absolute", top: 36, left: 0, padding: "10px"}}>
          <NavigationControl onViewportChange={(v) => this.handleOnViewportChange(v)}/>
        </div>
      </ReactMapGL>
    );
  }

  // renderAnotherMap() {
  //   return (
  //     <ReactMapGL
  //       {...viewport} onViewportChange={updateViewport}
  //       mapStyle="mapbox://styles/mapbox/streets-v9"
  //       mapboxApiAccessToken={TOKEN}>
  //       <div className="nav" style={navStyle}>
  //         <NavigationControl onViewportChange={updateViewport}/>

  //       </div>
  //     </ReactMapGL>
  //     );
  // }
}