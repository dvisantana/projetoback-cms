const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login');
}); 

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_LOGIN && password === process.env.ADMIN_PASSWORD) {
    req.session.user = username;
    res.redirect('/');
  } else {
    res.redirect('/login');
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;