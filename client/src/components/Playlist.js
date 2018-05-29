import React, { Component } from 'react';

class Playlist extends Component {
  constructor() {
    super();
    this.state = {
      tracks: []
    }
  }
  render() {
    return (
      <div className="Playlist">
        {this.props}
      </div>
    );
  }
}

export default Playlist;
