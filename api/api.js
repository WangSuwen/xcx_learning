const { post, get } = require('./core.js');

module.exports.getCities = function(data) {
  return get('/api/b/inn/idcardopencities', data);
}
