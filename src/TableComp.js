import React, { Component } from 'react';
import './App.css';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import AddPlayerForm from './AddPlayerForm.js'

const axios = require("axios");

export default class TableComp extends Component {
  constructor(props){
    super(props);
  }

  deletePlayer = (rowNum) =>{
    console.log(rowNum);
    axios.get("http://"+this.props.ip+"/TraineeApp/api/teamsheet_player/getAllTeamsheet_PlayersWithPlayerId/"+rowNum).then((response) => {
      console.log(response.data);
      for(var i = 0; i < response.data.length; i++){
        axios.delete("http://"+this.props.ip+"/TraineeApp/api/teamsheet_player/deleteTeamsheet_Player/"+response.data[i].teamsheetPlayerId).then((res) => {
           console.log(res.data);
         });
      }
      axios.delete("http://"+this.props.ip+"/TraineeApp/api/player/deletePlayer/"+rowNum).then((res) => {
         console.log(res.data);
         window.location.reload();
      });
    });

  }

  cellButton = (cell, row) => {
      return(
        <div>
          <button className = "btn btn-outline-danger">Sell</button>
          <button className = "btn btn-outline-danger" onClick = {() => this.deletePlayer(row.id)}>End Career</button>
        </div>
      )
  }

  render() {
    return (
      <div>
      <AddPlayerForm ip = {this.props.ip} className = "playerForm"/>
      <BootstrapTable data ={this.props.data} className="table table-striped" search>
        <TableHeaderColumn dataField = 'id' isKey>id</TableHeaderColumn>
        <TableHeaderColumn dataField = 'name'>Name</TableHeaderColumn>
        <TableHeaderColumn dataField = 'rating'>Rating</TableHeaderColumn>
        <TableHeaderColumn dataField = 'price'>Price</TableHeaderColumn>
        <TableHeaderColumn dataField = 'buttons' dataFormat = {this.cellButton}>Options</TableHeaderColumn>
      </BootstrapTable>
      </div>
    )
  }
}
