const { post, get, upload } = require('./core.js');

module.exports = {
  // 获取用户openId
  getOpenId: function (data) {
    return post('/api/c/wx/acc/applet/verify', data);
  },
  // 获取城市列表
  getCities: function (data) {
    return get('/api/c/inn/idcardopencities', data);
  },
  // 获取酒店列表
  getHotels: function (data) {
    return post('/api/c/inn/seachidcardopen', data);
  },
  // 获取酒店房间列表
  getRooms: function (data) {
    return get(`/api/c/room/inn/${data}`);
  },
  // 上传照片
  uploadImg: function (filePath, formData) {
    return upload('/api/c/room/saveguestpicinfo', filePath, formData);
  }
};