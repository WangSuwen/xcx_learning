// pages/takePhoto/takePhoto.js
const { uploadImg } = require('../../api/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoSrc: '',
    windowHeight: 0,
    toPx: 0,
    cameraHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ctx = wx.createCameraContext();
    // 获取系统信息
    const sysInfo = wx.getSystemInfoSync(),
      _windowHeight = sysInfo.windowHeight,
      _toPx = sysInfo.screenWidth / 750,
      _cameraHeight = _windowHeight - 48 * _toPx;
    this.setData({
      windowHeight: _windowHeight,
      toPx: _toPx,
      cameraHeight: _cameraHeight 
    });
  },
  /**
   * 照相
   */
  takePhoto() {
    const _this = this;
    this.ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        const filePath = res.tempImagePath;
        _this.setData({
          photoSrc: res.tempImagePath
        });
      }
    })
  },
  /**
   * 重拍
   */
  reTakePhoto: function() {
    this.setData({ photoSrc: ''});
  },
  /**
   * 上传照片
   */
  uploadPhoto: function() {
    let roomId;
    try {
      roomId = wx.getStorageSync('roomId');
    } catch (e) {
      console.error('获取roomId失败：', e);
      wx.showToast({
        title: '上传失败！',
        icon: 'none',
      })
    }
    uploadImg(this.data.photoSrc, { roomId: roomId }).then(
      result => {
        if(!result.status){
          wx.showToast({
            title: '上传成功！'
          })
        } else {
          console.error('上传失败：', result.message);
          wx.showToast({
            title: '上传失败',
            icon: 'none',
          })
        }
      },
      err => {
        console.error('上传失败：', err);
        wx.showToast({
          title: '上传失败！',
          icon: 'none',
        })
      }
    );
  }
})