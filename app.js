require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));



// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req,res) => {
  res.render('index') 

})
app.get('/artist-search', (req,res) => {
  console.log(req.query)
  const {artist} = req.query;
  spotifyApi.searchArtists(artist)
  .then(data => {
    console.log('The received data from the API: ', data.body)
    const {items} = data.body.artists
    
    res.render('artist-search-results', {items});
  
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

  app.get('/albums/:artistId', (req, res) => {
    const {artistId} = req.params;
    spotifyApi.getArtistAlbums(artistId)
    .then(data => {
      res.render('albums', {albums: data.body.items})
    })
    .catch(err => {
      console.log(err)
      res.render('error', {
        message: 'Sorry, an error happened.'
      })
    }) 
  });

  app.get('/tracks/:albumId', (req,res)=> {
    const {albumId} = req.params;
    spotifyApi.getAlbumTracks(albumId)
      .then(data => {
        res.render('tracks', { tracks: data.body.items})
      })
      .catch(err => {
        console.log(err)
        res.render('error', {
          message: 'Sorry, an error happened.'
        })
      }) 
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));