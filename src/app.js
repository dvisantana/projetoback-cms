const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config({ path: '../config/.env' });

const app = express();
const PORT = 3000;

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || "segredinhohihi",
  resave: false,
  saveUninitialized: true,
}));

app.use(express.static(path.join(__dirname, '../public')));

const authRoute = require('./auth')
const pagesRoute = require('./pages')

app.use('/', authRoute)
app.use('/', pagesRoute)

app.listen(PORT, () => {
  console.log(`Running at port ${PORT}`);
});

