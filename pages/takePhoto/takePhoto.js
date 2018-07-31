// pages/takePhoto/takePhoto.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoSrc: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ctx = wx.createCameraContext();
  },
  /**
   * 照相
   */
  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          photoSrc: res.tempImagePath
        })
      }
    })
  },
  /**
   * 重拍
   */
  reTakePhoto: function() {
    this.setData({photoSrc: ''});
  },
  /**
   * 上传照片
   */
  uploadPhoto: function() {
    wx.showToast({
      title: '哇，抓到一人儿！'
    })
  }
})