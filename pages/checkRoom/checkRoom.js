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
    showColumn: 3, // 表格展示的列数
    showRows: 5, // 展示的行数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _innId = wx.getStorageSync('innId');
    const _this = this;
    if (_innId) {
      getRooms(_innId).then(
        result => {
          if (result && !result.code) {
            console.log('rooms-', result);
            result[2]['no'] = '很长很长很长很长很长很长很长的名字'; // 这个要删掉
            const _showRows = Math.ceil(result.length / _this.data.showColumn);
            this.setData({ showRows: ( _showRows > 5 ? 5 : _showRows + 1)});
            result = result.map((room) => {
              if (room.no.length > 10) {
                room.no = room.no.substr(0, 10) + '...'
              }
              return room;
            });
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