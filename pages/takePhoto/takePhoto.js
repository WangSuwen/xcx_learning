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
    cameraCompetence: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.camera']) {
          console.log('获取到的权限列表：', res.authSetting['scope.camera']);
          wx.setStorageSync('cameraCompetence', true);
          this.setData({ cameraCompetence: true});
          _this.ctx = wx.createCameraContext();
        }
      },
      fail: err => {
        console.log('获取到的权限列表报错：', err);
      }
    })
  },
  onShow() {
    if (this.data.photoSrc) {
      this.setData({'photoSrc': ''});
    }
  },
  /**
   * 用户禁止使用相机权限
   */
  forbidCamera() {
    wx.setStorageSync('cameraCompetence', false);
    wx.redirectTo({
      url: '../uploadSucc/uploadSucc',
    });
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