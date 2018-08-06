const { getRooms } = require('../../api/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currHotel: '',
    checkedRoom: '', // 选中的房间
    rooms: [],
    disabled: true, // 未选中房间，按钮不可用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _innId = wx.getStorageSync('innId');
    if (_innId) {
      getRooms(_innId).then(
        result => {
          if (result && !result.code) {
            console.log('rooms-', result);
            this.setData({ currHotel: wx.getStorageSync('hotelName'), rooms: result });
          } else {
            wx.showToast({
              title: '未获取到房间',
              icon: 'none',
            });
          }
        },
        err => {
          wx.showToast({
            title: '未获取到房间',
            icon: 'none',
          });
        }
      );
    }
  },
  onReady: function() {
    
  },
  onUnload: function() {
    wx.setStorageSync('roomId', '');
    this.setData({ disabled: true });
  },
  /**
   * table组件td点击事件
   */
  clickRoomTd: function(e) {
    var roomId;
    try{
      roomId = e.detail.target.dataset.roomid;
      if (roomId) {
        this.setData({ checkedRoom: roomId, disabled: false });
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