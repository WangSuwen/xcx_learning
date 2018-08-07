const { appId, appsecret } = require('../../config');
const { setCookie, getCookie } = require('../../utils/util');
const { getCities, getHotels, getOpenId } = require('../../api/index');

//获取应用实例
const app = getApp();

Page({
  data: {
    userInfo: {},
    currCity: '',
    currHotel: '',
    region: {},
    areaColumn: [],
    areaIndex: [0, 0],
    provenceArray: [],
    cityArray: [],
    countyArray: [],
    loading: false,
    isFocus: false,
  },
  onLoad: function (options) {
    const _this = this;
    if (!getCookie('openId')) {
      // 登录
      wx.login({
        success: res => {
          if (res.code) {
            // 获取appID
            getOpenId({
              appId: appId,
              secret: appsecret,
              jsCode: res.code,
              grantType: 'authorization_code'
            }).then(
              result => {
                if (!result.code) {
                  console.log('获取openId成功：', result);
                  try {
                    setCookie('openId', result);
                    _this.getCitiesAndHotels();
                  } catch (e) {
                    console.log('设置openId到cookie失败--', e);
                  }
                } else {
                  console.error('获取openId失败：', result.message);
                }
              },
              err => {
                console.error('openId--请求接口失败：', err);
              }
            )
          }
        }
      })
    } else {
      this.getCitiesAndHotels();
    }
  },
  onShow: function () {
    var _this = this;
    // 从storage中获取用户选择的酒店
    wx.getStorage({
      key: 'hotelName',
      success: function (res) {
        _this.setData({ currHotel: res.data });
      }
    });
  },
  onHide: function() {
    this.setData({ loading: false});
  },
  onUnload: function () {
    wx.clearStorageSync();
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
    })
  },
  getCitiesAndHotels: function() {
    getCities().then(
      result => {
        if (!result.code) {
          // 初始化城市数据
          let _provArr = [], _cities = [], _counties = [], _currCity = '', proIndex = 0, cityIndex = 0, countyIndex = 0;
          const provinceKeys = Object.keys(result);
          if (provinceKeys.length) {
            _provArr = provinceKeys;
            // 这里需要判断定位信息，如果没有，则默认把北京作为首选
            _currCity = '北京市';
            _cities = Object.keys(result[_currCity]);
            _counties = result[_currCity][_cities[0]];
            proIndex = provinceKeys.indexOf(_currCity);
            try {
              wx.setStorageSync('currCity', _currCity);
            } catch (e) {
              wx.showToast({
                title: '获取城市失败',
                icon: 'none',
              });
            }
            this.setData({
              currCity: _currCity,
              areaIndex: [proIndex, cityIndex, countyIndex],
              provenceArray: _provArr, // 省
              cityArray: _cities,
              countyArray: _counties,
              areaColumn: [_provArr, _cities], // 如果以后需要县级市，这里加上：_counties 即可。
              region: result,
            });
            return getHotels({
              keyword: '',
              city: _currCity,
              longitude: 0.0,
              latitude: 0.0,
              recordLimit: 1000
            });
          }
        } else {
          this.errHandler({}, '未获取到城市')
        }
      },
      err => this.errHandler(err, '未获取到城市')
    ).then(
      this.setDefaultHotel,
      err => this.errHandler(err, '未获取到酒店')
    );
  },
  errHandler: function(err, msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
    });
  },
  setDefaultHotel: function(hotels) {
    if (hotels && !hotels.code && hotels.length) {
      const hotel = hotels[0];
      this.setData({ currHotel: hotel.name });
      wx.setStorageSync('hotelName', hotel.name);
      wx.setStorageSync('innId', hotel.innId);
    } else {
      this.setData({ currHotel: '未获取到酒店' });
    }
  },
  // 省市区三级联动， 点击【确定】
  bindMultiPickerChange: function (e) {
    var _currCity = this.data.areaColumn[1][this.data.areaIndex[1]];
    this.setData({
      currCity: _currCity
    });
    try{
      wx.setStorageSync('currCity', _currCity);
      // 查当前选中的市的酒店
      getHotels({
        keyword: '',
        city: _currCity,
        longitude: 0.0,
        latitude: 0.0,
        recordLimit: 1000
      }).then(this.setDefaultHotel, err => this.errHandler(err, '未获取到酒店'))
    } catch (e) {
      this.errHandler(e, '保存城市失败');
    }
  },
  // 省市区三级联动， 滚动任意一列
  bindMultiPickerColumnChange: function (e) {
    const _data = this.data, _areaColumnLength = _data.areaColumn.length;
    const data = {
      areaColumn: _data.areaColumn,
      areaIndex: _data.areaIndex
    }, _val = e.detail.value, _col = e.detail.column;
    data.areaIndex[_col] = _val;
    if (_col === 0) {
      data.cityArray = Object.keys(_data.region[_data.provenceArray[_val]]);
      data.countyArray = _data.region[_data.provenceArray[_val]][data.cityArray[0]];
      data.areaColumn = _areaColumnLength === 3 ? [_data.provenceArray, data.cityArray, data.countyArray] : [_data.provenceArray, data.cityArray];
      data.areaIndex = _areaColumnLength === 3 ? [_val, 0, 0] : [_val, 0];
    } else if (_col === 1) {
      data.areaColumn = [_data.provenceArray, _data.cityArray];
      _areaColumnLength === 3 && (data.areaColumn[2] = _data.region[_data.provenceArray[_data.areaIndex[0]]][_data.cityArray[_val]]);
    }
    this.setData(data);
  },
  // 输入框获取焦点以后
  focusHandler: function() {
    var _this = this;
    wx.navigateTo({
      url: '../searchHotel/searchHotel',
      success: function() {
        _this.setData({ isFocus: false });
      }
    });
  },
  // 确定按钮
  confirm: function() {
    var _this = this;
    var innId, hotelName, currCity;
    try{
      innId = wx.getStorageSync('innId');
    } catch(e) {
      this.errHandler(e, '获取酒店失败');
    }
    try {
      hotelName = wx.getStorageSync('hotelName');
    } catch (e) {
      this.errHandler(e, '获取酒店失败');
    }
    try {
      currCity = wx.getStorageSync('currCity');
    } catch (e) {
      this.errHandler(e, '获取城市失败');
    }
    if (innId && hotelName && currCity) {
      this.setData({ loading: true });
      wx.navigateTo({
        url: '../checkRoom/checkRoom',
      });
    } else {
      var errMsg = !innId && !hotelName ? '请选择入住酒店' : '请选择城市';
      this.errHandler(e, '请选择入住酒店');
    }
  }
})
