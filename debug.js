// const fs = require('fs-extra');
// const gm = require('gm').subClass({ imageMagick: true });
// const path = require('path');

// if (!process.argv[2]) {
//   throw Error("Must provide a filename.");
// }

// var filepath = process.argv[2];
// var basename = path.basename(filepath);
// var dirname = path.dirname(filepath);

// var readStream = fs.createReadStream(filepath);
// gm(readStream).identify(function(err, imgData) {
//   var photo = imgData;
//   photo['Base filename'] = basename;
//   photo['path'] = filepath;
//   console.log(photo);
// });

// const fs = require('fs-extra');
// const path = require('path');

// const BASE_PATH = process.cwd() + '/storage/cache/images';

// var pad = (num, size) => ("000000000" + num).substr(-size);

// function globDirectories(inPath) {
//   return fs.readdirSync(inPath)
//     .filter(file => fs.statSync(path.join(inPath, file)).isDirectory());
// }

// function getCachePath(inPath) {
//   // This will find the first level directory with no more than 1000 entries
//    var cachePath = fs.readdirSync(inPath).find(file => {
//     let fullPath = path.join(inPath, file);
//     return fs.statSync(fullPath).isDirectory() && (globDirectories(fullPath).length <= 1000);
//   });

//   // If we have no result, we need to create a new directory
//   if (!cachePath) {
//     cachePath = path.join(inPath, pad(globDirectories(inPath).length, 3));
//     fs.mkdirSync(cachePath);
//   } else {
//     cachePath = path.join(inPath, cachePath);
//   }
  
//   // Then we create a new directory in the found graph with an incremented number
//   cachePath = path.join(cachePath, pad(globDirectories(cachePath).length, 3));
//   fs.mkdirSync(cachePath);

//   return cachePath;
// }

// console.log(getCachePath(BASE_PATH));

const lwip = require('lwip');
const path = require('path');

var image = '/storage/images/originals/dd2f88ec1ceec23ca3a36d7f59000f2b';

lwip.open(path.join(process.cwd(), image), 'jpg', function(err, image) {
  image.resize(1000, function(err, image) {
    image.writeFile(path.join(process.cwd(), 'debug.jpg'), 'jpg', function(err) {
      if (err) { console.error(err); }
    });
  });
});