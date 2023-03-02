var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');
var Echarts = require('echarts')
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
    let xAxisData = []
    let seriesData1 = []  // 预警
    let seriesData2 = []  // 关注
    let seriesData3 = []  // 一般
    for(i = 0; i < data.length; i++){
        xAxisData.push(data[i].industry)
        seriesData1.push(parseInt(data[i].num))
        i = i + 1;
        seriesData2.push(parseInt(data[i].num))
        i = i + 1;
        seriesData3.push(parseInt(data[i].num))
    }
    seriesData1 = seriesData1.map( (e) => {
      return e == 0 ? null : e;
    })
    seriesData2 = seriesData2.map( (e) => {
      return e == 0 ? null : e;
    })
    seriesData3 = seriesData3.map( (e) => {
      return e == 0 ? null : e;
    })

    console.log("预警",seriesData1);
    console.log("关注",seriesData2);
    console.log("一般",seriesData3);
    var cfg = this.mergeConfig(config);
    console.log("cfg.options.series",cfg.options.series);
    //更新图表
    //this.chart.render(data, cfg);
    
    const option = {
      legend: {
        show:cfg.options.chart.numericalLabel.show,
        x:cfg.options.chart.numericalLabel.pos.horizontal,
        y:cfg.options.chart.numericalLabel.pos.vertical,
        orient:cfg.options.chart.numericalLabel.direction,
        textStyle:{
          color:cfg.options.chart.numericalLabel.textStyle.color,
          fontSize:cfg.options.chart.numericalLabel.textStyle.fontSize,
          fontWeight:cfg.options.chart.numericalLabel.textStyle.fontWeight,
          fontFamily:cfg.options.chart.numericalLabel.textStyle.fontFamily
        },
        data: [{name:'预警类',icon:'rect'},{name:'关注类',icon:'rect'},{name:'一般类',icon:'rect'}]
      },
      xAxis: {
        show: cfg.options.axis.xaxis.isShow,
        type: 'category',
        data: xAxisData,
        axisLabel: {
          show: true,
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: 20,
          interval: 0
        },
        axisTick: {
          show: false
        },
        axisLine:{
          show: cfg.options.axis.xaxis.axisLine.show,
          lineStyle:{
            type: "solid",
            color: cfg.options.axis.xaxis.axisLine.color,
            width: cfg.options.axis.xaxis.axisLine.width
          }
        },
        axisLabel: {
          show: cfg.options.axis.xaxis.label.show, 
          fontFamily: cfg.options.axis.xaxis.label.textarea.fontFamily,
          fontSize: cfg.options.axis.xaxis.label.textarea.fontSize,
          fontWeight: cfg.options.axis.xaxis.label.textarea.fontWeight,
          color: cfg.options.axis.xaxis.label.textarea.color,
          interval: 0,
          margin: cfg.options.axis.xaxis.label.textMargin,
          formatter: function(params) {
            var newParamsName = ""; // 最终拼接成的字符串
            var paramsNameNumber = params.length; // 实际标签的个数
            var provideNumber = cfg.options.axis.xaxis.label.textNum; // 每行能显示的字的个数
            var rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
            /**
             * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
             */
            // 条件等同于rowNumber>1
            if (paramsNameNumber > provideNumber) {
                /** 循环每一行,p表示行 */
                for (var p = 0; p < rowNumber; p++) {
                    var tempStr = ""; // 表示每一次截取的字符串
                    var start = p * provideNumber; // 开始截取的位置
                    var end = start + provideNumber; // 结束截取的位置
                    // 此处特殊处理最后一行的索引值
                    if (p == rowNumber - 1) {
                        // 最后一次不换行
                        tempStr = params.substring(start, paramsNameNumber);
                    } else {
                        // 每一次拼接字符串并换行
                        tempStr = params.substring(start, end) + "\n";
                    }
                    newParamsName += tempStr; // 最终拼成的字符串
                  }
                } else {
                  // 将旧标签的值赋给新标签
                  newParamsName = params;
                }
                //将最终的字符串返回
              return newParamsName;
          }
        },
      },
      grid:{
        top: cfg.options.chart.margin.top + '%',
        bottom: cfg.options.chart.margin.bottom + '%',
        left: cfg.options.chart.margin.left + '%',
        right: cfg.options.chart.margin.right + '%',
        containLabel: true
      },


      yAxis: [
        {
        // max: 'dataMax',
        type: 'value',
        name: cfg.options.axis.yaxis.yname.name,
        nameLocation: cfg.options.axis.yaxis.yname.nameLocation,
        nameTextStyle: {
          color: cfg.options.axis.yaxis.yname.textStyle.color,
          fontWeight: cfg.options.axis.yaxis.yname.textStyle.fontWeight,
          fontSize: cfg.options.axis.yaxis.yname.textStyle.fontSize,
          fontFamily: cfg.options.axis.yaxis.yname.textStyle.fontFamily,
          padding: [cfg.options.axis.yaxis.yname.padding.top,cfg.options.axis.yaxis.yname.padding.right,cfg.options.axis.yaxis.yname.padding.bottom,cfg.options.axis.yaxis.yname.padding.left]
        },
        nameGap: cfg.options.axis.yaxis.yname.nameGap,
        splitLine: { show: false },
        show: cfg.options.axis.yaxis.isShow,
        axisLine:{
          show: cfg.options.axis.yaxis.axisLine.show,
          lineStyle:{
            type: "solid",
            color: cfg.options.axis.yaxis.axisLine.color,
            width: cfg.options.axis.yaxis.axisLine.width
          }
        },
        axisLabel: {
          show: cfg.options.axis.yaxis.label.show, 
          fontFamily: cfg.options.axis.yaxis.label.textarea.fontFamily,
          fontSize: cfg.options.axis.yaxis.label.textarea.fontSize,
          fontWeight: cfg.options.axis.yaxis.label.textarea.fontWeight,
          color: cfg.options.axis.yaxis.label.textarea.color,
          interval: 0
        },
        splitNumber: cfg.options.axis.yaxis.label.display.amount
      },
      // max: 'dataMax',
      {
        type: 'value',
        name: cfg.options.axis.yaxis.yname.name,
        nameLocation: cfg.options.axis.yaxis.yname.nameLocation,
        nameTextStyle: {
          color: cfg.options.axis.yaxis.yname.textStyle.color,
          fontWeight: cfg.options.axis.yaxis.yname.textStyle.fontWeight,
          fontSize: cfg.options.axis.yaxis.yname.textStyle.fontSize,
          fontFamily: cfg.options.axis.yaxis.yname.textStyle.fontFamily,
          padding: [cfg.options.axis.yaxis.yname.padding.top,cfg.options.axis.yaxis.yname.padding.right,cfg.options.axis.yaxis.yname.padding.bottom,cfg.options.axis.yaxis.yname.padding.left]
        },
        nameGap: cfg.options.axis.yaxis.yname.nameGap,
        splitLine: { show: false },
        show: cfg.options.axis.yaxis.isShow,
        axisLine:{
          show: cfg.options.axis.yaxis.axisLine.show,
          lineStyle:{
            type: "solid",
            color: cfg.options.axis.yaxis.axisLine.color,
            width: cfg.options.axis.yaxis.axisLine.width
          }
        },
        axisLabel: {
          show: cfg.options.axis.yaxis.label.show, 
          fontFamily: cfg.options.axis.yaxis.label.textarea.fontFamily,
          fontSize: cfg.options.axis.yaxis.label.textarea.fontSize,
          fontWeight: cfg.options.axis.yaxis.label.textarea.fontWeight,
          color: cfg.options.axis.yaxis.label.textarea.color,
          interval: 0
        },
        splitNumber: cfg.options.axis.yaxis.label.display.amount
      }
    ],

      
      series: [
          {
              data: seriesData3,
              type: 'bar',
              name: '一般类',
              stack: "risk",
              barMinHeight: cfg.options.series[0].barMinHeight,
              barWidth: cfg.options.series[0].barPercent,
              barCategoryGap: '56%',
              label:{
                normal:{
                  show: cfg.options.series[0].barText.show,
                  position: cfg.options.series[0].barText.position,
                  color: cfg.options.series[0].barText.textStyle.color,
                  fontFamily: cfg.options.series[0].barText.textStyle.fontFamily,
                  fontSize: cfg.options.series[0].barText.textStyle.fontSize,
                  fontWeight: cfg.options.series[0].barText.textStyle.fontWeight,
                  formatter: cfg.options.series[0].barText.thousandth? function(p){
                    if (!p.value && p.value !== 0) return 0;
    
                    let str = p.value.toString();
                    let reg =
                      str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
                    return str.replace(reg, "$1,");
                  } : '{c}'
                }
              },
              itemStyle: {
                
                  color: cfg.options.series[0].barColor
              }
          },
          {
              data: seriesData2,
              type: 'bar',
              name: '关注类',
              stack: "risk",
              barMinHeight: cfg.options.series[1].barMinHeight,
              barWidth: cfg.options.series[1].barPercent,
              barCategoryGap: '56%',
              label:{
                normal:{
                  show: cfg.options.series[1].barText.show,
                  position: cfg.options.series[1].barText.position,
                  color: cfg.options.series[1].barText.textStyle.color,
                  fontFamily: cfg.options.series[1].barText.textStyle.fontFamily,
                  fontSize: cfg.options.series[1].barText.textStyle.fontSize,
                  fontWeight: cfg.options.series[1].barText.textStyle.fontWeight,
                  formatter: cfg.options.series[1].barText.thousandth? function(p){
                    if (!p.value && p.value !== 0) return 0;
    
                    let str = p.value.toString();
                    let reg =
                      str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
                    return str.replace(reg, "$1,");
                  } : '{c}'
                }
              },
              itemStyle: {
                  color: cfg.options.series[1].barColor
              }
          },                        
          {
              data: seriesData1,
              type: 'bar',
              name: '预警类',
              stack: "risk",
              barMinHeight: cfg.options.series[2].barMinHeight,
              barWidth: cfg.options.series[2].barPercent,
              barCategoryGap: '56%',
              label:{
                normal:{
                  show: cfg.options.series[2].barText.show,
                  position: cfg.options.series[2].barText.position,
                  color: cfg.options.series[2].barText.textStyle.color,
                  fontFamily: cfg.options.series[2].barText.textStyle.fontFamily,
                  fontSize: cfg.options.series[2].barText.textStyle.fontSize,
                  fontWeight: cfg.options.series[2].barText.textStyle.fontWeight,
                  formatter: cfg.options.series[2].barText.thousandth? function(p){
                    if (!p.value && p.value !== 0) return 0;
    
                    let str = p.value.toString();
                    let reg =
                      str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
                    return str.replace(reg, "$1,");
                  } : '{c}'
                }
              },
              itemStyle: {
                  color: cfg.options.series[2].barColor
              }
          }
      ]
  }

    this.chart.setOption(option)
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