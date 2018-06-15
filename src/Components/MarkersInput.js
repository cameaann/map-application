import React, { Component } from 'react';
import { EFAULT } from 'constants';
import { toNumber } from 'lodash';
import { error } from 'util';

class MarkersInput extends Component {
  constructor(props) {
    super(props);
    this.state = this.getDefaultLocation();
  }

  getDefaultLocation() {
    return {
      lat: "",
      lng: "",
      errors: {},
      touched: {
        lat: false,
        lng: false
      }
    };
  }
  validate(state) {
    // true means invalid, so our conditions got reversed  
    const errors = {};
    let lat = state.lat;
    let lng = state.lng;

    if(lat.length === 0){
        errors['lat'] = "Lat cannot be empty";
    }else if(Number.isNaN(toNumber(lat))){
        errors['lat'] = "Should be a number";
    }
    if(lng.length === 0){
        errors['lng'] = "Lng cannot be empty";
    } else if(Number.isNaN(toNumber(lng))){
        errors['lng'] = "Should be a number";
    }
    return errors;
}

  handleLatChange = (event) => {
    this.setState({ lat:event.target.value });
  }

  handleLngChange = (event) => {
    this.setState({ lng: event.target.value })
  }

  handleBlur = (field) => (event) => {
    this.setState({
      touched: { ...this.state.touched, [field]: true },
    });
  }


  handleSubmit = (event) => {
    event.preventDefault();
      if(this.validate(this.state)){
        let lat = toNumber(this.state.lat);
        let lng = toNumber(this.state.lng);
        let marker = {lat, lng};

      alert("Form submitted");
      this.props.onSubmit(marker);
      this.setState(this.getDefaultLocation());
    } else {
      alert("Form has errors.")
    }
  }

  makeRoute = (event) =>{
    console.log("clicked");
  }

  render() {
    const errors = this.validate(this.state);
    const isDisabled = Object.keys(errors).some(x => errors[x]);

    const shouldMarkError = (field) => {
      const hasError = errors[field];
      const shouldShow = this.state.touched[field];
      return hasError ? shouldShow : false;
    };


    return (
      <div className="container-input">
        <form onSubmit={this.handleSubmit}> 
         
            <legend>Введите координаты широты:</legend>
            <input value = {this.state.lat} placeholder="latitude" className={shouldMarkError('lat') ? "error" : ""}
              onChange={this.handleLatChange} onBlur={this.handleBlur('lat')} /><br/>
            <span className={shouldMarkError('lat') ? "shown" : "hidden"} >{errors["lat"]}</span>
            
            <legend>Введите координаты долготы:</legend>
            <input value = {this.state.lng} placeholder="longitude" className={shouldMarkError('lng') ? "error" : ""}
              onChange={this.handleLngChange} onBlur={this.handleBlur('lng')} /> <br/>
            <span className={shouldMarkError('lng') ? "shown" : "hidden"} >{errors["lng"]}</span>
         
          <button className="submit" disabled={isDisabled} type="submit" value="Submit">Submit</button>
        </form>        
      </div>
    );

  }
}

export default MarkersInput