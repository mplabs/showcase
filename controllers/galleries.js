const express = require('express');
const router = express.Router();
const merge = require('../utils').merge;

function GalleriesController(app) {
  "use strict";
  
  const Gallery = require('../models/gallery')(app);
  
  router.post('/', (req, res) => {
    if (!req.body || !req.body.name) {
      return res.sendStatus(400);
    }

    Gallery.create(req.body.name, req.body)
      .then(doc => res.send(doc))
      .catch(err => res.status(500).send(err));
  });

  router.delete('/:name', (req, res) => {
    let name = req.params.name;

    Gallery.delete(name)
      .then(() => res.sendStatus(204))
      .catch(err => res.sendStatus(500));
  });

  router.get('/:name', (req, res) => {
    let name = req.params.name;

    Gallery.get(name).then(doc => res.send(doc));
  });

  return router;
}

module.exports = GalleriesController;