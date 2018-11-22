import React, { Component } from 'react';
import './App.css';


class Player extends Component {
  constructor(props){
    super(props);
  }

  onDragStart = (ev, id) => {
      console.log('dragstart:',id);
      ev.dataTransfer.setData("id", id);
  }

  render() {
    return (
      <div key={this.props.name}
          onDragStart = {(e) => this.onDragStart(e, this.props.name)}
          draggable
          className="draggable"
          style = {{backgroundColor: this.props.bgcolor}}
      >
          {this.props.name}
      </div>
    );
  }
}

export default Player;
