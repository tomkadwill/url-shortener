const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const exphbs  = require('express-handlebars');
const urlShortener = require('node-url-shortener');
const bodyParser = require('body-parser');
const db = require('./models/index.js');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded());
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
  db.Url.findAll({order: [['createdAt', 'DESC']], limit: 5})
        .then(urlObjs => {
          res.render('index', {
            urlObjs: urlObjs
          });
        });
});

app.post('/url', function(req, res) {
  const url = req.body.url

  urlShortener.short(url, function(err, shortUrl) {
    db.Url.findOrCreate({where: {url: url, shortUrl: shortUrl}})
          .then(([urlObj, created]) => {
            res.redirect('/');
          });
  });
});

app.listen(port, () => console.log(`url-shortener listening on port ${port}!`));