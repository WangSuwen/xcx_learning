const { apiHost } = require('../config.js');
const { cookies } = require('../utils/util');

function wxReq(url, data, reqType, header, _succ, _fail, _comp) {
  return wx.request({
    url: apiHost + url,
    data: data,
    header: header && { header, 'cookie': cookies() } || { 'cookie': cookies() },
    method: reqType,
    dataType: 'json',
    responseType: 'text',
    success: function (data, statusCode, header) {
      let _result = { statusCode: statusCode, header: header};
      _result = data.data.error ? { ...data.data.error, ..._result } : _succ({ ...data.data.data, ..._result});
      _succ(_result);
    },
    fail: function (data, status) { _fail({...data.data})},
    complete: function(){}
  });
}

function _post(url, data, header) {
  return new Promise(function(reso, rej){
    return wxReq(url, data, 'POST', header, reso, rej);
  });
}
function _get(url, data, header) {
  return new Promise(function (reso, rej) {
    return wxReq(url, data, 'GET', header, reso, rej);
  });
}
module.exports = {
  post: _post,
  get: _get,
};