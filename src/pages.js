const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'pages');

// Middleware para verificar login
function checkAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Página inicial
router.get('/', (req, res) => {
  fs.readdir(pagesDir, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao ler páginas');
    }
    const pages = files.map(file => file.replace('.txt', ''));
    res.render('home', { pages });
  });
});

module.exports = router;
