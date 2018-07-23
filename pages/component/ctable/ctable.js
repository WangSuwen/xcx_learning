// pages/component/ctable/ctable.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tbody: {
      type: Array,
      value: []
    },
    col: {
      type: Number,
      value: 5
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    row: 0,
    checkedRoom: '',
  },

  attached: function() {
    var _data = this.data;
    this.setData({ row: Math.ceil(_data.tbody.length / _data.col)});
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clickRoom: function(e) {
      var roomId = e.target.dataset.roomid;
      this.setData({ checkedRoom: roomId});
      wx.setStorage({
        key: 'roomId',
        data: roomId,
      })
    }
  }
})
