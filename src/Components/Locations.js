import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import MarkersInput from './MarkersInput';
// import { findDOMNode } from 'react-dom';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';


class Locations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: this.props.locations || []
        };
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        this.setState({
            locations: arrayMove(this.state.locations, oldIndex, newIndex),
        });
        this.props.onRearrange(this.state.locations);
    };

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

    financial(x) {
        return Number.parseFloat(x).toFixed(5);
      }

    render() {
       
        const SortableItem = SortableElement(({ value, index, marker }) => <li className="locations-css" key ={index}><span>{value}</span>
                <button className="delete-css" onClick={this.deleteMarker.bind(this, marker)}>Delete</button></li>);

        const SortableList = SortableContainer(({ locations }) => {
            return (
                <ul>
                    {locations.map((value, index) => (
                        <SortableItem key = {`item-${index}`} index={index} value = {this.financial(value.lat) + ';  ' + this.financial(value.lng)} marker = {value}/>
                    ))}
                </ul>
            )
        });

        return (
            // <div className = "left_menu_block_css col-3">
            <div className = "col-xs-12 col-sm-6 col-md-4 col-lg-3 left">
                <MarkersInput onSubmit={this.handleSubmitMarker}/>
                <SortableList locations={this.state.locations} onSortEnd={this.onSortEnd} />
            </div>


        )
    }

}

export default Locations;