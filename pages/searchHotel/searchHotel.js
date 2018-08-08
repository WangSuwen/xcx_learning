// pages/searchHotel/searchHotel.js
const { getHotels } = require('../../api/index');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hotels: null,
    userInputs: '',
  },
  onLoad: function() {
    // let _hotelName = wx.getStorageSync('hotelName');
    // _hotelName = _hotelName.length < 16 ? _hotelName : _hotelName.substr(0, 14) + '...';
    // this.setData({ userInputs: _hotelName});
  },
  /**
   * 用户输入的handler
   */
  searchHotel: function(e) {
    this.setData({'userInputs': e.detail.value.trim()});
    getHotels({
      keyword: e.detail.value.trim(),
      city: wx.getStorageSync('currCity'),
      longitude: 0.0,
      latitude: 0.0,
      recordLimit: 1000
    }).then(
      result => {
        if (result && !result.code) {
          this.setData({hotels: result});
        }
      },
      err => {
        wx.showToast({
          title: '未获取到酒店',
          icon: 'none',
        });
      }
    );
  },
  /**
   *  选中某一个酒店
   */
  checkHotel: function(e) {
    wx.setStorage({
      key: 'hotelName',
      data: e.target.dataset.hotelname,
    })
    wx.setStorageSync('innId', e.target.dataset.innid);
    if (wx.getStorageSync('comefrom') === 'checkroom') {
      wx.redirectTo({
        url: '../checkRoom/checkRoom',
      })
    } else {
      wx.navigateBack({
        delta: 1
      });
    }
  },
  /**
   * 取消 按钮
   */
  cancelSearch: function() {
    wx.navigateBack({
      delta: 1,
    });
  },
  /**
   * 叉号按钮
   */
  clearSearch: function() {
    this.setData({ hotels: [], userInputs: '' });
  }
})