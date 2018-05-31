import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
} from 'react-router-dom';
let spotify_api;

class Api extends Component {
  constructor(props) {
      console.log(props);
    super(props);
    this.state = {
      tracks: [...this.props.tracks]
    }
    spotify_api = this.props.Spotify;
  }
  render() {
    return (
      <div className="Api">
        <ul>
            {this.state.tracks.map(function(name, index) {
            return <li key={ index }>x {name} </li>
            })}
        </ul>
      </div>
    );
  }
}

export default Api;
