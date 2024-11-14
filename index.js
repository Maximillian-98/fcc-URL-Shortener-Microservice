require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// For storing urls
urls = {}
urlShortId = 1

// post function to create and store short url
app.post('/api/shorturl', function(req, res) {
  urlString = req.body.url
  urlRegex = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,6}([-a-zA-Z0-9@:%_+.~#?&//=]*)$/;

  if(!urlRegex.test(urlString)) {
    return res.json({ error: 'invalid url' });
  }

  //add to object to store the short url
  urls[urlShortId] = urlString

  res.json({
    original_url: urlString,
    short_url: urlShortId
  })

  urlShortId++ //increment id
});

app.get('/api/shorturl/:short_url', function(req, res) {
  urlShort = req.params.short_url
  originalUrl = urls[urlShort]
  res.redirect(originalUrl)
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
