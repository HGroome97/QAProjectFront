import React, { Component } from 'react';
import './bootstrap.css';
import TableComp from './TableComp.js'

const axios = require("axios");

export default class PlayerTable extends Component {
  constructor(props){
    super(props);

    this.state = {
        players: [

          ]
       }
  }

  componentDidMount() {
    {this.populatePlayers()}
  }

  populatePlayers = () => {
    var players = this.state.players;
    var playerArray = [];
    var playerList;
    axios.get("http://localhost:8081/TraineeApp/api/player/getAllPlayersWithTeamName/myTeam").then((response) => {
      playerList = response.data;
        for(var i = 0; i<response.data.length; i++){
          var person = {
            id: response.data[i].playerId,
            name:response.data[i].fName+" "+response.data[i].lName,
            rating:response.data[i].rating,
            price: response.data[i].price,
          };
          players = players.concat(person);
        }
        this.setState({players: players})
      });
  }

  print = () =>{
    console.log(this.state.players);
  }

  render() {
    return (
      <div>
      <TableComp data = {this.state.players}/>
      </div>
    )
  }
}
