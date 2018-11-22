import React, { Component } from 'react';
import './App.css';


class HomePage extends Component {
  constructor(props){
    super(props);

  }

  render() {
    return (
      <div>
      <h1>HomePage</h1>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/-AbaV3nrw6E" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      <iframe width="560" height="315" src="https://www.youtube.com/embed/s7wmiS2mSXY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    );
  }
}

export default HomePage;
