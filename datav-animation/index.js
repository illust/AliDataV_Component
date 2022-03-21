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
    this.container.html(data[0].value)
    console.log("data",data);
    console.log("cfg",cfg);
    console.log("this.container",this.container);
    var htm = `
    <div class="wrap">
    <div class="container">
    <div class="card">
      <div class="face face1">
        <div class="content">
          <img src="https://github.com/Jhonierpc/WebDevelopment/blob/master/CSS%20Card%20Hover%20Effects/img/design_128.png?raw=true">
          <h3>Design</h3>
        </div>
      </div>
      <div class="face face2">
        <div class="content">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cum cumque minus iste veritatis provident at.</p>
          <a href="#">Read More</a>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="face face1">
        <div class="content">
          <img src="https://github.com/Jhonierpc/WebDevelopment/blob/master/CSS%20Card%20Hover%20Effects/img/code_128.png?raw=true">
          <h3>Code</h3>
        </div>
      </div>
      <div class="face face2">
        <div class="content">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cum cumque minus iste veritatis provident at.</p>
          <a href="#">Read More</a>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="face face1">
        <div class="content">
          <img src="https://github.com/Jhonierpc/WebDevelopment/blob/master/CSS%20Card%20Hover%20Effects/img/launch_128.png?raw=true">
          <h3>Launch</h3>
        </div>
      </div>
      <div class="face face2">
        <div class="content">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cum cumque minus iste veritatis provident at.</p>
          <a href="#">Read More</a>
        </div>
      </div>
    </div>
  </div>
  </body>
  <style type="text/css">
      .wrap{
        margin: 0;
        padding: 0;
        min-height: 100vh;
        background: #333;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: consolas;
    }

    .container{
        width: 1000px;
        position: relative;
        display: flex;
        justify-content: space-between;
    }

    .container .card{
        position: relative;
        cursor: pointer;
    }

    .container .card .face{
        width: 300px;
        height: 200px;
        transition: 0.5s;
    }

    .container .card .face.face1{
        position: relative;
        background: #333;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
        transform: translateY(100px);
    }

    .container .card:hover .face.face1{
        background: #ff0057;
        transform: translateY(0);
    }

    .container .card .face.face1 .content{
        opacity: 0.2;
        transition: 0.5s;
    }

    .container .card:hover .face.face1 .content{
        opacity: 1;
    }

    .container .card .face.face1 .content img{
        max-width: 100px;
    }

    .container .card .face.face1 .content h3{
        margin: 10px 0 0;
        padding: 0;
        color: #fff;
        text-align: center;
        font-size: 1.5em;
    }

    .container .card .face.face2{
        position: relative;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        box-sizing: border-box;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
        transform: translateY(-100px);
    }

    .container .card:hover .face.face2{
        transform: translateY(0);
    }

    .container .card .face.face2 .content p{
        margin: 0;
        padding: 0;
    }

    .container .card .face.face2 .content a{
        margin: 15px 0 0;
        display:  inline-block;
        text-decoration: none;
        font-weight: 900;
        color: #333;
        padding: 0px;
        border: 1px solid #333;
    }

    .container .card .face.face2 .content a:hover{
        background: #333;
        color: #000;
    }
  </style>
  `
    this.container.html(htm);
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