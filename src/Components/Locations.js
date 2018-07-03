import React, { Component } from 'react';
import MarkersInput from './MarkersInput';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';


class Locations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locations: this.props.locations || [],
        };
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        console.log(oldIndex, newIndex);
        console.log(this.state.locations);
        this.setState({
            locations: arrayMove(this.state.locations, oldIndex, newIndex),
        });
        console.log(this.state.locations);
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


    makeRoute = () => {
        this.props.onRtChange(true);
    }

    financial(x) {
        return Number.parseFloat(x).toFixed(5);
    }

    changeIndexView(x) {
        return x + 1;
    }



    render() {

        const SortableItem = SortableElement(({ value, index, marker }) => <li className="locations-css" key={index}><span>{value}</span>
            <button className="delete-css" onClick={this.deleteMarker.bind(this, marker)}>Удалить</button></li>);

        const SortableList = SortableContainer(({ locations }) => {
            return (
                <ul>
                    {locations.map((value, index) => (
                        <SortableItem key={`item-${index}`} index={index} value={this.financial(value.lat) + ';  ' + this.financial(value.lng)} marker={value} />
                        // <SortableItem key={`item-${index}`} index={index} value={'Точка маршрута ' + index} marker={value} />
                        // this.changeIndexView(index)
                    ))}
                </ul>
            )
        });

        const shouldMarkError = () => {
            const shouldShow = this.props.route;
            console.log(shouldShow);
            return this.state.locations.length < 2 ? shouldShow : false;
        }

        return (
            <div className="col-xs-12 col-sm-6 col-md-4 col-lg-3 left">
                <MarkersInput onSubmit={this.handleSubmitMarker} />
                <SortableList locations={this.state.locations} onSortEnd={this.onSortEnd} />

                {/* <SortableList items= {this.state.locations} /> */}
                <button className="make-route-css" onClick={this.makeRoute}>Построить маршрут</button>
                <span className={shouldMarkError() ? "shown_err" : "hidden"}>Недостаточно точек для построения маршрута</span>
            </div>


        )
    }

}

export default Locations;