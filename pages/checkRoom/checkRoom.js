// pages/checkRoom/checkRoom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currHotel: '',
    checkedRoom: '', // 选中的房间
    mockRooms: [
      {
        "id": 120,
        "no": "390",
        "innId": 243
      },
      {
        "id": 121,
        "no": "391",
        "innId": 243
      },
      {
        "id": 122,
        "no": "392",
        "innId": 243
      },
      {
        "id": 123,
        "no": "393",
        "innId": 243
      },
      {
        "id": 124,
        "no": "394",
        "innId": 243
      },
      {
        "id": 125,
        "no": "395",
        "innId": 243
      },
      {
        "id": 126,
        "no": "396",
        "innId": 243
      },
      {
        "id": 127,
        "no": "397",
        "innId": 243
      },
      {
        "id": 128,
        "no": "398",
        "innId": 243
      },
      {
        "id": 129,
        "no": "399",
        "innId": 243
      },
      {
        "id": 130,
        "no": "400",
        "innId": 243
      },
      {
        "id": 131,
        "no": "401",
        "innId": 243
      },
      {
        "id": 132,
        "no": "402",
        "innId": 243
      },
      {
        "id": 133,
        "no": "403",
        "innId": 243
      },
      {
        "id": 134,
        "no": "404",
        "innId": 243
      },
      {
        "id": 135,
        "no": "405",
        "innId": 243
      },
      {
        "id": 136,
        "no": "406",
        "innId": 243
      },
      {
        "id": 137,
        "no": "407",
        "innId": 243
      },
      {
        "id": 138,
        "no": "408",
        "innId": 243
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ currHotel: wx.getStorageSync('hotelName') })
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
  // table组件td点击事件
  clickRoomTd: function(e) {
    var roomId;
    try{
      roomId = e.detail.target.dataset.roomid;
      this.setData({ checkedRoom: roomId });
      wx.setStorage({
        key: 'roomId',
        data: roomId,
      });
    } catch(e) {
      console.log(e);
      wx.showToast({
        title: '选择房间失败',
      })
    }
  },
  // 确认按钮 handler
  confirmCheckRoom: function() {
    var roomId = wx.getStorageSync('roomId');
    if(roomId) {
      wx.showToast({
        title: `房间ID：${roomId}`,
        mask: true,
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