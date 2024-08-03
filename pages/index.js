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
        // return res.status(500).send('Erro ao salvar a página');
        return res.redirect('/admin?error=Erro+ao+salvar+a+página.');
      }
      res.redirect('/');
    });
  });
});

// Edição de página
router.get('/admin/edit/:url', checkAuth, (req, res) => {
  const pageUrl = req.params.url;
  const filePath = path.join(pagesDir, `${pageUrl}.txt`);

  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao carregar a página para edição');
    }
    res.render('edit', { title: pageUrl ,url: pageUrl, content });
  });
});

router.post('/admin/edit/:url', (req, res) => {
  const pageUrl = req.params.url;
  const { content } = req.body;
  const filePath = path.join(pagesDir, `${pageUrl}.txt`);

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao salvar as alterações da página');
    }
    res.redirect('/');
  });
});

// Exclusão de página
router.get('/admin/delete/:url', checkAuth, (req, res) => {
  const pageUrl = req.params.url;
  const filePath = path.join(pagesDir, `${pageUrl}.txt`);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao deletar a página');
    }
    res.redirect('/');
  });
});

// Visualização de página
router.get('/:page', (req, res) => {
    const page = req.params.page;
    const filePath = path.join(pagesDir, `${page}.txt`);
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) res.status(404).send('Página não encontrada');
      else res.render('page', { title: page, content: data });
    });
  });


module.exports = router;
