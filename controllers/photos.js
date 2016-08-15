const config = require('../config.json');
const express = require('express');
const fs = require('fs-extra');
const router = express.Router();
const path = require('path');
const Photo = require('../models/photo');
const upload = require('multer')({ dest: 'tmp/' });
const getCachePath = require('../helpers/cache').getCachePath;

const UPLOAD_PATH = config.storage.images.originals;

router.post('/', upload.single('file'), function(req, res) {
  var pathParts = {
    // name: req.file.originalname + ',' + 
  };
  pathParts.name += ',' + Math.random().toString(36).substring(7);
  pathParts.dir = getCachePath(UPLOAD_PATH);

  // Handle creating model and copying photo to final location...
  Photo.create(req.file)
    .then(function(doc) {
      fs.move(req.file.path, path.format(pathParts), function(err) {
        if (err) { throw Error(err); }
        res.sendStatus(202);
      });
    });
});

router.get('/:id,:size', function (req, res) {
  var id = req.params.id;
  var size = req.params.size || 'original';

  Photo.get(req.params.id)
    .then(function(doc) {
      // @todo: Handle giving out the image and metadata here...
      res.setHeader('Content-Type', 'image/jpeg');
      fs.createReadStream(BASE_PATH + '/' + doc._id).pipe(res);
    })
    .catch(function(err) {
      res.sendStatus(404);
    });
});

module.exports = router;