require('dotenv').config();
const path = require('path');
const express = require('express');
const indexRouter = require('./routes/index');

function createApp() {
  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '..', 'views'));

  app.use(express.static(path.join(__dirname, '..', 'public'), { maxAge: '1h' }));
  app.use('/', indexRouter);

  // 404
  app.use((req, res) => {
    res.status(404).send('Not found');
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
  });

  return app;
}

module.exports = createApp;
