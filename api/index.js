const { post, get } = require('./core.js');

// 获取用户openId
module.exports.getOpenId = function (data) {
  return get('/api/b/inn/getOpenId', data);
}
// 获取城市列表
module.exports.getCities = function(data) {
  return get('/api/b/inn/idcardopencities', data);
}
