import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
} from 'react-router-dom';
import Spotify from 'spotify-web-api-js';

const spotify_api = new Spotify();

class Api extends Component {
  constructor(props) {
    // console.log(props.id);
      console.log('iwi ');
      console.log(props.match.params);
    super(props);
    this.state = {
      id: this.props.match.params.user,
      token: this.props.match.params.token,
      playlist: this.props.match.params.id,
      tracks: []
    }
    spotify_api.setAccessToken(this.props.match.params.token);
    console.log('LOGGED IN');
  }
  getTracks() {
    console.log(this.state.id);
    console.log(this.state.playlist);
    spotify_api.getPlaylistTracks(this.state.id, this.state.playlist)
      .then((response) => {
        let temp = [];
        console.log(response);
        for (let i = 0; i < response.items.length; i++) {
          const el = response.items[i];
          let o = {name: el.track.name, artist: el.track.artists[0].name}
          // temp.push(el.track.name + ': ' + el.track.artists[0].name);
          temp.push(o);
        }
        this.setState({
          tracks: [...temp],
        })
      })
  }
  render() {
    return (
      <div className="API">
        {'{'}
        <ul onClick={this.getTracks()}>
            {this.state.tracks.map(function(o, index) {
            return <li key={ index }> {'{'} name : {o.name}, artist: {o.artist} {'}'},</li>
            })}
        </ul>
        {'}'}
      </div>
    );
  }
}

export default Api;
