'use strict';

const fs = require('fs-extra');
const path = require('path');

module.exports = {
  getCachePath: function(basePath) {
    // This will find the first level directory with no more than 1000 entries
     var cachePath = fs.readdirSync(basePath).find(file => {
      let fullPath = path.join(basePath, file);
      return fs.statSync(fullPath).isDirectory() && (this.globDirectories(fullPath).length <= 1000);
    });

    // If we have no result, we need to create a new directory
    if (!cachePath) {
      cachePath = path.join(basePath, this.pad(this.globDirectories(basePath).length, 3));
      fs.mkdirSync(cachePath);
    } else {
      cachePath = path.join(basePath, cachePath);
    }
    
    // Then we create a new directory in the found graph with an incremented number
    cachePath = path.join(cachePath, this.pad(this.globDirectories(cachePath).length, 3));
    fs.mkdirSync(cachePath);

    return cachePath;
  },

  globDirectories: function(inPath) {
    return fs.readdirSync(inPath)
      .filter(file => fs.statSync(path.join(inPath, file)).isDirectory());
  },

  pad: function(num, size) {
    return ("000000000" + num).substr(-size);
  }
};