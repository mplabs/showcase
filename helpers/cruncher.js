const fs = require('fs');
const gm = require('gm').subClass({ imageMagick: true });
const path = require('path');

const DEFAULTS = {
  target: 'tmp',
  sizes: []
};

// Take a file
// Create [sizes].length new files in target

module.exports = (file, options) => {
  var g, readStream, sizeName, targetPath, writeStream;

  if (!file) {
    throw TypeError('Must call with file to process');
  }

  options = Object.assign(DEFAULTS, options);
  readStream = fs.createReadStream(file);

  return new Promise((resolve, reject) => {
    gm(readStream).size({ bufferStream: true}, function(err, size) {
      if (err) return reject(err);
      g = this;

      Promise.all(Object.keys(options.sizes).map(sizeName => {
        targetPath = path.join(options.target, fileName + ',' + sizeName);
        writeStream = fs.createWriteStream(targetPath);

      }));

      Promise.all(options.sizes.map(targetSize => {
        if (size.width > size.height) {
          return g.resize(targetSize);
        } else {
          return g.resize(null, targetSize);
        }
      })).then(gs => {
        gs.forEach(g => g.write(writeStream, function(err) {

        }));
      });
    });
  });

function write(g, writeStream) {
  return new Promise((resolve, reject) => g.write(writeStream, err => {
    if (err) reject(err);
    else resolve();
  }));
}


function resize(file, targetSizeName, cb) {
  var targetPath = path.join(options.target, file.fileName) + ',' + targetSizeName;
  var writeStream = fs.createWriteStream(targetPath);
  gm(file).size(function(err, size) {
    if (err) throw Error(err);
    if (Math.max(size.width, size.height) < options.sizes[targetSize]) {
      return;
    }
    if (size.width > size.height) {
      this.resize(options.sizes[targetSize])
        .write(writeStream, function(err) {
          if (err) throw Error(err);
          cb(targetPath);
        });
    } else {
      this.resize(null, options.sizes[targetSize])
        .write(writeStream, function(err) {
          if (err) throw Error(err);
          cb(targetPath);
        });
    }
  });
}

  

  return new Promise((resolve, reject) => {
    gm(readStream).size({ bufferStream: true }, function (err, size) {
      if (err) {
        reject(err);
      } else {
        Promise.all(options.sizes.map(targetSize => {

        }));
        if (size.width > size.height) {
          g = this.resize(targetSize);
        } else {
          g = this.resize(null, targetSize);
        }
      }
    });
  });
};