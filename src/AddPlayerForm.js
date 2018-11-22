import React, { Component } from 'react';
import './App.css';

const axios = require("axios");

export default class AddPlayerForm extends Component {
  constructor(props){
    super(props);
  }

  addPlayer = () =>{
    var data = {
      fName: document.getElementById("firstNameInput").value,
      lName: document.getElementById("secondNameInput").value,
      rating: document.getElementById("ratingInput").value,
      price: document.getElementById("priceInput").value,
      team: document.getElementById("teamInput").value
    }
    axios.post("http://localhost:8081/TraineeApp/api/player/createPlayer", data).then((res) => {
       console.log(res.data);
    });
  }


  render() {
    return (
      <form id = "addPlayerForm">
        <label>Add Player: </label>
        <input id = "firstNameInput" placeholder = "Enter First Name"/>
        <input id = "secondNameInput" placeholder = "Enter Second Name"/>
        <input id = "ratingInput" placeholder = "Enter Player Rating"/>
        <input id = "priceInput" placeholder = "Enter Player Price"/>
        <input id = "teamInput" placeholder = "Enter Team"/>
        <button id = "addPlayerBtn" onClick = {() => this.addPlayer()}>Submit</button>
      </form>
    )
  }
}