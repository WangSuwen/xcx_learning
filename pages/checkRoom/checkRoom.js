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
    this.loadRooms(_innId);
  },
  onShow() {
    const _innId = wx.getStorageSync('innId');
    // this.loadRooms(_innId);
  },
  onUnload: function() {
    wx.setStorageSync('roomId', '');
    this.setData({ disabled: true, rooms: [] });
  },
  loadRooms(innId) {
    const _this = this;
    if (innId) {
      getRooms(innId).then(
        result => {
          if (result && !result.code) {
            const _showRows = Math.ceil(result.length / _this.data.showColumn);
            this.setData({ showRows: (_showRows > 5 ? 5 : _showRows + 1) });
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
    } else {
      this.errHandler({}, '获取房间失败');
    }
  },
  errHandler: function (err, msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
    });
  },
  /**
   * table组件td点击事件
   */
  clickRoomTd: function(e) {
    var roomId;
    try{
      roomId = e.detail.target.dataset.roomid;
      if (roomId) {
        if (roomId == this.data.checkedRoom) {
          this.setData({ checkedRoom: '', disabled: true });
          wx.setStorageSync('roomId', '');
        } else {
          this.setData({ checkedRoom: roomId, disabled: false });
          wx.setStorageSync('roomId', roomId); 
        }
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
  },
  /**
   * 
   */
  changeHotel: function() {
    wx.setStorageSync('comefrom', 'checkroom');
    wx.redirectTo({
      url: '../searchHotel/searchHotel',
    });
  }
})