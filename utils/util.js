// AppId:wx0336f4afbd435512
// AppSecret: e28081a0fb8a10f1115c43c2aa40a324
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getCookie(name) {
  const cookieStr = wx.getStorageSync('cookie');
  let cStart = cookieStr.indexOf(`${name}=`);
  let cEnd;
  if (cStart !== -1) {
    cStart += name.length + 1;
    cEnd = cookieStr.indexOf(';', cStart);
    if (cEnd === -1) {
      cEnd = cookieStr.length;
    }
    return unescape(cookieStr.slice(cStart, cEnd)) || '';
  }
  return '';
}
function setCookie(sKey, sValue) {
  if (!sKey || !sValue ) {
    return false;
  }
  try {
    wx.setStorageSync('cookie', encodeURIComponent(sKey) + '=' + encodeURIComponent(sValue));
    return true;
  } catch(e) {
    console.error('设置cookie失败--', e);
    return false;
  }
}

function cookies() {
  return wx.getStorageSync('cookie') || '';
}

module.exports = {
  formatTime: formatTime,
  setCookie: setCookie,
  getCookie: getCookie,
  cookies: cookies
}
