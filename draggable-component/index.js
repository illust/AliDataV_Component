var Event = require('bcore/event');
var $ = require('jquery');
var _ = require('lodash');
var Tabulator = require('tabulator-tables');
// import {TabulatorFull as Tabulator} from 'tabulator-tables';


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

    console.log(data);
    //更新图表
    //this.chart.render(data, cfg);
    this.container.html(`
    <div class="container">
      <div class="header">业务人员自主分析平台</div>
      <div class="main">
        <div class="toolbox">
          <div class="tool box1">搜索框</div>
          <div class="tool box2">饼图</div>
          <div class="tool box3">柱状图</div>
        </div>
        <div id="example-table" class="example-table"></div>
      </div>

    </div>
    <style>
      .container{
        display: flex;
        flex-direction: column;
        margin: 0;
        overflow: hidden;
        background: #f4f3f4;
        width: 100%;
        height: 100%;
      }
      .header{
        width: 100%;
        height: 60px;
        color: green;
        font-size: 30px;
        font-weight: 100;
        text-align: center;
        background-color: white;
        position: positive;
        border-bottom: 1px solid #f4f3f4;
      }
      .main{
        width: 100%;
        height: 540px;
        position: positive;
        display: flex;
        flex-direction: row;
      }
      .toolbox{
        width: 25%;
        height: 100%;
        background-color: white;
        display:flex;
        flex-direction: column;
      }
      .tool{
        width: 100%;
        height: 20px;
        color: #FF4433;
        border: 1px solid #90A0AE;
        margin-bottom: 2px;
        font-size: 10px;
      }
      #tableDiv{
        width: 75%;
        height: 100%;
        overflow: auto;
      }
      table{
        width: 100%;
        height: 100%;
        font-size: 5px;
        color: black;
      }
      #example-table{
        width: 80vw;
        height: 50vh;
        color: #111;
      }
      .tabulator {
        position: relative;
        border: 1px solid #222;
        background-color: #fff;
        font-size: 14px;
        text-align: left;
        overflow: hidden;
        font-family: sans-serif;
        -webkit-transform: translateZ(0);
        -moz-transform: translateZ(0);
        -ms-transform: translateZ(0);
        -o-transform: translateZ(0);
        transform: translateZ(0);
      }
    </style>
    `);

    // this.convertTable(data),
    var tabledata = [
      {id:1, name:"Oli Bob", age:"12", col:"red", dob:""},
      {id:2, name:"Mary May", age:"1", col:"blue", dob:"14/05/1982"},
      {id:3, name:"Christine Lobowski", age:"42", col:"green", dob:"22/05/1982"},
      {id:4, name:"Brendon Philips", age:"125", col:"orange", dob:"01/08/1980"},
      {id:5, name:"Margret Marmajuke", age:"16", col:"yellow", dob:"31/01/1999"},
    ];
    
    //define some sample data
    
    //create Tabulator on DOM element with id "example-table"
    
    var table = new Tabulator("#example-table", {
      // height:205, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
      data:tabledata, //assign data to table
      layout:"fitDataStretch", //fit columns to width of table (optional)
      columns:[ //Define Table Columns
        {title:"Name", field:"name", width:150},
        {title:"Age", field:"age", hozAlign:"left", formatter:"progress"},
        {title:"Favourite Color", field:"col"},
        {title:"Date Of Birth", field:"dob", sorter:"date", hozAlign:"center"},
      ],
    });

    //trigger an alert message when the row is clicked
    table.on("rowClick", function(e, row){ 
      alert("Row " + row.getData().id + " Clicked!!!!");
    });



    //如果有需要的话,更新样式
    this.updateStyle();
  },

  convertTable: function  (data) {
    jsonData = data;
		var i;
		var jsonLength = !jsonData?0:jsonData.length;
		var temp;
		var tbl;
		var td;
		var body;
		var tableDiv = document.getElementById("tableDiv");
		
		if (tableDiv.childElementCount>0) {
			return;
		}
		
		tbl = document.createElement("table");
		tbl.border = "1px";
		tbl.borderColor = "red";
		for (i=0; i<1; i++) {
			tr = document.createElement("tr");
			for (temp in jsonData[i]) {
				td = document.createElement("td");
        td.setAttribute("width","8px");
        td.setAttribute("height","4px");
				td.appendChild(document.createTextNode(temp));
				tr.appendChild(td);
			}
			if (i == jsonLength-1) {
				tr.margin="0 0 5 0";
			}
			tbl.appendChild(tr);
		}
		for (i=0; i<jsonLength; i++) {
			tr = document.createElement("tr");
			for (temp in jsonData[i]) {
				td = document.createElement("td");
        td.setAttribute("width","8px");
        td.setAttribute("height","4px");
				td.appendChild(document.createTextNode(jsonData[i][temp]));
				tr.appendChild(td);
			}
			if (i==jsonLength-1) {
				tr.margin="0 0 5 0";
			}
			tbl.appendChild(tr);
		}
		tableDiv.appendChild(tbl);
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