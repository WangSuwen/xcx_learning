const { apiHost } = require('../config.js');
const { cookies } = require('../utils/util');

const defaultHeader = {
  cookie: cookies()
}
function wxReq(url, data, reqType, header, _succ, _fail, _comp) {
  return wx.request({
    url: apiHost + url,
    data: data,
    header: header && { ...header, cookie: cookies() } || { cookie: cookies()},
    method: reqType,
    dataType: 'json',
    responseType: 'text',
    success: function (data, statusCode, header) {
      let _result, _data = data.data;
      if (_data.error) {
        _result = { ..._data.error }
      } else if (_data.data) {
        _result = _data.data;
      } else {
        return _fail(statusCode);
      }
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

function _upload(url, filePath, formData, header) {
  return new Promise((reso, rej) => {
    return wx.uploadFile({
      url: apiHost + url,
      filePath: filePath,
      name: 'file',
      formData: formData,
      header: header && { ...header, cookie: cookies() } || { cookie: cookies()},
      success: (data => {
        const _result = data.error ? { ...data.error } : data.data;
        reso(JSON.parse(_result));
      }),
      fail: (data => rej(data))
    })
  });
}
module.exports = {
  post: _post,
  get: _get,
  upload: _upload,
};