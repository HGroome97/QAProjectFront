import React, { Component } from 'react';
import './App.css';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import AddPlayerForm from './AddPlayerForm.js'

const axios = require("axios");

export default class TransferTableComp extends Component {
  constructor(props){
    super(props);
  }

  buyPlayer = (rowNum) =>{
    var playerPrice;
    axios.get("http://localhost:8081/TraineeApp/api/player/getPlayer/"+rowNum).then((response) => {
      var updatedPlayer = {
          playerId: response.data.playerId,
          fName:response.data.fName,
          lName:response.data.lName,
          rating:response.data.rating,
          price: response.data.price,
          team: "myTeam"
      };
      playerPrice = response.data.price;
      console.log(updatedPlayer);
      axios.get("http://localhost:8081/TraineeApp/api/gameinfo/getAllGameInfo").then((response) => {
        if(response.data[0].money-playerPrice>=0){
          var updatedGameInfo = {
            gameId: response.data[0].gameId,
            saveName: response.data[0].saveName,
            money: response.data[0].money-playerPrice,
            lastHomeScore: response.data[0].lastHomeScore,
            lastAwayScore: response.data[0].lastAwayScore,

          }
          axios.put("http://localhost:8081/TraineeApp/api/player/updatePlayer", updatedPlayer).then((response) => {
            axios.put("http://localhost:8081/TraineeApp/api/gameinfo/updateGameInfo", updatedGameInfo).then((response) => {
              console.log(response.data);
              window.location.reload();
            });
          });
        }else{
          alert("Not Enough Money")
        }

      });
    });

  }

  cellButton = (cell, row) => {
      return(
        <button className = "btn btn-outline-success" onClick = {() => this.buyPlayer(row.id)}>Buy</button>
      )
  }

  render() {
    return (
      <div>
      <AddPlayerForm className = "playerForm"/>
      <BootstrapTable data ={this.props.data} className="table table-striped" search>
        <TableHeaderColumn dataField = 'id' isKey>id</TableHeaderColumn>
        <TableHeaderColumn dataField = 'name'>Name</TableHeaderColumn>
        <TableHeaderColumn dataField = 'rating'>Rating</TableHeaderColumn>
        <TableHeaderColumn dataField = 'price'>Price</TableHeaderColumn>
        <TableHeaderColumn dataField = 'team'>Team</TableHeaderColumn>
        <TableHeaderColumn dataField = 'buttons' dataFormat = {this.cellButton}>Options</TableHeaderColumn>
      </BootstrapTable>
      </div>
    )
  }
}
