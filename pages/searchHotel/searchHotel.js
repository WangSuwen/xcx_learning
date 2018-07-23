// pages/searchHotel/searchHotel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mockHotels: ['山东齐鲁店','重庆渝中店','四川蜀中店','河北冀北店','东三省黑吉辽店','苏杭天堂店','招远温泉店'],
    hotels: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.query);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  // 用户输入的handler
  searchHotel: function(e) {
    console.log(e.detail.value);
    if (e.detail.value === '1') {
      this.setData({ hotels: [] });
    } else {
      this.setData({ hotels: this.data.mockHotels });
    }
  },
  // 选中某一个酒店
  checkHotel: function(e) {
    console.log(e.target.dataset.hotelname);
    wx.setStorage({
      key: 'hotelName',
      data: e.target.dataset.hotelname,
    })
    wx.navigateBack({
      delta: 1
    });
  }
})