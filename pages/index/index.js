const { appId, appsecret } = require('../../config');
const { setCookie } = require('../../utils/util');
const { getOpenId, getCities } = require('../../api/index');
//获取应用实例
const app = getApp();

Page({
  data: {
    userInfo: {},
    currCity: '',
    currHotel: '',
    region: [],
    mockCities: [
      { provience: "河北", cities: ['石家庄', '唐山'] },
      { provience: "山东", cities: ['烟台', '青岛', '威海'] },
      { provience: "河南", cities: ['郑州', '开封'] },
      { provience: "北京", cities: ['朝阳区', '昌平区'] },
      { provience: "浙江", cities: ['杭州', '宁波'] },
      { provience: "江苏", cities: ['南京', '苏州'] },
      { provience: "重庆", cities: ['渝北区', '合川区'] },
    ],
    areaColumn: [],
    provenceArray: [],
    municipalArray: [],
    areaIndex: [0, 0],
    loading: false,
    isFocus: false,
  },
  onLoad: function (options) {
    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          // 获取appID
          getOpenId({
            appid: appId,
            secret: appsecret,
            js_code: res.code,
            grant_type: 'authorization_code'
          }).then(
            result => {
              if(!result.code) {
                console.log('获取openId成功：', result);
                if (setCookie('openID', 'asdfghjklsdfghj')) {
                  return getCities();
                }
              } else {
                console.error('获取openId失败：', result.message);
                // 临时写在这里。
                if (setCookie('openID', 'asdfghjklsdfghj')) {
                  return getCities();
                }
              }
            },
            err => {
              console.error('openId--请求接口失败：', err);
            }
          ).then(
            result => {
              if(!result.code) {
                
              } else {
                console.log('getCities--error:', result);
              }
            }
          );
        } else {
          console.error('登录失败');
        }
      }
    })
    // 初始化城市数据
    var _provArr = [], _municipalArr = [];
    // TODO: 这里应该调用API 获取城市列表，并默认把北京作为首选（现在没有定位功能，后续可能添加定位功能）
    this.data.mockCities && this.data.mockCities.length && this.data.mockCities.map((city, index) => {
      if(city.provience === '北京') {
        this.setData({
          currCity: city.provience,
          areaIndex: [index, 0]
        })
        try {
          wx.setStorageSync('currCity', city.provience);
        } catch (e) {
          wx.showToast({
            title: '获取城市失败',
            icon: 'none',
          });
        }
      }
      _provArr.push(city.provience);
      _municipalArr.push(city.cities);
    }) && (this.setData({
        provenceArray: _provArr, 
        municipalArray: _municipalArr,
        areaColumn: [_provArr, _municipalArr[0]],
      }));
    // 这里应调用 API 获取对应默认城市的酒店列表，并填充第一个结果
    this.setData({ currHotel: '山东齐鲁店' });
    wx.setStorageSync('hotelName', '山东齐鲁店');
    wx.setStorageSync('innId', 10028);
    
  },
  onShow: function () {
    var _this = this;
    // 从storage中获取用户选择的酒店
    wx.getStorage({
      key: 'hotelName',
      success: function (res) {
        _this.setData({ currHotel: res.data });
      }
    })
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
  // 省市区三级联动
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
      currCity: e.detail.value[1],
    })
  },
  bindMultiPickerChange: function (e) {
    var _currCity = this.data.areaColumn[1][this.data.areaIndex[1]];
    this.setData({
      currCity: _currCity
    });
    try{
      wx.setStorageSync('currCity', _currCity);
    } catch (e) {
      wx.showToast({
        title: '保存城市失败',
        icon: 'none',
      });
    }
  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      areaColumn: this.data.areaColumn,
      areaIndex: this.data.areaIndex
    }, _val = e.detail.value, _col = e.detail.column;
    data.areaIndex[_col] = _val;
    _col === 0 && (data.areaColumn[1] = this.data.municipalArray[_val]);
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
    console.log("获取了焦点");
  },
  // 确定按钮
  confirm: function() {
    var _this = this;
    var innId, hotelName, currCity;
    try{
      innId = wx.getStorageSync('innId');
    } catch(e) {
      wx.showToast({
        title: '获取酒店ID失败',
        icon: 'none',
      });
    }
    try {
      hotelName = wx.getStorageSync('hotelName');
    } catch (e) {
      wx.showToast({
        title: '获取酒店名称失败',
        icon: 'none',
      });
    }
    try {
      currCity = wx.getStorageSync('currCity');
    } catch (e) {
      wx.showToast({
        title: '获取城市失败',
        icon: 'none',
      });
    }
    if (innId && hotelName && currCity) {
      this.setData({ loading: true });
      wx.navigateTo({
        url: '../checkRoom/checkRoom',
      });
    } else {
      var errMsg = !innId && !hotelName ? '请选择入住酒店' : '请选择城市';
      wx.showToast({
        title: '请选择入住酒店',
        icon: 'none',
      });
    }
  }
})
