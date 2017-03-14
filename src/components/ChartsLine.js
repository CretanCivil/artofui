import ReactHighcharts from 'react-highcharts';
import React from 'react';
import { PropTypes } from 'react';
import { fetchMetric } from './../actions/metric';
import { connect } from 'react-redux';
import { Button, Row, Col, Select, Form, Icon, Card, Modal, Dropdown, Menu, Spin } from 'antd';
import { retryFetch } from './../utils/cFetch'
import { API_CONFIG } from './../config/api';
import cookie from 'js-cookie';
import { setChartSelection, setChartCrossLine } from './../actions/chart';
import { selectPoints } from './../actions/points';
import ReactDOM from 'react-dom';
import ChartsBase from './ChartsBase';
import moment from 'moment';
import { setChartRange } from './../actions/chart';

// React.Component
class ChartsLine extends ChartsBase {
    static propTypes = {
        fetchMetric: React.PropTypes.func,
        metric: React.PropTypes.any
    };

    constructor(props) {

        super(props);
        this.state = Object.assign(this.state, {
            config: {
                title: {
                    text: null
                },
                /* xAxis: {
                     id: "xaxis",
                     title: {
                         text: null
                     },
                     visible: false,
                 },
                 yAxis: {
                     id: "yaxis",
                     title: {
                         text: null
                     },
                     visible: false,
                 },
                 legend: {},
                 series: [{
                     showInLegend: false,
                     data: [0],
                 }],*/
                credits: {
                    enabled: false // 禁用版权信息
                },
            },
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.chart.range != this.props.chart.range
            || this.props.metrics != nextProps.metrics) {
            this.doFetchData(nextProps, true);
        }

        if (nextProps.params.scope != this.props.params.scope) {
            this.doFetchData(nextProps, true);
        }



        if (nextProps.chart.crossLine.pos != this.props.chart.crossLine.pos) {
            this.showCrossLine(nextProps);
        }

        if (nextProps.chart.selection != this.props.chart.selection) {
            this.chartSelection(nextProps);
        }
    }

    getInterval(startDate) {
        return parseInt(startDate / 60000);
    }

    componentDidUpdate() {
        if (this.state.network.isFetching) {
            if (this.refs.chart)
                this.refs.chart.getChart().showLoading();
        }
        else if (this.state.network.data.length == 0) {
            //this.doFetchData(this.props.startDate, this.props.endDate);
            // this.refs.chart.getChart().showLoading();
        }
        if (this.refs.chart) {
            let ref = ReactDOM.findDOMNode(this.refs.chart);
            let box = ref.getBoundingClientRect();
            this.setState({
                box: box,
            });
        }

    }

    shouldComponentUpdate(nextProps, nextState) {
        let isFetching = this.state.network.isFetching;
        let data = this.state.network.data;

        let isFetching2 = nextState.network.isFetching;
        let data2 = nextState.network.data;

        return data2 != data || isFetching != isFetching2;
    }



    reloadData() {
        this.doFetchData(this.props);
    }


    getChart() {
        return !this.refs.chart ? null : this.refs.chart.getChart();
    }



    showCrossLine(props) {
        // return;
        if (!this.refs.chart || this.state.network.isFetching || this.state.network.data.length == 0)
            return;
        // let ref = ReactDOM.findDOMNode(this.refs.chart);
        // let box = ref.getBoundingClientRect();
        let box = this.state.box;
        let x = props.chart.crossLine.pos * (box.width - 20);
        x += 10;
        x = x <= 10 ? 10 : x;
        x = x > box.width - 10 ? box.width - 10 : x;
        //console.log(refn+":"+box.width);
        let chart = this.refs.chart.getChart();
        //M 175.5 10 L 175.5 247
        let path = ['M', x, chart.plotTop,
            'L', x, chart.plotTop + chart.plotHeight];
        if (chart.crossLines) {
            chart.crossLines.attr({ d: path }).toFront();
        } else {
            chart.crossLines = chart.renderer.path(path).attr({
                'stroke-width': 1,
                stroke: 'green',
                zIndex: 1
            }).add().toFront();
        }
    }

    chartSelection(props) {

        let chart = this.refs.chart.getChart();
        let xaxis = chart.get("xaxis");
        console.log("show", props.chart.selection);
        if (props.chart.selection.resetSelection == true) {
            let extremes = xaxis.getExtremes();
            xaxis.setExtremes(extremes.dataMin, extremes.dataMx);
            return;
        }
        xaxis.setExtremes(props.chart.selection.min, props.chart.selection.max);
    }

    handleChartSelection(e) {
        /*
        这个定时器有点恶心，但是不这样不行。因为要延时执行，否则highchart里面的代码没有执行完成，就执行setChartRange会销毁chart对象，
        导致highchart报错。
         */
       
        if (e.resetSelection)
            return;

        let end = parseInt(e.xAxis[0].max / 1000) * 1000;
        let begin = parseInt(e.xAxis[0].min / 1000) * 1000;
        setTimeout(() => {
            this.props.setChartRange({
                startDate: end - begin,
                endDate: end,
                chosenFlag: true,
            });
        }, 1000);
        return;

        console.log(e);
        let chart = this.refs.chart.getChart();
        let xaxis = chart.get("xaxis");



        this.props.setChartSelection({ min: e.resetSelection ? 0 : e.xAxis[0].min, max: e.resetSelection ? 0 : e.xAxis[0].max, resetSelection: e.resetSelection ? e.resetSelection : false, });
    }

    handleMouseMove(event) { /** 处理鼠标的移动事件，移动鼠标的同时移动挡板 */

        let x = event.pageX;//clientX;
        //this.refs.mychart
        //let ref = ReactDOM.findDOMNode(this.refs.chart);

        // let box = ref.getBoundingClientRect();
        let box = this.state.box;
        const body = document.body;


        //  console.log(box);
        x = x - (box.left + body.scrollLeft - body.clientLeft);
        //x += 10;
        x = x <= 10 ? 10 : x;
        x = x > box.width - 10 ? box.width - 10 : x;
        let off = x - 10;//x轴刻度偏移
        let pos = off / (box.width - 20);//x轴比例

        this.props.setChartCrossLine({ pos: pos });



        //  console.log(chart.crossLines);
        //  console.log(chart.renderer);
        //  console.log(event.pageX + "," + event.clientX + "," + event.screenX + "," );


    }

    handleMouseDown(e) {
        //精髓 精髓 屏蔽事件穿透 否则拖拽拉伸时间轴不行
        e.stopPropagation();

    }

    buildSerieName(tags) {
        if (tags == null || tags.length == 0)
            return "*";
        let name = "";
        for (let [key, value] of Object.entries(tags)) {
            if (key == "user")
                continue;
            if (name)
                name += ",";
            else
                name += "{";
            name += key + ":" + value;
        }
        if (!name)
            name = "*";
        else
            name += "}";
        return name;
    }

    initConfig(network) {
        let isFetching = network.isFetching;
        let data = network.data;

        let series = [];
        let legend = {};


        let internal = this.props.chart.range.startDate / 60000 / 60

        let tooltip = {
            backgroundColor: "rgba(0,0,0,0.5)",
            style: {                      // 文字内容相关样式
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "blod",
                fontFamily: "Courir new"
            },
            // pointFormat: '{series.name}<br/><b>{series.aggregator}:{point.y:.2f}</b> <br/>',
            formatter: function () {
                //return "ddd";
                var s = this.series.name + '<br/>';
                let endTime = moment(parseInt(this.point.x));
                let beginTime = moment(parseInt(this.point.x)).subtract(internal, "minutes");
                //console.log(internal);
                let timeFomatter = "HH:mm";
                if (internal >= 12) {
                    timeFomatter = "MM/DD HH:mm";
                }
                s += beginTime.format(timeFomatter) + " ~ ";
                s += endTime.format(timeFomatter) + "<br/>";



                s += '<b>' + this.point.y.toFixed(2) + '</b><br/>';
                //console.log(this);

                return s;
            },
            shared: false
        };

        let xAxisVisible = true;

        let eventMouseMove = null;
        let eventSelection = null;


        eventMouseMove = this.handleMouseMove.bind(this);
        eventSelection = this.handleChartSelection.bind(this);


        data = data[0].series;
        for (let key in data) {
            let serie = {};
            serie.data = [];
            // console.log(this.props.metrics, key, this.props.metrics[key]);
            // console.log("dddddd",data[key],this.props.metrics[data[key].queryId]);
            serie.type = this.props.metrics[data[key].queryId].type;//let metric = this.props.metrics[0];
            serie.tags = this.buildSerieName(data[key].tags);
            serie.name = data[key].displayName;// + ' - ' + this.buildSerieName(data[key].tags);
            //serie.metric = data[key].displayName;
            serie.showInLegend = false;
            //serie.aggregator = data[key].aggregator;
            let serieDatas = [];
            let pointlist = data[key].pointlist;

            for (var keyTime in pointlist) {
                if (pointlist[keyTime] == null)
                    continue;
                let tmp = [];
                tmp.push(keyTime * 1000);
                tmp.push(pointlist[keyTime]);
                serieDatas.push(tmp);
                //[129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4]
            }
            serie.data = serieDatas;
            series.push(serie);
        }



        let cardChart = this.props.cardChart;
        let selectPoints = this.props.selectPoints;


        const config = {
            global: {
                useUTC: false,
            },
            colors: ['#008acd', '#2ec7c9', '#b6a2de', '#0cc2aa', '#6887ff', '#6cc788'],
            loading: {  // 加载中选项配置
                labelStyle: {
                    fontSize: '12px'
                }
            },
            chart: {
                zoomType: 'x',
                panning: true,
                panKey: 'shift',

                //事件配置
                events: {
                    selection: eventSelection
                },
                resetZoomButton: {
                    theme: {
                        display: 'none'
                    }
                }
            },
            title: {
                text: null
            },
            xAxis: {
                id: "xaxis",
                title: {
                    text: null
                },
                type: 'datetime',

                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%m/%d',
                    month: '%Y/%m',
                    year: '%Y'
                },
                labels: {
                    //type:'datetime',
                    // format: '{value:%H:%M}'
                    style: {
                        //'background-color': 'rgba(255, 255, 255, 0.8)',//没用
                        'padding': '0px 3px',
                        'font-size': '12px',
                        'color': '#333',

                    },
                },

                // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

            },
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    align: 'left',
                    x: -2,
                    y: 5,
                    style: {
                        //'background-color': 'rgba(255, 255, 255, 0.8)',//没用
                        'padding': '0px 3px',
                        'font-size': '12px',
                        'color': '#333',

                    },
                    //useHtml:true,
                    //zIndex: 1070,//没用
                },
                visible: xAxisVisible,
            },
            legend: legend,
            tooltip: tooltip,

            plotOptions: {
                line: { // base series options
                    allowPointSelect: false,
                    showCheckbox: false,
                    animation: true,
                    cursor: 'default',
                    enableMouseTracking: true,
                    stickyTracking: true,
                    fillOpacity: 0.2
                },
                area: {
                    fillOpacity: 0.2
                },
                series: {
                    marker: {
                        enabled: false,//是否显示节点
                    },
                    stickyTracking: true,

                    point: {
                        events: {
                            mouseOver: function () {
                                //   console.log(this);
                                let points = [];
                                for (let i = 0; i < this.series.chart.series.length; i++) {

                                    let serie = this.series.chart.series[i];
                                    let point = {};
                                    if (this.x < serie.points[0].x || serie.points[serie.points.length - 1].x < this.x)
                                        continue;
                                    //point.aggregator = serie.userOptions.aggregator;
                                    point.chartName = cardChart.name;
                                    point.active = this.series.index == i ? true : false;
                                    point.color = serie.color;
                                    point.name = serie.name;

                                    //point.name = serie.userOptions.tags;
                                    //point.metric = serie.userOptions.metric;

                                    let tmpPoint = null;
                                    for (let j in serie.points) {
                                        if (serie.points[j].x == this.x) {
                                            tmpPoint = serie.points[j];
                                            break;
                                        } else {
                                            // console.log(j);
                                        }
                                    }
                                    if (!tmpPoint)
                                        continue;

                                    point.x = tmpPoint.x;
                                    point.y = tmpPoint.y;
                                    point.value = tmpPoint.y;
                                    points.push(point);


                                }

                                //   console.log(points);
                                selectPoints(points);


                            }
                        }
                    },
                    events: {
                        mouseOut: function () {
                            if (this.chart.lbl) {
                                this.chart.lbl.hide();
                            }
                        }
                    }
                },
                scatter: {
                    tooltip: {
                        followPointer: true,
                    }
                },
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true,
                    innerSize: '50%'
                },
            },

            series: series,
            credits: {
                enabled: false // 禁用版权信息
            },
        };

        return config;
    }

    render() {

        

        let childContent = null;
        if (!this.props.metrics || this.state.network.isFetching || this.state.network.error) {

            let style = Object.assign({}, this.props.domProps.style, {
                position: 'relative',
            });

            childContent = <div style={style}><div style={{
                position: 'absolute',
                top: '50%',
                left: '50%'
            }}><Spin /></div></div>;

        } else {
            let config = this.state.config;

            let domProps = this.props.domProps;
            if (this.state.network.data.length > 0) {
                domProps = Object.assign({}, this.props.domProps, {
                    onMouseDown: this.handleMouseDown.bind(this),
                    onMouseMove: this.handleMouseMove.bind(this)
                });
            }

            childContent = <ReactHighcharts ref="chart" config={config} domProps={domProps} />;
        }

        return childContent;

    }
}

ChartsLine.childContextTypes = {
    domProps: PropTypes.any,
    chartSelection: PropTypes.func
};

/*
别删 别删 别删 
//
获取connect后的对象 refs.chart.getWrappedInstance()
*/
// Which part of the Redux global state does our component want to receive as props?
function mapStateToProps(state) {
    const { chart, params } = state;
    return {
        chart,
        params,
    };
}

// Which action creators does it want to receive by props?

function mapDispatchToProps(dispatch) {
    // bindActionCreators(ActionCreators, dispatch)
    return {
        setChartSelection: (params) => dispatch(setChartSelection(params)),
        setChartCrossLine: (params) => dispatch(setChartCrossLine(params)),
        selectPoints: (params) => dispatch(selectPoints(params)),
        setChartRange: (params) => dispatch(setChartRange(params)),
    };
}


export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null, { withRef: true }
)(ChartsLine);
