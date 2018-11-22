import React, { Component } from 'react';
import './App.css';


export default class Option extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <option id = {this.props.id}>{this.props.name}</option>
    )
  }
}
