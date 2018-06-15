import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Locations from './Locations'


export default class Map extends Component {

    constructor(props) {
        super(props);
        // const { lat, lng } = this.props.initialCenter;
        // this.state = {
        //     currentLocation: {
        //         lat: lat,
        //         lng: lng
        //     }
        // }

    }

    componentDidUpdate() {
        // if (prevProps.google !== this.props.google) {
        this.loadMap(); // call loadMap function to load the google map
        // }
    }

    loadMap() {
        if (this.props && this.props.google) { // checks to make sure that props have been passed
            const { google } = this.props; // sets props equal to google
            const maps = google.maps; // sets maps to google maps props

            const mapRef = this.refs.map; // looks for HTML div ref 'map'. Returned in render below.
            const node = ReactDOM.findDOMNode(mapRef); // finds the 'map' div in the React DOM, names it node

            let { initialCenter, zoom } = this.props;
            // const { lat, lng } = this.state.currentLocation;
            const { lat, lng } = initialCenter;
            const center = new maps.LatLng(lat, lng);
            const mapConfig = Object.assign({}, {
                center: center, // sets center of google map to Yaroslavl.
                zoom: zoom, // sets zoom. Lower numbers are zoomed further out.
                disableDefaultUI: true,
                mapTypeControl: true,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.TOP_CENTER
                },
                fullscreenControl: false,
                // zoomControl: true,
                // zoomControlOptions: {
                //     position: google.maps.ControlPosition.LEFT_CENTER
                // },
                // scaleControl: true,
                // streetViewControl: true,
                // streetViewControlOptions: {
                //     position: google.maps.ControlPosition.LEFT_TOP
                // },
                mapTypeId: 'roadmap' // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.

            })

            this.map = new maps.Map(node, mapConfig); // creates a new Google map on the specified node (ref='map') with the specified configuration set above.
            let self = this;
            this.map.addListener('click', (e) => {
                // self.placeMarkerAndPanTo(e.latLng);
                this.props.onClick({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng()
                    
                });
 
            });


            // ==================
            // ADD MARKERS TO MAP
            // ==================


            this.props.locationsFromParent.forEach(element => { // iterate through locations saved in state 
                const marker = new google.maps.Marker({ // creates a new Google maps Marker object.
                    position: { lat: element.lat, lng: element.lng }, // sets position of marker to specified location
                    map: this.map, // sets markers to appear on the map we just created on line 35
                    // title: location.name, // the title of the marker is set to the name of the location
                    draggable: true
                });

                marker.addListener('dragend', (e) => {
                    console.log(e.latLng.lat(), e.latLng.lng());
                    console.log(element);
                    this.props.onDragend({
                        lat: e.latLng.lat(),
                        lng: e.latLng.lng(),
                        element
                    });

                });
            })

            if (this.props.route) {
                var makeRoute = new google.maps.Polyline({
                    path: this.props.locationsFromParent,
                    geodesic: true,
                    strokeColor: '#FF0000',
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });

                makeRoute.setMap(this.map);
            }
        }
    }

    render() {
        const style = { // MUST specify dimensions of the Google map or it will not work. Also works best when style is specified inside the render function and created as an object
            // width: '100vw', // 90vw basically means take up 90% of the width screen. px also works.
            height: '100vh', // 75vh similarly will take up roughly 75% of the height of the screen. px also works. 
        }


        return ( // in our return function you must return a div with ref='map' and style.
            // <div className = "right_map_block_css col-9">
                <div className = "col-xs-12 col-sm-6 col-md-8 col-lg-9 right" ref="map" style={style}>
                    loading map...
                </div>

        )
    }
}

Map.propTypes = {
    google: PropTypes.object,
    zoom: PropTypes.number,
    initialCenter: PropTypes.object
}

Map.defaultProps = {
    zoom: 12,
    // Yaroslavl, by default
    initialCenter: {
        lat: 57.6261,
        lng: 39.8845
    }
   
}
