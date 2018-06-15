import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MarkersInput from './MarkersInput';
import { findDOMNode } from 'react-dom';


var placeholder = document.createElement("li");
placeholder.className = "placeholder";


class Locations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: this.props.locations || []
            };
    }


    dragStart = (e) => {
        this.dragged = e.currentTarget;
        e.dataTransfer.effectAllowed = 'move';
        // Firefox requires dataTransfer data to be set
        e.dataTransfer.setData("text/html", e.currentTarget);
    }

    dragEnd = (e) => {
        console.log(e);
        this.dragged.style.display = "block";
        if(this.dragged.parentNode){
        this.dragged.parentNode.removeChild(placeholder);
            }
        var locations = this.state.locations;
        var from = Number(this.dragged.dataset.id);
        var to = Number(this.over.dataset.id);
        if (from < to) to--;
        if (this.nodePlacement == "after") to++;
        locations.splice(to, 0, locations.splice(from, 1)[0]);
        this.setState({ locations: locations });
        this.props.onRearrange(this.state.locations);
    }

    dragOver = (e) => {
        e.preventDefault();
        this.dragged.style.display = "none";
        if (e.target.className == "placeholder") return;
        this.over = e.target;
        // Inside the dragOver method
        var relY = e.clientY - this.over.offsetTop;
        var height = this.over.offsetHeight / 2;
        var parent = e.target.parentNode;

        if (relY > height) {
            this.nodePlacement = "after";
            parent.insertBefore(placeholder, e.target.nextElementSibling);
        }
        else if (relY < height) {
            this.nodePlacement = "before"
            parent.insertBefore(placeholder, e.target);
        }
    }


    handleSubmitMarker = (location) => {
        this.state.locations.push(location);
        this.setState({
            locations: this.state.locations
        });

        this.props.onChange(this.state.locations);
    }

    deleteMarker = (marker) => {
        const newState = this.state.locations.slice();
        console.log(newState.indexOf(marker));
        if (newState.indexOf(marker) > -1) {
            newState.splice(newState.indexOf(marker), 1);
            this.setState({ locations: newState });
            this.props.onChange(newState);
        }

    }

    render() {

        // const locations = this.state.locations.map((marker, index) =>{
        //     return  <li key={index}><span>{marker.lat +';'+ marker.lng}</span>
        //     <button onClick={this.deleteMarker.bind(this, marker)}>Delete</button>
        //     </li>
        // })
        return (
            <div>
                <MarkersInput onSubmit={this.handleSubmitMarker} />
                <ul onDragOver={this.dragOver}>
                    {this.state.locations.map((item, i) => {
                        return (
                            <li
                                data-id={i}
                                key={i}
                                draggable="true"
                                onDragEnd={this.dragEnd}
                                onDragStart={this.dragStart}
                            >
                                {item.lat + ';' + item.lng}
                                <button onClick={this.deleteMarker.bind(this, item)}>Delete</button>
                            </li>
                        )
                    }, this)}
                </ul>
              
            </div>


        )
    }

}

export default Locations;