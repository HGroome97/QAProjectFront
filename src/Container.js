import React, { Component } from 'react';
import './App.css';

class Container extends Component {
  constructor(props){
    super(props);
    this.state ={
      tasks: []
    }
  }

  onDragOver = (ev) => {
      ev.preventDefault();
  }

  onDrop = (ev, cat) => {
     let id = ev.dataTransfer.getData("id");
     let tasks = this.state.tasks.filter((task) => {
         if (task.name == id) {
             task.category = cat;
         }
         return task;
     });

     this.setState({
         ...this.state,
         tasks
     });
  }

  render() {
    var tasks = {
        wip: [],
    }

    this.state.tasks.forEach ((t) => {
        tasks[t.category].push(
            <div key={t.name}
                onDragStart = {(e) => this.onDragStart(e, t.name)}
                draggable
                className="draggable"
                style = {{backgroundColor: t.bgcolor}}
            >
                {t.name}
            </div>
        );
    });

    return (
      <div className={this.props.name} id={this.props.name}
          onDragOver={(e)=>this.onDragOver(e)}
          onDrop={(e)=>{this.onDrop(e, document.getElementById(this.props.name).className)}}>
          <span className="task-header">{this.props.name}</span>
          {this.state.tasks}
      </div>
    );
  }
}

export default Container;
