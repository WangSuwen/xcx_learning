const { post, get, upload } = require('./core.js');

module.exports = {
  // 获取用户openId
  getOpenId: function (data) {
    return post('/verify', data);
  },
  // 获取城市列表
  getCities: function (data) {
    return get('/idcardopencities', data);
  },
  // 获取酒店列表
  getHotels: function (data) {
    return post('/seachidcardopen', data);
  },
  // 获取酒店房间列表
  getRooms: function (data) {
    return get(`/inn/${data}`);
  },
  // 上传照片
  uploadImg: function (filePath, formData) {
    return upload('/saveguestpicinfo', filePath, formData);
  }
};