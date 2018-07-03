import React, { Component } from 'react';
import './App.css';
import { toNumber } from 'lodash';
import { GoogleApiWrapper } from 'google-maps-react';
import Map from './Components/Map';
import Locations from './Components/Locations';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      route: false,
      }
  }

  onLocationsChange = (locations) => {
    this.setState({ locations: locations });
    if(this.state.locations.length < 2){
      this.setState({ route: false });
      console.log(this.state.route);
    }
  }

  handleClick = (marker) => {
    this.state.locations.push(marker);
    this.setState({ locations: this.state.locations });
  }

  handleDragend = (markerDrag) => {
    let index = this.state.locations.indexOf(markerDrag.element);
    let newLocations = this.state.locations;
    newLocations[index] = { lat: toNumber(markerDrag.lat), lng: toNumber(markerDrag.lng) };
    this.setState({ locations: newLocations });

  }

  rearrangeArray = (newArray) => {
    this.setState({ locations: newArray });
  }


  onRouteChange = (val) =>{
    this.setState({ route: val });
      
  }

  // makeRoute = () => {
  //   if (this.state.route == false) {
  //     this.setState({ route: true });
  //   }
    
  // }

  render() {
    const listLocations = this.state.locations;
    // const shouldMarkError = () => {
    //   const shouldShow = this.state.route;
    //   return this.state.locations.length < 2 ? shouldShow : false;
    // }


    return (
      <div>
        <div className="page-header">
          <h1> Google Maps API + React </h1>
        </div>
        <div className="wrapper">
          <div className="container-fluid">
            <div className="rows">
              <Locations locations={this.state.locations} route={this.state.route} onChange={this.onLocationsChange} onRearrange={this.rearrangeArray} onRtChange={this.onRouteChange}/>
              {/* <button className="make-route-css right" onClick={this.makeRoute}>Make route</button>
              <br/><span className={shouldMarkError() ? "shown_err" : "hidden"}>Недостаточно точек для построения маршрута</span> */}
              <Map google={this.props.google} locationsFromParent={listLocations} onClick={this.handleClick} onDragend={this.handleDragend} route={this.state.route} />
            </div>
          
              
         
          </div>

        </div>


      </div>
    )
  }
}
// OTHER MOST IMPORTANT: Here we are exporting the App component WITH the GoogleApiWrapper. You pass it down with an object containing your API key
export default GoogleApiWrapper({
  apiKey: 'AIzaSyBHEHsw8dlNfdL630FLs0oCgikjv3UWZGo',
})(App)