import React, { Component } from 'react';
import './App.css';

const axios = require("axios");

class HomePage extends Component {
  constructor(props){
    super(props);

  }

  changeName = () => {
    axios.get("http://localhost:8081/TraineeApp/api/gameinfo/getAllGameInfo").then((response) => {
      console.log(response.data[0]);
      var updatedGameInfo = {
        gameId: response.data[0].gameId,
        saveName: document.getElementById("teamnameInput").value,
        money: response.data[0].money,
        lastHomeScore: response.data[0].lastHomeScore,
        lastAwayScore: response.data[0].lastAwayScore,
      }
      console.log(updatedGameInfo);
      axios.put("http://localhost:8081/TraineeApp/api/gameinfo/updateGameInfo", updatedGameInfo).then((response) => {
        console.log(response.data);
      });
    });
  }

  render() {
    return (
      <div>
      <h1>Home Page</h1>
      <form>
        <label>Change Team Name: </label>
        <input id = "teamnameInput" placeholder = "Enter Team Name"/>
        <button id = "addMoneyBtn" onClick = {() => this.changeName()}>Submit</button>
      </form>
      </div>
    );
  }
}

export default HomePage;
