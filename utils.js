// Provide simple property merging
module.exports.merge = function(src, dest, overwrite) {
  if (Array.isArray(src) || Array.isArray(dest) || typeof src !== 'object' || typeof dest !== 'object') {
    return dest;
  }

  overwrite = overwrite || false;

  for (var key in src) {
    if (typeof src[key] !== 'function' && (!dest[key] || overwrite)) {
      dest[key] = src[key];
    }
  }

  return dest;
};