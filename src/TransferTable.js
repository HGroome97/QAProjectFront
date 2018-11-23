import React, { Component } from 'react';
import './bootstrap.css';
import TransferTableComp from './TransferTableComp.js'

const axios = require("axios");

export default class TransferTable extends Component {
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
    axios.get("http://"+this.props.ip+"/TraineeApp/api/player/getAllPlayersWithoutTeamName/myTeam").then((response) => {
      playerList = response.data;
        for(var i = 0; i<response.data.length; i++){
          var person = {
            id: response.data[i].playerId,
            name:response.data[i].fName+" "+response.data[i].lName,
            rating:response.data[i].rating,
            price: response.data[i].price,
            team: response.data[i].team
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
      <TransferTableComp ip = {this.props.ip} data = {this.state.players}/>
      </div>
    )
  }
}
