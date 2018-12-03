import './App.css';
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import TeamSelector from './TeamSelector.js';
import './bootstrap.css'
import TransferTable from './TransferTable.js'
import PlayerTable from './PlayerTable.js'
import HomePage from './HomePage.js'
import GameScreen from './GameScreen.js'

function PageRouting() {
  return (
    <Router>
      <div>

      <button onClick = {() => window.location.href="./"} class="btn btn-danger" Style = "width:20%">Home</button>
      <button onClick = {() => window.location.href="./play"} class="btn btn-outline-success" Style = "width:20%">Play</button>
      <button onClick = {() => window.location.href="./teamsheets"} class="btn btn-danger" Style = "width:20%">Teamsheets</button>
      <button onClick = {() => window.location.href="./players"} class="btn btn-outline-success" Style = "width:20%">Players</button>
      <button onClick = {() => window.location.href="./transfers"} class="btn btn-danger" Style = "width:20%">Transfers</button>


      <hr />

      <Route exact path="/" component={App} />
      <Route path="/play" component={PlayPage} />
      <Route path="/teamsheets" component={TeamSelectorPage} />
      <Route path="/players" component={PlayerTablePage} />
      <Route path="/transfers" component={TransferTablePage} />
    </div>
    </Router>
  );
}


class App extends Component {
  render() {
    return (
      <div className="App">
        <HomePage ip = "localhost:8081"/>
      </div>
    );
  }
}

  class PlayPage extends Component {
  render() {
    return (
      <div className="App">
      <GameScreen ip = "localhost:8081"/>
      </div>
    );
  }
}

class TeamSelectorPage extends Component {
  render() {
    return (
      <div className="App">
      <TeamSelector ip = "localhost:8081"/>
      </div>
    );
  }
}


class PlayerTablePage extends Component {
  render() {
    return (
      <div className="App">
        <PlayerTable ip = "localhost:8081"/>
      </div>
    );
  }
}

class TransferTablePage extends Component {
  render() {
    return (
      <div className="App">
        <TransferTable ip = "localhost:8081"/>
      </div>
    );
  }
}

export default PageRouting;
