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
    },
    // 页面做多展示多少行，超过则展示滚动条
    showRows: {
      type: Number,
      value: 5,
    },
    customEvent: {
      type: String,
    },
    checkedRoom: {
      type: Number,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    row: 0,
  },

  attached: function() {
    var _data = this.data;
    this.setData({ row: Math.ceil(_data.tbody.length / _data.col)});
  },
  detached: function() {
    wx.setStorageSync('roomId', '');
  },
  /**
   * 组件的方法列表
   */
  methods: {
    clickRoom: function(e) {
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent(this.data.customEvent, e, myEventOption)
    }
  }
})
