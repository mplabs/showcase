const cradle = require('cradle');
const db = new (cradle.Connection)().database('sc_photos');
const fs = require('fs-extra');
const gm = require('gm').subClass({ imageMagick: true });
const merge = require('../utils').merge;

var Photo = {
  /**
   * Save a new photo
   * @param  {Object} file]
   * @return {Promise}
   */
  create: function(file) {
    var readStream = fs.createReadStream(file.path);

    return new Promise(function(resolve, reject) {
      gm(readStream)
        .identify(function(err, imgData) {
          if (err) {
            reject(err);
          } else {
            var photo = merge(imgData, {
              'Base filename': file.filename
            });
            db.save(photo, function(err, res) {
              if (err) { reject(err); }
              else { resolve(res); }
            });
          }
        });
    });
  },

  /**
   * Get a photo by id
   * @param  {String} id]
   * @return {Promise}
   */
  get: function(id) {
    return new Promise(function(resolve, reject) {
      db.get(id, function(err, doc) {
        if (err) { reject(err); }
        else { resolve(doc); }
      });
    });
  },

  /**
   * Get all photos
   * @return {Promise}
   */
  all: function() {
    return new Promise(function(resolve, reject) {
      db.view('all', function(err, res) {
        if (err) { reject(err); }
        else { resolve(res); }
      });
    });
  }
};

module.exports = Photo;