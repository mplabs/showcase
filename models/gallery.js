
function Gallery(app) {
  const db = app.locals.db.collection('galleries');

  return {

    create: function(name, data) {
      data = Object.assign({
        name: name,
        coverImage: null,
        collections: [],
        images: []
      }, data);

      return new Promise((resolve, reject) => {
        db.insertOne(data, (err, doc) => {
          if (err) reject(err);
          else resolve(doc);
        })
      });
    },

    get: function(name) {
      return new Promise((resolve, reject) => {
        db.findOne({ name: name }, (err, docs) => {
          if (err) reject(err);
          else resolve(docs);
        });
      });
    },

    all: function(limit) {
      limit = limit || 0;
      return new Promise((resolve, reject) => {
        db.find(limit).toArray((err, docs) => {
          if (err) { reject(err); }
          else resolve(docs);
        });
      });
    }
  };
}

module.exports = Gallery;
