import React, { Component } from 'react';
import './App.css';

const axios = require("axios");

class GameScreen extends Component {
  constructor(props){
    super(props);
  }

  componentDidMount() {
    {this.populateDropdown()}

    {this.setTitle()}
  }

  setTitle = () => {
    axios.get("http://"+this.props.ip+"/TraineeApp/api/gameinfo/getAllGameInfo").then((response) => {
      document.getElementById("titleHeader").innerHTML = response.data[0].saveName;
    });
  }

  populateDropdown = () =>{
    document.getElementById("loadSheet").options.length = 0;
    axios.get("http://"+this.props.ip+"/TraineeApp/api/teamsheet/getAllTeamsheets").then((response) => {
        for(var i = 0; i<response.data.length; i++){
          var option = document.createElement("option");
          option.id = "teamsheet"+response.data[i].teamsheetId;
          option.value = response.data[i].saveName;
          option.text = response.data[i].saveName;
          var select = document.getElementById("loadSheet");
          select.appendChild(option);
        }
      });

  }

  playGame = () =>{
    var opponents = ["Liverpool","Man City","Man Utd","Arsenal","Chelsea"]
    var teamID = Math.floor(Math.random() * 4);
    var opponentTeam = opponents[teamID];

    if(Math.random()<0.5){
      document.getElementById("homeTeam").innerHTML = document.getElementById("titleHeader").innerHTML;
      document.getElementById("awayTeam").innerHTML = opponentTeam;
    }else{
      document.getElementById("homeTeam").innerHTML = opponentTeam;
      document.getElementById("awayTeam").innerHTML = document.getElementById("titleHeader").innerHTML;
    }
    document.getElementById("homeScore").innerHTML = " "+Math.floor(Math.random() * 5)+" : ";
    document.getElementById("awayScore").innerHTML = Math.floor(Math.random() * 5)+" ";

    var moneyGained = Math.floor(Math.random() * 20);
    document.getElementById("moneyLabel").innerHTML = "Money gained from game: "+moneyGained;

    axios.get("http://"+this.props.ip+"/TraineeApp/api/gameinfo/getAllGameInfo").then((response) => {
        var updatedGameInfo = {
          gameId: response.data[0].gameId,
          saveName: response.data[0].saveName,
          money: response.data[0].money+moneyGained,
          lastHomeScore: response.data[0].lastHomeScore,
          lastAwayScore: response.data[0].lastAwayScore,

        }
        axios.put("http://"+this.props.ip+"/TraineeApp/api/gameinfo/updateGameInfo", updatedGameInfo).then((response) => {
            console.log(response.data);
        });
    });

  }

  render() {
    return (
      <div>
        <h2 id = "titleHeader"></h2>
        <div>
          <select id ="loadSheet"/>
          <button id = "playGame" onClick = {() => this.playGame()}>Play against random opponent</button>
        </div>

        <div>
          <label id = "homeTeam"/>
          <label id = "homeScore"/>

            <label id = "awayScore"/>
            <label id = "awayTeam"/>
          </div>

          <div>
            <label id = "moneyLabel"/>
          </div>
      </div>
    );
  }
}

export default GameScreen;
