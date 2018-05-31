import React, { Component } from 'react';
import Spotify from 'spotify-web-api-js';
import Playlist from './components/Playlist';
import Api from './components/Api';
import Home from './components/Home';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import './App.css';
const spotify_api = new Spotify();

class App extends Component {
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
          <Router>
        <Route render={({location}) => ( 
          <div >
             
            <Switch
              location={location}
            >
              <Route
                exact={true}
                path={'/:token/:user/p/:id'}
                component={Api}
              />
              <Route 
                 exact={true}
                 path={'/'}
                 component={Home}
               />
              <Route
                render={() => <div> Not Found </div>}
              />
            </Switch>
            </div>
            )} />
          </Router>
    );
  }
}

export default App;
