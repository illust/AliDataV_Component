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
    
<svg
width="87.150734mm"
height="22.771mm"
viewBox="0 0 87.150734 22.771"
version="1.1"
id="svg11375"
inkscape:version="1.2.1 (9c6d41e410, 2022-07-14)"
sodipodi:docname="drawer.svg"
xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
xmlns:xlink="http://www.w3.org/1999/xlink"
xmlns="http://www.w3.org/2000/svg"
xmlns:svg="http://www.w3.org/2000/svg">
<sodipodi:namedview
  id="namedview11377"
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
  inkscape:cx="200.56705"
  inkscape:cy="490.7608"
  inkscape:window-width="2560"
  inkscape:window-height="1369"
  inkscape:window-x="-8"
  inkscape:window-y="-8"
  inkscape:window-maximized="1"
  inkscape:current-layer="layer1" />
<defs
  id="defs11372">
 <linearGradient
    inkscape:collect="always"
    id="linearGradient18933">
   <stop
      style="stop-color:#6ecae6;stop-opacity:1;"
      offset="0"
      id="stop18929" />
   <stop
      style="stop-color:#6ecae6;stop-opacity:0;"
      offset="1"
      id="stop18931" />
 </linearGradient>
 <linearGradient
    inkscape:collect="always"
    xlink:href="#linearGradient18933"
    id="linearGradient18935"
    x1="95.433296"
    y1="32.967869"
    x2="159.63388"
    y2="33.257061"
    gradientUnits="userSpaceOnUse" />
</defs>
<g
  inkscape:label="图层 1"
  inkscape:groupmode="layer"
  id="layer1"
  transform="translate(-46.337776,-18.71098)">
 <g
    id="g19026"
    transform="translate(-27.184031,-2.8919182)">
   <rect
      style="fill:url(#linearGradient18935);fill-opacity:1;stroke-width:0.264583"
      id="rect12637"
      width="66.396004"
      height="9.3879995"
      x="94.276535"
      y="28.629992" />
   <path
      sodipodi:type="star"
      style="fill:#6ecae6;fill-opacity:1;stroke-width:0.264583"
      id="path18867"
      inkscape:flatsided="false"
      sodipodi:sides="3"
      sodipodi:cx="29.208372"
      sodipodi:cy="24.00292"
      sodipodi:r1="8.4313183"
      sodipodi:r2="4.2156587"
      sodipodi:arg1="1.0303768"
      sodipodi:arg2="2.0775744"
      inkscape:rounded="0"
      inkscape:randomized="0"
      d="m 33.54625,31.232716 -6.384002,-3.543991 -6.384001,-3.54399 6.261187,-3.756712 6.261186,-3.756713 0.122814,7.300703 z"
      inkscape:transform-center-x="3.3807203"
      inkscape:transform-center-y="-0.11058007"
      transform="matrix(1.6522552,0,0,1.5595074,39.190841,-4.3337529)" />
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

  $('svg#svg11375').flash(1000000, 1000);
    

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