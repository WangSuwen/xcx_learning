var _mockRooms = require('../../mock/rooms.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currHotel: '',
    checkedRoom: '', // 选中的房间
    // rooms: [],
    rooms: _mockRooms.rooms,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ currHotel: wx.getStorageSync('hotelName') })
  },
  onUnload: function() {
    wx.setStorageSync('roomId', '');
  },
  /**
   * table组件td点击事件
   */
  clickRoomTd: function(e) {
    var roomId;
    try{
      roomId = e.detail.target.dataset.roomid;
      if (roomId) {
        this.setData({ checkedRoom: roomId });
        wx.setStorageSync('roomId', roomId);
      } else {
        throw Error();
      }
    } catch(e) {
      wx.showToast({
        title: '选择房间失败',
        icon: 'none',
      })
    }
  },
  /**
   * 确认按钮 handler
   */
  confirmCheckRoom: function() {
    var roomId = wx.getStorageSync('roomId');
    if(roomId) {
      // wx.showToast({
      //   title: `房间ID：${roomId}`,
      //   mask: true,
      // });
      wx.navigateTo({
        url: '../takePhoto/takePhoto',
      });
    } else {
      wx.showToast({
        title: '请选择房间',
        icon: 'none',
        mask: true,
      });
    }
  }
})