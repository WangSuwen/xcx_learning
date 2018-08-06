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
  },
  /**
   * 照相
   */
  takePhoto() {
    const _this = this;
    this.ctx.takePhoto({
      quality: 'normal',
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
  setUploadStatusSync: function(status) {
    wx.setStorageSync('uploadStatus', status);
  },
  /**
   * 上传照片
   */
  uploadPhoto: function() {
    let roomId, _this = this;
    try {
      roomId = wx.getStorageSync('roomId');
    } catch (e) {
      console.error('获取roomId失败：', e);
      this.setUploadStatusSync(false);
    }
    uploadImg(this.data.photoSrc, { roomId: roomId }).then(
      result => {
        if(result.data){
          this.setUploadStatusSync(true);
        } else {
          console.error('上传失败：', result.message);
          this.setUploadStatusSync(false);
        }
        wx.navigateTo({
          url: '../uploadSucc/uploadSucc',
        });
      },
      err => {
        console.error('上传失败：', err);
        this.setUploadStatusSync(false);
        wx.navigateTo({
          url: '../uploadSucc/uploadSucc',
        });
      }
    );
  },
  /**
   * 退回到上一页面
   */
  goBack: function() {
    wx.navigateBack({
      delta: 1
    });
  }
})