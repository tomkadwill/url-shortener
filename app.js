const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const urlShortener = require('node-url-shortener');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const db = require('./models/index.js');

const sequelize = new Sequelize('urlshortener', 'tomkadwill', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded());

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/url', function(req, res) {
  const url = req.body.url

  urlShortener.short(url, function(err, shortUrl) {
    db.Url.findOrCreate({where: {url: url, shortUrl: shortUrl}})
          .then(([urlObj, created]) => {
            res.send(shortUrl)
          });
  });
});

app.listen(port, () => console.log(`url-shortener listening on port ${port}!`));