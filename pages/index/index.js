//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    currCity: '',
    currHotel: '',
    region: [],
    mockCities: [
      { provience: "河北", cities: ['石家庄', '唐山'] },
      { provience: "山东", cities: ['烟台', '青岛', '威海'] },
      { provience: "河南", cities: ['郑州', '开封'] },
      { provience: "北京", cities: ['朝阳区', '昌平区'] },
      { provience: "浙江", cities: ['杭州', '宁波'] },
      { provience: "江苏", cities: ['南京', '苏州'] },
      { provience: "重庆", cities: ['渝北区', '合川区'] },
    ],
    areaColumn: [],
    provenceArray: [],
    municipalArray: [],
    areaIndex: [0, 0],
    loading: false,
    isFocus: false,
  },
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // 初始化城市数据
    var _provArr = [], _municipalArr = [];
    // TODO: 这里应该调用API 获取城市列表，并默认把北京作为首选（现在没有定位功能，后续可能添加定位功能）
    this.data.mockCities && this.data.mockCities.length && this.data.mockCities.map((city, index) => {
      city.provience === '北京' && (
        this.setData({
          currCity: city.provience,
          areaIndex: [index, 0]
        })
      )
      _provArr.push(city.provience);
      _municipalArr.push(city.cities);
    }) && (this.setData({
        provenceArray: _provArr, 
        municipalArray: _municipalArr,
        areaColumn: [_provArr, _municipalArr[0]],
      }));
    // 这里应调用对应默认城市的酒店列表，并填充第一个结果
    this.setData({ currHotel: '山东齐鲁店' });  
  },
  onShow: function () {
    var _this = this;
    // 从storage中获取用户选择的酒店
    wx.getStorage({
      key: 'hotelName',
      success: function (res) {
        _this.setData({ currHotel: res.data });
        // wx.clearStorageSync();
      }
    })
  },
  onHide: function() {
    this.setData({ loading: false});
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 省市区三级联动
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
      currCity: e.detail.value[1],
    })
  },
  bindMultiPickerChange: function (e) {
    this.setData({
      currCity: this.data.areaColumn[1][this.data.areaIndex[1]]
    })
  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      areaColumn: this.data.areaColumn,
      areaIndex: this.data.areaIndex
    }, _val = e.detail.value, _col = e.detail.column;
    data.areaIndex[_col] = _val;
    _col === 0 && (data.areaColumn[1] = this.data.municipalArray[_val]);
    this.setData(data);
  },
  // 输入框获取焦点以后
  focusHandler: function() {
    var _this = this;
    wx.navigateTo({
      url: '../searchHotel/searchHotel',
      success: function() {
        _this.setData({ isFocus: false });
      }
    });
    console.log("获取了焦点");
  },
  // 确定按钮
  confirm: function() {
    var _this = this;
    this.setData({ loading: true });
    wx.navigateTo({
      url: '../checkRoom/checkRoom',
      success: function () {}
    });
  }
})
