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
    // this.container.html(`<svg t="1662590393514" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4681" width="256" height="128"><path class="arrow" d="M512 256V0l512 512-512 512V768H0V256z" p-id="4682" fill="#1296db"></path></svg>`)
    this.container.html(`
    <div class="container">
    <svg
   width="87.087944mm"
   height="22.771408mm"
   viewBox="0 0 87.087944 22.771408"
   version="1.1"
   id="svg7076"
   inkscape:version="1.2.1 (9c6d41e410, 2022-07-14)"
   sodipodi:docname="image.svg"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <sodipodi:namedview
     id="namedview7078"
     pagecolor="#ffffff"
     bordercolor="#000000"
     borderopacity="0.25"
     inkscape:showpageshadow="2"
     inkscape:pageopacity="0.0"
     inkscape:pagecheckerboard="0"
     inkscape:deskcolor="#d1d1d1"
     inkscape:document-units="mm"
     showgrid="false"
     inkscape:zoom="0.914906"
     inkscape:cx="279.26366"
     inkscape:cy="381.45995"
     inkscape:window-width="2560"
     inkscape:window-height="1369"
     inkscape:window-x="-8"
     inkscape:window-y="-8"
     inkscape:window-maximized="1"
     inkscape:current-layer="layer1" />
  <defs
     id="defs7073">
    <linearGradient
       inkscape:collect="always"
       xlink:href="#linearGradient528"
       id="linearGradient220"
       gradientUnits="userSpaceOnUse"
       x1="126.37683"
       y1="93.987343"
       x2="31.531088"
       y2="93.67392"
       gradientTransform="matrix(0.68125925,0,0,0.72005905,-139.03942,-8.1178247)" />
    <linearGradient
       inkscape:collect="always"
       id="linearGradient528">
      <stop
         style="stop-color:#6ecae6;stop-opacity:1;"
         offset="0"
         id="stop524" />
      <stop
         style="stop-color:#00ffff;stop-opacity:0;"
         offset="1"
         id="stop526" />
    </linearGradient>
  </defs>
  <g
     inkscape:label="图层 1"
     inkscape:groupmode="layer"
     id="layer1"
     transform="translate(-31.645904,-47.609427)">
    <g
       id="g8331"
       inkscape:transform-center-x="-0.54266695"
       inkscape:transform-center-y="-0.11983329"
       transform="rotate(178.98336,75.239094,59.279629)">
      <rect
         style="fill:url(#linearGradient220);fill-opacity:1;stroke-width:0.185311"
         id="rect158-6"
         width="66.393929"
         height="9.3705845"
         x="-118.74697"
         y="54.352875"
         ry="0"
         inkscape:transform-center-x="0.43539875"
         inkscape:transform-center-y="0.090486599"
         transform="matrix(-0.99999996,-2.6958218e-4,-2.4132558e-4,0.99999997,0,0)" />
      <path
         inkscape:transform-center-y="-0.4073944"
         transform="matrix(-0.51112529,0.00912828,0.00976481,0.47834938,108.76974,19.6614)"
         sodipodi:type="star"
         style="fill:#6ecae6;fill-opacity:1;stroke-width:0.264583"
         id="path4250-5"
         inkscape:flatsided="false"
         inkscape:transform-center-x="-3.7403707"
         d="m 152.40409,79.238557 -21.44181,12.486143 -19.26713,12.17394 -0.0924,-24.812229 -0.90939,-22.772787 21.53423,12.326087 z"
         inkscape:randomized="0"
         inkscape:rounded="0"
         sodipodi:arg2="1.1019539"
         sodipodi:sides="3"
         sodipodi:cx="124.93087"
         sodipodi:cy="79.81694"
         sodipodi:r1="27.479309"
         sodipodi:r2="13.34813"
         sodipodi:arg1="-0.021049522" />
    </g>
  </g>
</svg>



    `)

    $.fn.flash = function(duration, iterations) {
      duration = duration || 1000; // Default to 1 second
      iterations = iterations || 1; // Default to 1 iteration
      var iterationDuration = Math.floor(duration / iterations);
  
      for (var i = 0; i < iterations; i++) {
          this.fadeOut(iterationDuration,"swing").fadeIn(iterationDuration,"swing");
      }
      return this;
  }

  $('svg#svg7076').delay(1000).flash(1000000, 1000);

    

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
    // this.chart.render({
    //  width: width,
    //  height: height
    // })
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