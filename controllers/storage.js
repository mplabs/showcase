const express = require('express');
const fs = require('fs-extra');
const gm = require('gm').subClass({ imageMagick: true });
const router = express.Router();

const BASE_PATH = process.cwd() + '/storage/cache/images';

function StorageController(app) {
  "use strict";

  router.get(FILENAME_PATTERN, fileExists, (req, res) => {
    let id = req.params[0];
    let sizePostfix = req.params[1];

    res.setHeader('Content-Type', 'image/jpeg');

    if (sizePostfix === 'original') {
      fs.createReadStream(BASE_PATH + id).pipe(res);
    } else {
      
    }
  });
  
  return router;
}

module.exports = StorageController;

const SIZE_PATH = process.cwd() + '/storage/images/resized';
const FILENAME_PATTERN = /^\/([0-9a-f]{32}),(\w+(?:\.x2)?)\.jp(?:e)?g$/;
const SIZES = {
  'large.x2': 2048,
  'large': 1024,
  'medium_large.x2': 1600,
  'medium_large': 800,
  'medium.x2': 1000,
  'medium': 500,
  'small.x2': 200,
  'small': 100,
  'tiny.x2': 120,
  'tiny': 60
};

router.get(FILENAME_PATTERN, fileExists, function(req, res) {
  var id = req.params[0];
  var sizePostfix = req.params[1];
  
  res.setHeader('Content-Type', 'image/jpeg');

  if (sizePostfix === 'original') {
    fs.createReadStream(BASE_PATH + id).pipe(res);
  } else {
    getSize(id, sizePostfix)
      .then(function(stream) {
        stream.pipe(res);
      });
  }
});

module.exports = router;

var pad = (num, size) => ("000000000" + num).substr(-size);

function globDirectories(inPath) {
  return fs.readdirSync(inPath)
    .filter(file => fs.statSync(path.join(inPath, file)).isDirectory());
}

function getCachePath(inPath) {
  // This will find the first level directory with no more than 1000 entries
   var cachePath = fs.readdirSync(inPath).find(file => {
    let fullPath = path.join(inPath, file);
    return fs.statSync(fullPath).isDirectory() && (globDirectories(fullPath).length <= 1000);
  });

  // If we have no result, we need to create a new directory
  if (!cachePath) {
    cachePath = path.join(inPath, pad(globDirectories(inPath).length, 3));
    fs.mkdirSync(cachePath);
  } else {
    cachePath = path.join(inPath, cachePath);
  }
  
  // Then we create a new directory in the found graph with an incremented number
  cachePath = path.join(cachePath, pad(globDirectories(cachePath).length, 3));
  fs.mkdirSync(cachePath);

  return cachePath;
}

function fileExists (req, res, next) {
  var id = req.params[0];

  fs.access(BASE_PATH + '/' + id, function(err) {
    if (err) {
      res.sendStatus(404);
      return;
    }

    next();
  });
}

function getSize (id, sizeName) {
  var imagePath = SIZE_PATH + '/' + id + ',' + sizeName;

  return new Promise(function(resolve, reject) {
    fs.access(imagePath, function(err) {
      if (!err) {
        resolve(fs.createReadStream(imagePath));
      }
      resize(id, sizeName).then(function(stream) {
        resolve(stream);
      });
    });
  });
}

function resize (id, sizeName) {
  var readStream = fs.createReadStream(BASE_PATH + '/' + id);

  return new Promise(function(resolve, reject) {
    gm(readStream)
      .size({ bufferStream: true }, function(err, size) {
        if (err) { 
          reject(err);
          return;
        }
        var g = this;
        if (size.width > size.height) {
          g = g.resize(SIZES[sizeName]);
        } else {
          g = g.resize(null, SIZES[sizeName]);
        }
        g.write(SIZE_PATH + '/' + id + ',' + sizeName, function(err) {
          if (err) { throw Error(err); }
          resolve(fs.createReadStream(SIZE_PATH + '/' + id + ',' + sizeName));
        });
      });
  });
}