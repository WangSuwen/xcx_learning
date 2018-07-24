const host = 'http://myblog.loveruoxi.com';
function wxReq(url, data, reqType, option, _succ, _fail, _comp) {
  return wx.request({
    url: host + url,
    data: data,
    header: option && option.header || {},
    method: reqType,
    dataType: 'json',
    responseType: 'text',
    success: function(data) {_succ({...data.data})},
    fail: function (data, status) { _fail({...data.data})},
    complete: function(){}
  });
}

function _post(url, data, option) {
  return new Promise(function(reso, rej){
    return wxReq(url, data, 'POST', option, reso, rej);
  });
}
function _get(url, data, option) {
  return new Promise(function (reso, rej) {
    return wxReq(url, data, 'GET', option, reso, rej);
  });
}
module.exports = {
  post: _post,
  get: _get,
};