import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'

const markers = [];
var makeRoute = null;

export default class Marker extends Component {

    componentDidUpdate(prevProps) {
        if ((this.props.map !== prevProps.map) ||
            (this.props.position !== prevProps.position)) {
            // this.componentWillUnMount();
            this.renderMarker();

        }
    }

    renderMarker() {
        clearOverlays();

        let {
            map, google, position, mapCenter
        } = this.props;

        let marker;
    
        let pos = position || mapCenter;
        position = new google.maps.LatLng(pos.lat, pos.lng);

        // const pref = {
        //     map: map,
        //     position: position
        //   };
        // this.marker = new google.maps.Marker(pref); 

        function clearOverlays() {
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
                
                markers.length = 0;
                if(makeRoute){
                    makeRoute.setMap(null);
                }
                
        }


        this.props.locationsFromParent.forEach(element => { // iterate through locations saved in state 
            var contentString = "Точка маршрута " + (this.props.locationsFromParent.indexOf(element) + 1);
            marker = new google.maps.Marker({ // creates a new Google maps Marker object.
                position: { lat: element.lat, lng: element.lng }, // sets position of marker to specified location
                map: map,
                title: contentString, // the title of the marker is set to the name of the location
                draggable: true
            })

    

            marker.addListener('dragend', (e) => {
                console.log(e.latLng.lat(), e.latLng.lng());
                console.log(element);
                this.props.onDragend({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                    element
                });
            });

            markers.push(marker);
            console.log(markers);          
            
        })

        if(this.props.route){
                makeRoute = new google.maps.Polyline({
                path: this.props.locationsFromParent,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            makeRoute.setMap(map);
        }

    }


    render() {
        return null;
    }
}




Marker.propTypes = {
    position: PropTypes.object,
    locationsFromParent: PropTypes.array,
    map: PropTypes.object
}
