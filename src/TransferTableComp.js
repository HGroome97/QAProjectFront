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
    console.log(rowNum);
    axios.get("http://localhost:8081/TraineeApp/api/player/getPlayer/"+rowNum).then((response) => {
      console.log(response.data);
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
      axios.post("http://localhost:8081/TraineeApp/api/player/updatePlayer", updatedPlayer).then((response) => {
        console.log(response.data);
        axios.get("http://localhost:8081/TraineeApp/api/gameinfo/getAllGameInfo").then((response) => {
          console.log(response.data);
          var updatedGameInfo = {
            id: response.data[1].gameId,
            saveName: response.data[1].saveName,
            money: response.data[1].money-playerPrice
          }
          axios.post("http://localhost:8081/TraineeApp/api/gameinfo/updateGameInfo", updatedPlayer).then((response) => {
            console.log(response.data);
            window.location.reload();
          });
        });
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
