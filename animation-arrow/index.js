var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');
//var Chart = require('XXX');

/**
 * 马良基础类
 */
module.exports = Event.extend(function Base(container, config) {
  this.config = {
    theme: {}
  }
  this.container = $(container);           //容器
  this.apis = config.apis;                 //hook一定要有
  this._data = null;                       //数据
  this.chart = null;                       //图表
  this.init(config);
}, {
  /**
   * 公有初始化
   */
  init: function (config) {
    //1.初始化,合并配置
    this.mergeConfig(config);
    //2.刷新布局,针对有子组件的组件 可有可无
    this.updateLayout();
    //3.子组件实例化
    //this.chart = new Chart(this.container[0], this.config);
    //4.如果有需要, 更新样式
    this.updateStyle();
  },
  /**
   * 绘制
   * @param data
   * @param options 不一定有
   * !!注意: 第二个参数支持config, 就不需要updateOptions这个方法了
   */
  render: function (data, config) {
    data = this.data(data);
    var cfg = this.mergeConfig(config);
    //更新图表
    //this.chart.render(data, cfg);
    this.container.html(`<div class="main">
    <div class="circle1 prop"></div>
    <div class="void__1 prop_Void"></div>
    <div class="circle2 prop"></div>
    <div class="void__2 prop_Void"></div>
    <div class="circle3 prop"></div>
    <div class="void__3 prop_Void"></div>
    <div class="circle3_1 prop"></div>
    <div class="void__3_1 prop_Void"></div>
    <div class="circle3_2 prop"></div>
    <div class="void__3_2 prop_Void"></div>
    <div class="circle4 prop"></div>
    <div class="void__4 prop_Void"></div>
    <div class="circle5 prop"></div>
    <div class="void__5 prop_Void"></div>
    <div class="circle6 prop"></div>
    <div class="void__6 prop_Void"></div>
    <div class="circle7 prop"></div>
    <div class="void__7 prop_Void"></div>
    <div class="circle7_1 prop"></div>
    <div class="void__7_1 prop_Void"></div>
    <div class="circle7_2 prop"></div>
    <div class="void__7_2 prop_Void"></div>
    <div class="circle8 prop"></div>
    <div class="void__8 prop_Void"></div>
    <div class="circle9 prop"></div>
    <div class="void__9 prop_Void"></div>
    <div class="circle10 prop"></div>
    <div class="circle11 prop"></div>
    <div class="void__11 prop_Void"></div>
    <div class="circle12 prop"></div>
    <div class="void__12 prop_Void"></div>
    <div class="circle13 prop"></div>
    <div class="void__13 prop_Void"></div>
    <div class="circle14 prop"></div>
    <div class="void__14 prop_Void"></div>
  </div>`)

    $('div.main').css({
      "position": "absolute",
      "width": "410px",
      "height": "410px",
      "padding": "100px",
      "background-color": "#0F0F0F",
      "top": "50%",
      "left": "50%",
      "margin-right": "-50%",
      "transform": "translate(-50%, -50%)"
    })

    $('div.prop').css({
      "position": "absolute",
      "border-radius": "50%"
    })

    $('div.prop_Void').css({
      "position": "absolute",
      "border-radius": "50%",
      "background-color": "#0F0F0F"
    })

    $('div.circle1').css({  
    "width": "400px",
    "height": "400px",
    "background": "linear-gradient(30deg, #fff 100%, transparent 100%) 0 0",
    "background-size": "50% 50%",
    "background-repeat": "no-repeat"
  })

  $('div.void__1').css({
    "width": "386px",
    "height": "386px",
    "margin-left": "7px",
    "margin-top": "7px"
  })

  $('div.circle2').css({
    "width": "380px",
    "height": "380px",
    "margin-left": "10px",
    "margin-top": "10px",
    "background": "linear-gradient(30deg, #a9a9a9 100%, transparent 100%) 0 0",
    "background-size": "50% 50%",
    "background-repeat": "no-repeat"
  })

  $('div.void__2').css({
    "width": "360px",
    "height": "360px",
    "margin-left": "20px",
    "margin-top": "20px"
  })
    console.log(this.container.html);

    $(document).ready(function() {
      rotateCircles();
    });
    
    function rotateCircles() {
      $('div[class*="circle"]').each(function() {
        var that = this,
          direction = ["-", "+"],
          chosenDirection = direction[Math.floor(Math.random() * direction.length)],
          speed = Math.floor((Math.random() * 250) + 100),
          looper = setInterval(circleMove, 2000);
    
        function circleMove() {
          $(that).animate({
            rotation: chosenDirection + '=' + speed
          }, {
            duration: 2000,
            easing: 'linear',
            step: function(now) {
              $(that).css({
                "transform": "rotate(" + now + "deg)"
              });
            }
          });
        }
        circleMove();
      });
    }


    //如果有需要的话,更新样式
    this.updateStyle();
  },
  /**
   *
   * @param width
   * @param height
   */
  resize: function (width, height) {
    this.updateLayout(width, height);
    //更新图表
    //this.chart.render({
    //  width: width,
    //  height: height
    //})
  },
  /**
   * 每个组件根据自身需要,从主题中获取颜色 覆盖到自身配置的颜色中.
   * 暂时可以不填内容
   */
  setColors: function () {
    //比如
    //var cfg = this.config;
    //cfg.color = cfg.theme.series[0] || cfg.color;
  },
  /**
   * 数据,设置和获取数据
   * @param data
   * @returns {*|number}
   */
  data: function (data) {
    if (data) {
      this._data = data;
    }
    return this._data;
  },
  /**
   * 更新配置
   * 优先级: config.colors > config.theme > this.config.theme > this.config.colors
   * [注] 有数组的配置一定要替换
   * @param config
   * @private
   */
  mergeConfig: function (config) {
    if (!config) {return this.config}
    this.config.theme = _.defaultsDeep(config.theme || {}, this.config.theme);
    this.setColors();
    this.config = _.defaultsDeep(config || {}, this.config);
    return this.config;
  },
  /**
   * 更新布局
   * 可有可无
   */
  updateLayout: function () {},
  /**
   * 更新样式
   * 有些子组件控制不到的,但是需要控制改变的,在这里实现
   */
  updateStyle: function () {
    var cfg = this.config;
    this.container.css({
      'font-size': cfg.size + 'px',
      'color': cfg.color || '#fff'
    });
  },
  /**
   * 更新配置
   * !!注意:如果render支持第二个参数options, 那updateOptions不是必须的
   */
  //updateOptions: function (options) {},
  /**
   * 更新某些配置
   * 给可以增量更新配置的组件用
   */
  //updateXXX: function () {},
  /**
   * 销毁组件
   */
   destroy: function(){console.log('请实现 destroy 方法')}
});