import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'

export default class Map extends Component {

  constructor(props) {
    super(props);

    const { lat, lng } = this.props.initialCenter;
    this.state = {
      currentLocation: {
        lat: lat,
        lng: lng
      }
    }

  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google) {
      this.loadMap();
    }
    if (prevState.currentLocation !== this.state.currentLocation) {
      this.recenterMap();
    }
  }

  recenterMap() {
    const map = this.map;
    const curr = this.state.currentLocation;

    const google = this.props.google;
    const maps = google.maps;

    if (map) {
      let center = new maps.LatLng(curr.lat, curr.lng)
      map.panTo(center)
    }
  }


  componentDidMount() {
    if (this.props.centerAroundCurrentLocation) {
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const coords = pos.coords;
          this.setState({
            currentLocation: {
              lat: coords.latitude,
              lng: coords.longitude
            }
          })
        })
      }
    }
    this.loadMap(); // call loadMap function to load the google map
  }

  loadMap() {
    if (this.props && this.props.google) { // checks to make sure that props have been passed
      const { google } = this.props; // sets props equal to google
      const maps = google.maps; // sets maps to google maps props

      const mapRef = this.refs.map; // looks for HTML div ref 'map'. Returned in render below.
      const node = ReactDOM.findDOMNode(mapRef); // finds the 'map' div in the React DOM, names it node

      let { initialCenter, zoom } = this.props;
      const { lat, lng } = this.state.currentLocation;
      // const { lat, lng } = initialCenter;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = Object.assign({}, {
        center: center, // sets center of google map to Yaroslavl.
        zoom: zoom, // sets zoom. Lower numbers are zoomed further out.
        mapTypeId: 'roadmap' // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.

      })

      this.map = new maps.Map(node, mapConfig); // creates a new Google map on the specified node (ref='map') with the specified configuration set above.
      

      this.map.addListener('click', (e) => {
        console.log(e.latLng.lat(), e.latLng.lng())
        this.props.onClick({
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        });
      });    
    }
  }


  renderChildren(){
    const { children } = this.props;

    if (!children) return;

    return React.Children.map(children, c => {
      return React.cloneElement(c, {
        map: this.map,
        google: this.props.google,
        mapCenter: this.state.currentLocation
      });
    })
  }


  render() {
    const style = { // MUST specify dimensions of the Google map or it will not work. Also works best when style is specified inside the render function and created as an object
      // width: '100vw', // 90vw basically means take up 90% of the width screen. px also works.
      height: '100vh', // 75vh similarly will take up roughly 75% of the height of the screen. px also works. 
    }


    return ( // in our return function you must return a div with ref='map' and style.
      // <div className = "right_map_block_css col-9">
      <div className="col-xs-12 col-sm-6 col-md-8 col-lg-9 right" ref="map" style={style}>
        Loading map...
                    {this.renderChildren()}
      </div>

    )
  }
}

Map.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  initialCenter: PropTypes.object,
  centerAroundCurrentLocation: PropTypes.bool,
  onMove: PropTypes.func,
}

Map.defaultProps = {
  zoom: 12,
  // Yaroslavl, by default
  initialCenter: {
    lat: 57.6261,
    lng: 39.8845
  },
  centerAroundCurrentLocation: false,
  onMove: function(){}

}
