import React, { Component } from 'react';
import '../App.css';
import Spotify from 'spotify-web-api-js';
import Playlist from './Playlist';

const spotify_api = new Spotify();

class Home extends Component {
  constructor() {
    super()
    const params = this.getHashParams();
    this.state = {
      loggedIn: params.access_token ? true : false,
      id: params.id,
      playlists: {
        names: [],
        images: [],
        ids: [],
        tracks: []
      }
    }
    if (params.access_token) {
      spotify_api.setAccessToken(params.access_token);
      console.log('LOGGED ' + this.state.loggedIn);
      for (let key in params) {
        if (params.hasOwnProperty(key)) {
          console.log(key + " -> " + params[key]);
        }
      }
    } else {
      console.log('not this');
    }
  }
  getHashParams() {
    let hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }
  getPlaylists() {
    spotify_api.getUserPlaylists()
      .then((response) => {
        let temp = [];
        let itemp = [];
        let idtemp = [];
        for (let i = 0; i < response.items.length; i++) {
          temp.push(response.items[i].name);
          idtemp.push(response.items[i].id);
          if (response.items[i].images[0])
            itemp.push(response.items[i].images[0].url);
          else
            itemp.push('none');
        }
        this.setState({
          playlists: {
            names: [...this.state.playlists.names, ...temp],
            images: [...this.state.playlists.images, ...itemp],
            ids: [...this.state.playlists.ids, ...idtemp]
          }
        });
        console.log(this.state.playlists.ids + ' 00000');
      });
  }
  
  render() {
    return (
      <div className="Home">
        <a href='http://localhost:8888'> Login to Spotify </a>
        <br/>
      {this.state.loggedIn &&
      <p>
          Hey! {this.state.id}
          <br/>
      </p>}
      <button onClick={() => this.getPlaylists()}>
        getPlaylists
      </button>
      { this.state.loggedIn &&
        <div>
          {this.state.playlists.ids.map((id, index) => {
            return 
              <ul key={ index }>
                <Playlist
                  id={id}
                  user="sunshoes"
                  Spotify={spotify_api}
                  cover={this.state.playlists.images[index]}
                />
              </ul>
          })}
        </div>
      }
      </div>
    );
  }
}

export default Home;