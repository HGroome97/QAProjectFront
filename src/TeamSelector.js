import React, { Component } from 'react';
import './App.css';
import Container from './Container.js'
import Player from './Player.js'
import PlayerDropDown from './PlayerDropDown.js'
import Option from './Option.js'

const axios = require("axios");

export default class TeamSelector extends Component {
    constructor(props){
      super(props);

      this.state = {
          players: [
            ]
         }
    }

    populatePlayers = () => {
      var players = this.state.players;
      var playerArray = [];
      var playerList;
      axios.get("http://"+this.props.ip+"/TraineeApp/api/player/getAllPlayersWithTeamName/myTeam").then((response) => {
        playerList = response.data;
          for(var i = 0; i<response.data.length; i++){
            var person = {
              id: response.data[i].playerId,
              name:response.data[i].fName+" "+response.data[i].lName+" - "+response.data[i].rating,
              category:"SquadList",
              bgcolor:"green"
            };
            players = players.concat(person);
          }
          this.setState({players: players})

        });

    }

    componentDidMount() {
      document.getElementById("defenders").value = 4;
      document.getElementById("midfielders").value = 4;
      document.getElementById("attackers").value =  2;


      {this.change()}

      {this.populateDropdown()}

      {this.populatePlayers()}

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

    calculatePositions = (props) =>{
      var positionArray = [];
      var start=50;
      for(var j = 0; j<props; j++){
        start-=(8-j);
      }
      var end = 100-start;
      var incr = (end-start)/props;
      for(var i = 0;i<props;i++){
        positionArray[i]=start+(incr*i);
      }
      return positionArray;
    }

    change = () =>{
      var numDefenders = parseInt(document.getElementById("defenders").value);
      var numMidfielders = parseInt(document.getElementById("midfielders").value);
      var numAttackers= parseInt(document.getElementById("attackers").value);
      var numPlayers= numDefenders+numMidfielders+numAttackers;

      if(numPlayers==10){
        var i = 2;
        while(i<numDefenders+2){
          var perc = this.calculatePositions(numDefenders)[i-2];
          document.getElementById("player"+i).style.top = 60+"%";
          document.getElementById("player"+i).style.left = perc+"%";
          document.getElementById("player"+i+"header").innerHTML = "defender";
        i++;
      }
      while(i<numDefenders+numMidfielders+2){
        var perc = this.calculatePositions(numMidfielders)[i-numDefenders-2];
        document.getElementById("player"+i).style.top = 40+"%";
          document.getElementById("player"+i).style.left = perc+"%";
          document.getElementById("player"+i+"header").innerHTML = "midfielder";
        i++;
      }
      while(i<numDefenders+numMidfielders+numAttackers+2){
        var perc = this.calculatePositions(numAttackers)[i-numDefenders-numMidfielders-2];
          document.getElementById("player"+i).style.top = 20+"%";
          document.getElementById("player"+i).style.left = perc+"%";
          document.getElementById("player"+i+"header").innerHTML = "attacker";
      i++;
      }
      }else{
        alert("invalid");
      }
    }

    onDragOver = (ev) => {
        ev.preventDefault();
    }

    onDrop = (ev, cat) => {
       let id = ev.dataTransfer.getData("id");

       let players = this.state.players.filter((player) => {
          if(player.category == cat){
            player.category = "SquadList";
          }
           if (player.name == id) {
               player.category = cat;
           }
           return player;
       });
       console.log(players);
       this.setState({
           ...this.state,
           players
       });
    }

    saveChanges = (ip) =>{
      console.log(ip);
      var saveName = document.getElementById("saveName").value;

      axios.get("http://"+ip+"/TraineeApp/api/teamsheet/searchTeamsheet/"+saveName).then((response) => {
        if(response.data.length==0){
          var data = {
            "saveName": document.getElementById("saveName").value,
            "numDefenders": document.getElementById("defenders").value,
            "numMidfielders": document.getElementById("midfielders").value,
            "numAttackers": document.getElementById("attackers").value
          };
          var playersAr = [];
          var posAr = [];
          for(var i = 1; i<=11; i++){
            var cat = "player"+i;
            let players = this.state.players.filter((player) => {
               if(player.category == cat){
                 playersAr.push(player);
                 posAr.push(i);
                 return player;
               }
            });
          }
          axios.post("http://"+ip+"/TraineeApp/api/teamsheet/createTeamsheet", data).then(function (res) {
                      console.log(res.data);
                      document.getElementById("loadSheet").options.length = 0;
                      axios.get("http://"+ip+"/TraineeApp/api/teamsheet/getAllTeamsheets").then((response) => {
                          for(var i = 0; i<response.data.length; i++){
                            var option = document.createElement("option");
                            option.id = "teamsheet"+response.data[i].teamsheetId;
                            option.value = response.data[i].saveName;
                            option.text = response.data[i].saveName;
                            var select = document.getElementById("loadSheet");
                            select.appendChild(option);
                          }

                          var theSelect = document.getElementById("loadSheet");
                          var lastValue = theSelect.options[theSelect.options.length-1].id;
                          var currentId = lastValue.substring(9,lastValue.length);

                          for(var i = 0; i<playersAr.length; i++){
                            var data = {
                              "teamsheetId": currentId,
                              "playerId": playersAr[i].id,
                              "posNo": posAr[i]
                            };
                            axios.post("http://"+ip+"/TraineeApp/api/teamsheet_player/createTeamsheet_Player", data).then(function (res) {
                              console.log(res.data);
                            });
                          }
                  });

        });
        }else{
          console.log(this.props.ip);
          {this.updateSheet(response.data, this.props.ip)}
        }
      });

    }

    updateSheet = (data, ip) => {
      var teamsheetId = data[0].teamsheetId;
      var data = {
        "teamsheetId" :teamsheetId,
        "saveName": document.getElementById("saveName").value,
        "numDefenders": document.getElementById("defenders").value,
        "numMidfielders": document.getElementById("midfielders").value,
        "numAttackers": document.getElementById("attackers").value
      };
      var playersAr = [];
      var posAr = [];
      for(var i = 1; i<=11; i++){
        var cat = "player"+i;
        let players = this.state.players.filter((player) => {
           if(player.category == cat){
             playersAr.push(player);
             posAr.push(i);
             return player;
           }
        });
      }
      console.log(ip);
      axios.put("http://"+ip+"/TraineeApp/api/teamsheet/updateTeamsheet", data).then(function (res) {
        console.log(res.data);
        for(var i = 0; i<playersAr.length; i++){
          var data = {
            "teamsheetId": teamsheetId,
            "playerId": playersAr[i].id,
            "posNo": posAr[i]
          };
          axios.post("http://"+ip+"/TraineeApp/api/teamsheet_player/createTeamsheet_Player", data).then(function (res) {
            console.log(res.data);
          });
        }
      });
    }

    loadSheet = () => {
      var options = document.getElementById("loadSheet").options;
      var fullId = options[options.selectedIndex].id;
      var selectedId = fullId.substring(9,fullId.length);
      var teamsheet = [];
      axios.get("http://"+this.props.ip+"/TraineeApp/api/teamsheet/getTeamsheet/"+selectedId).then((response) => {
          document.getElementById("saveName").value = response.data.saveName;
          document.getElementById("defenders").value = response.data.numDefenders;
          document.getElementById("midfielders").value = response.data.numMidfielders;
          document.getElementById("attackers").value = response.data.numAttackers;

          {this.change()}

          teamsheet = response.data;

          let players = this.state.players.filter((player) => {
             player.category = "SquadList";
             return player;
          });
          this.setState({
              ...this.state,
              players
          });

          var positions = [];
          axios.get("http://"+this.props.ip+"/TraineeApp/api/teamsheet_player/getAllTeamsheet_PlayersWithTeamsheetId/"+selectedId).then((response) => {
            positions = response.data;
            //iterate through positions setting position of relevant player
            console.log(positions);
            console.log(teamsheet);
            for(var i = 0; i<positions.length; i++){
              let players = this.state.players.filter((player) => {
                 if(player.id == positions[i].playerId){
                   player.category = "player"+positions[i].posNo;
                 }
                 return player;
              });
              this.setState({
                 ...this.state,
                 players
              });
            }
        });
      });
    }

    deleteSheet = () => {
      var options = document.getElementById("loadSheet").options;
      var fullId = options[options.selectedIndex].id;
      var selectedId = fullId.substring(9,fullId.length);
      console.log(selectedId);
      axios.get("http://"+this.props.ip+"/TraineeApp/api/teamsheet_player/getAllTeamsheet_PlayersWithTeamsheetId/"+selectedId).then((response) => {
        for(var i = 0; i < response.data.length; i++){
          console.log(response.data[i].teamsheetPlayerId);
          axios.delete("http://"+this.props.ip+"/TraineeApp/api/teamsheet_player/deleteTeamsheet_Player/"+response.data[i].teamsheetPlayerId).then((res) => {
             console.log(res.data);
           });
        }
        axios.delete("http://"+this.props.ip+"/TraineeApp/api/teamsheet/deleteTeamsheet/"+selectedId).then((res) => {
           console.log(res.data);
           window.location.reload();
        });
      });
    }



    render() {
        var pos = {
            SquadList: [],
            player1: [],
            player2: [],
            player3: [],
            player4: [],
            player5: [],
            player6: [],
            player7: [],
            player8: [],
            player9: [],
            player10: [],
            player11: []
        }
        this.state.players.forEach ((t) => {
            pos[t.category].push(
              <Player name={t.name} bgcolor={t.bgcolor} />
            );
        });
        console.log(pos);
        return (
            <div className="container-drag">
                <h2 id = "titleHeader" className="header">Team Selector</h2>

                <div className = "formation-container">
                  < span className="task-header">Formation Selector</span>
                  Defenders:<PlayerDropDown position={"defenders"}/>
                  Midfielders:<PlayerDropDown position={"midfielders"}/>
                  Attackers:<PlayerDropDown position={"attackers"}/>
                  <button id = "change_formation" onClick={this.change}>Change Formation</button>

                  <div id = "saveLoadOptions">
                    <select id = "loadSheet"/>
                    <br/>
                    <button id = "loadButton" onClick = {this.loadSheet}>Load Teamsheet</button>
                    <button id = "deleteButton" onClick = {this.deleteSheet}>Delete Teamsheet</button>
                    <input id = "saveName" Style = "width: 145px"></input>
                    <button id = "saveButton" onClick = {() => this.saveChanges(this.props.ip)}>Save Teamsheet</button>
                  </div>
                </div>

                <div className="SquadList" id="SquadList"
                    onDragOver={(e)=>this.onDragOver(e)}
                    onDrop={(e)=>this.onDrop(e, "SquadList")}>
                    <span className="task-header">Squad List</span>
                    {pos.SquadList}
                </div>

                <div className= "player" id = "player1"
                    onDragOver={(e)=>this.onDragOver(e)}
                    onDrop={(e)=>this.onDrop(e, "player1")}>
                     <span className="task-header"id="player1header">Goal Keeper</span>
                     {pos.player1}
                </div>

                <div className="player" id = "player2"
                    onDragOver={(e)=>this.onDragOver(e)}
                    onDrop={(e)=>this.onDrop(e, "player2")}>
                     <span className="task-header"id="player2header">player2</span>
                     {pos.player2}
                </div>

                <div className="player" id = "player3"
                    onDragOver={(e)=>this.onDragOver(e)}
                    onDrop={(e)=>this.onDrop(e, "player3")}>
                     <span className="task-header"id="player3header">player3</span>
                     {pos.player3}
                </div>

                <div className="player" id = "player4"
                    onDragOver={(e)=>this.onDragOver(e)}
                    onDrop={(e)=>this.onDrop(e, "player4")}>
                     <span className="task-header"id="player4header">player4</span>
                     {pos.player4}
                </div>

                <div className="player" id = "player5"
                    onDragOver={(e)=>this.onDragOver(e)}
                    onDrop={(e)=>this.onDrop(e, "player5")}>
                     <span className="task-header"id="player5header">player5</span>
                     {pos.player5}
                </div>

                <div className="player" id = "player6"
                    onDragOver={(e)=>this.onDragOver(e)}
                    onDrop={(e)=>this.onDrop(e, "player6")}>
                     <span className="task-header"id="player6header">player6</span>
                     {pos.player6}
                </div>

                <div className="player" id = "player7"
                    onDragOver={(e)=>this.onDragOver(e)}
                    onDrop={(e)=>this.onDrop(e, "player7")}>
                     <span className="task-header"id="player7header">player7</span>
                     {pos.player7}
                </div>

                <div className="player" id = "player8"
                    onDragOver={(e)=>this.onDragOver(e)}
                    onDrop={(e)=>this.onDrop(e, "player8")}>
                     <span className="task-header"id="player8header">player8</span>
                     {pos.player8}
                </div>

                <div className="player" id = "player9"
                    onDragOver={(e)=>this.onDragOver(e)}
                    onDrop={(e)=>this.onDrop(e, "player9")}>
                     <span className="task-header"id="player9header">player9</span>
                     {pos.player9}
                </div>

                <div className="player" id = "player10"
                    onDragOver={(e)=>this.onDragOver(e)}
                    onDrop={(e)=>this.onDrop(e, "player10")}>
                     <span className="task-header"id="player10header">player10</span>
                     {pos.player10}
                </div>

                <div className="player" id = "player11"
                    onDragOver={(e)=>this.onDragOver(e)}
                    onDrop={(e)=>this.onDrop(e, "player11")}>
                     <span className="task-header"id="player11header">player11</span>
                     {pos.player11}
                </div>

            </div>
        );
    }
}
