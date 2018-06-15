import React, { Component } from 'react';
import './App.css';
import { toNumber } from 'lodash';
// import HTML5Backend from 'react-dnd-html5-backend';
// import { DragDropContext } from 'react-dnd';

// import the Google Maps API Wrapper from google-maps-react
import { GoogleApiWrapper } from 'google-maps-react';
import Map from './Components/Map';
import Locations from './Components/Locations';
// import List from './Components/List';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      route: false,
      clicked: false
    }
  }

  onLocationsChange = (locations) => {
    this.setState({ locations: locations });
  }

  handleClick = (marker) => {
    this.state.locations.push(marker);
    this.setState({ locations: this.state.locations });
  }

  handleDragend = (markerDrag) => {
    let index = this.state.locations.indexOf(markerDrag.element);
    this.state.locations[index] = { lat: toNumber(markerDrag.lat), lng: toNumber(markerDrag.lng) };
    this.setState({ locations: this.state.locations });

  }

  rearrangeArray = (newArray) => {
    this.setState({ locations: newArray });
    console.log(this.state.locations);
  }

  changeRouteState() {
    this.setState({ route: true });
  }

  makeRoute = () => {
    this.changeRouteState();
    console.log(this.state.route);
  }

  handleBlur = (event) => {
    this.setState({ clicked: true });
  }



  render() {
    const listLocations = this.state.locations;
    const shouldMarkError = () => {
      const shouldShow = this.state.clicked;
      return this.state.locations.length < 2 ? shouldShow : false;
    }


    return (
      <div>
        <div className="page-header">
          <h1> Google Maps API + React </h1>
        </div>
        <div className="wrapper">
          <div className="container-fluid">
            <div className="rows">
              <Locations locations={this.state.locations} onChange={this.onLocationsChange} onRearrange={this.rearrangeArray} />
              <button className="make-route-css col-xs-12 col-sm-6 col-md-4 col-lg-3 right" onClick={this.makeRoute}>Make route</button>
              <Map google={this.props.google} locationsFromParent={listLocations} onClick={this.handleClick} onDragend={this.handleDragend} route={this.state.route} />
            </div>
          </div>
         
        </div>
        
        <span className={shouldMarkError() ? "shown" : "hidden"}>Не достаточно точек для построения маршрута</span>
      </div>
    )
  }
}
// OTHER MOST IMPORTANT: Here we are exporting the App component WITH the GoogleApiWrapper. You pass it down with an object containing your API key
export default GoogleApiWrapper({
  apiKey: 'AIzaSyBHEHsw8dlNfdL630FLs0oCgikjv3UWZGo',
})(App)