const express = require('express');
const router = express.Router();
const Spotify = require('spotify-web-api-js');

const spotify_api = new Spotify();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("@@@@\n\n\n\n@@@@@@@@\n\n\n" + req.query);
  // const params = getHashParams(req.params);
  // if (params.access_token) {
    //   spotify_api.setAccessToken(params.access_token);
    // console.log('yyyuuuupp');
    // }
    res.render('index', { title: 'Spotify Playlist API', name: req.originalUrl});
  });
  
router.get('/#', function(req, res, next) {
    
  console.log("\n\n\n\n@@@@@@@@\n\n\n" + req.query);
  res.render('index', { title: 'Spotify Playlist API', name: 'name'});
});

function getHashParams(url) {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = url.substring(1);
  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}
function getNowPlaying() {
  spotify_api.getMyCurrentPlayingTrack()
    .then((response) => {
      this.setState({
        nowPlaying: {
          name: response.item.name,
          image: response.item.album.images[0].url
        }
      })
    })
}
module.exports = router;
