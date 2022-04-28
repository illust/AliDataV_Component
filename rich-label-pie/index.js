var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');
//var Chart = require('XXX');
var Echarts = require('echarts');

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
  // this.resize()
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
    this.chart = Echarts.init(this.container[0]);
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
    // this.container.html(data[0].value)
    //如果有需要的话,更新样式
    console.log("cfg.options.series.seriesTab",cfg.options.series.seriesTab);
    // console.log("cfg.options.series.seriesTab.color.value",cfg.options.series.seriesTab.color.value);
    console.log("cfg.options.series.seriesTab.map(e=>e.color.value)",cfg.options.series.seriesTab.map(e=>e.color.value));
    
    // var seriesColor = cfg.options.series.seriesTab.map()

    

    option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      title: {
        text:cfg.options.chart.title.content,
        show:cfg.options.chart.title.show,
        left: 'center',
        textStyle:{
          color:cfg.options.chart.title.textStyle.color,
          fontSize:cfg.options.chart.title.textStyle.fontSize,
          fontWeight:cfg.options.chart.title.textStyle.fontWeight,
          fontFamily:cfg.options.chart.title.textStyle.fontFamily
        }
      },
      color: cfg.options.series.seriesTab.map(e=>e.color.value),
      grid:{
        top: '35%'  
      },
      legend: {
        // top:'10%',
        // bottom:'20%',
        // left:'center',
        show:cfg.options.chart.numericalLabel.show,
        x:cfg.options.chart.numericalLabel.pos.horizontal,
        y:cfg.options.chart.numericalLabel.pos.vertical,
        orient:cfg.options.chart.numericalLabel.direction,
        align:'left',
        textStyle:{
          color:cfg.options.chart.numericalLabel.textStyle.color,
          fontFamily:cfg.options.chart.numericalLabel.textStyle.fontFamily,
          fontSize:cfg.options.chart.numericalLabel.textStyle.fontSize,
          fontWeight:cfg.options.chart.numericalLabel.textStyle.fontWeight
        },
        data: data.map(e=>e.name)
      },
      series: [
        // {
        //   name: 'Access From',
        //   type: 'pie',
        //   selectedMode: 'single',
        //   radius: [0, '30%'],
        //   label: {
        //     position: 'inner',
        //     fontSize: 14
        //   },
        //   labelLine: {
        //     show: false
        //   },
        //   data: [
        //     { value: 1548, name: 'Search Engine' },
        //     { value: 775, name: 'Direct' },
        //     { value: 679, name: 'Marketing', selected: true }
        //   ]
        // },
        {
          name: 'Access From',
          type: 'pie',
          radius: [cfg.options.chart.radius.inRadius, '65%'],
          labelLine: {
            length: cfg.options.chart.label.turnLength,
            length2: cfg.options.chart.label.turnLength2,
            minTurnAngle: cfg.options.chart.label.minTurnAngle,
            maxSurfaceAngle: cfg.options.chart.label.maxSurfaceAngle,
          },
          // labelLine:cfg.options.chart.label.show,
          label: {
            show:cfg.options.chart.label.show,
            // formatter: '{hr|}{b|{b}：}{c|{c}}  {per|({d}%)}  ',
            formatter: function(params){
              str = '{hr|}{b|' + params.name + '：}{c|'+ params.data.value +'}  {per|' +'(' + params.percent.toFixed(cfg.options.chart.label.percentPoint) + '%)}  '
              return str
            },
            backgroundColor: cfg.options.chart.label.bgColor,
            borderColor: cfg.options.chart.label.bgBorderColor,
            borderWidth: cfg.options.chart.label.bgBorderWidth,
            borderRadius: cfg.options.chart.label.bgBorderRadius,
            width: cfg.options.chart.label.width,
            height: cfg.options.chart.label.height,
            // overflow: 'break',
            alignTo: 'labelLine',
            rich: {
              hr:{
                lineHeight: 33
              },
              b: cfg.options.chart.label.numName,
              c: {
                fontSize: cfg.options.chart.label.number.fontSize,
                color: cfg.options.chart.label.number.color,
                fontWeight: cfg.options.chart.label.number.fontWeight,
                fontFamily: cfg.options.chart.label.number.fontFamily
              },
              per: {
                color: cfg.options.chart.label.percentTextColor,
                backgroundColor: cfg.options.chart.label.percentBgColor,
                fontSize: cfg.options.chart.label.number.fontSize,
                padding: [3, 4],
                borderRadius: 4
              }
            }
          },
          data: data
        }
      ]
    };

    this.chart.setOption(option);

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
    this.chart.resize({
     width: width,
     height: height
    })
  },
  /**
   * 每个组件根据自身需要,从主题中获取颜色 覆盖到自身配置的颜色中.
   * 暂时可以不填内容
   */
  setColors: function () {
    //比如
    // var cfg = this.config;
    // cfg.color = cfg.theme.series[0] || cfg.color;
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