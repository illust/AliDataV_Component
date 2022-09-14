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


this.container.html(`<div>
<div class="outerouter"></div>
<div class="outer"></div>
<div class="insider"></div>
<div class="icon"></div>
</div>
<style>
.icon {
background: transparent;
  background-color: rgba(11, 181, 197, 0.4);
  width: 76px;
  height: 76px;
  top: -475px;
  border-radius: 100%;
  margin: 0 auto;
  position: relative;
}

.icon:hover {
  -moz-animation: rotatecircle 4s infinite linear;
  -webkit-animation: rotatecircle 4s linear;
  background-color: antiquewhite;
}

.outerouter{
  background-color: transparent;
  border: ${cfg.options.outerRing.thickness}px solid ${cfg.options.outerRing.color};
  opacity: .9;
  border-top: ${cfg.options.outerRing.thickness}px solid transparent;
  border-bottom: ${cfg.options.outerRing.thickness}px solid transparent;
/* border-right: 5px solid transparent; */
  border-radius: 210px;
top: 0px; 
  width: 400px;
  height: 400px;
  margin: 0 auto;
position: relative;
  -moz-animation: spinoffPulse ${cfg.options.outerRing.speed}s infinite linear;
  -webkit-animation: spinoffPulse ${cfg.options.outerRing.speed}s infinite linear ;
}

.outer {
  background-color: transparent;
  border: ${cfg.options.middleRing.thickness}px solid ${cfg.options.middleRing.color};
  opacity: .9;
  border-right: ${cfg.options.middleRing.thickness}px solid transparent;
  border-left: ${cfg.options.middleRing.thickness}px solid transparent;
  border-radius: 180px;
  width: 315px;
  height: 315px;
  margin: 0 auto;
  -moz-animation: spinoffPulse ${cfg.options.middleRing.speed}s infinite linear;
  -webkit-animation: spinPulse ${cfg.options.middleRing.speed}s infinite linear ;
  top: 50px;
  left: 43px;
  position: fixed;
}

.insider {
  background-color: transparent;
  border: ${cfg.options.insiderRing.thickness}px solid ${cfg.options.insiderRing.color};
  opacity: .9;
  border-left: ${cfg.options.insiderRing.thickness}px solid transparent;
  border-right: ${cfg.options.insiderRing.thickness}px solid transparent;
  border-radius: 125px;
  top: -314px;
  width: 243px;
  height: 243px;
  margin: 0 auto;
  position: relative;
  -moz-animation: spinoffPulse ${cfg.options.insiderRing.speed}s infinite linear;
  -webkit-animation: spinoffPulse ${cfg.options.insiderRing.speed}s infinite linear;
}



@-moz-keyframes spinPulse {
  0% {
      -moz-transform: rotate(160deg);
      opacity: 0;
      box-shadow: 0 0 1px #bdd73c;
  }
  50% {
      -moz-transform: rotate(145deg);
      opacity: 1;
  }
  100% {
      -moz-transform: rotate(-320deg);
      opacity: 0;
  }
}

@-moz-keyframes spinoffPulse {
  0% {
      -moz-transform: rotate(0deg);
  }
  100% {
      -moz-transform: rotate(360deg);
  }
}

@-webkit-keyframes spinPulse {
  0% {
      -webkit-transform: rotate(160deg);
      opacity: 0;
      box-shadow: 0 0 1px #bdd73c;
  }
  50% {
      -webkit-transform: rotate(145deg);
      opacity: 1;
  }
  100% {
      -webkit-transform: rotate(-320deg);
      opacity: 0;
  }
}

@-webkit-keyframes spinoffPulse {
  0% {
      -webkit-transform: rotate(0deg);
  }
  100% {
      -webkit-transform: rotate(360deg);
  }
}

@-moz-keyframes rotatecircle {
  0% {
      -moz-transform: rotate(0deg);
  }
  100% {
      -moz-transform: rotate(-360deg);
  }
}

@-webkit-keyframes rotatecircle {
  0% {
      -webkit-transform: rotate(0deg);
  }
  100% {
      -webkit-transform: rotate(-360deg);
  }
}</style>`)


  // $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', `${cfg.cssPath}`) );





  
    console.log(this.container.html);

    // $(document).ready(function() {
    //   rotateCircles();
    // });
    
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