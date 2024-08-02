const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '../postPages');

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

// Criação de página
router.get('/admin', checkAuth, (req, res) => {
  const error = req.query.error;
  res.render('create', { error });
});

router.post('/admin/create', checkAuth, (req, res) => {
  const { url, content } = req.body;
  const filePath = path.join(pagesDir, `${url}.txt`);

  // Verificar se o arquivo já existe
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      // Arquivo já existe, redirecionar com mensagem de erro
      return res.redirect('/admin?error=Página+com+o+mesmo+URL+já+existe.');
    }

    // Arquivo não existe, prosseguir com a criação
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erro ao salvar a página');
      }
      res.redirect('/');
    });
  });
});

module.exports = router;
