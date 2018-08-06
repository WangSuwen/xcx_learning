// pages/searchHotel/searchHotel.js
const { getHotels } = require('../../api/index');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hotels: null
  },
  // 用户输入的handler
  searchHotel: function(e) {
    console.log(e.detail.value);
    getHotels({
      keyword: e.detail.value.trim(),
      city: wx.getStorageSync('currCity'),
      longitude: 0.0,
      latitude: 0.0,
      recordLimit: 1000
    }).then(
      result => {
        if (result && !result.code) {
          console.log(123456, result);
          this.setData({hotels: result});
        } else {
          wx.showToast({
            title: '未获取到酒店',
            icon: 'none',
          });
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
  // 选中某一个酒店
  checkHotel: function(e) {
    wx.setStorage({
      key: 'hotelName',
      data: e.target.dataset.hotelname,
    })
    wx.setStorageSync('innId', e.target.dataset.innid);
    wx.navigateBack({
      delta: 1
    });
  }
})