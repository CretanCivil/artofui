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
import ReactDOM from 'react-dom';
import moment from 'moment';
import ChartsBase from './ChartsBase';

// React.Component
class ChartsColumn extends ChartsBase {
    static propTypes = {
        fetchMetric: React.PropTypes.func,
        metric: React.PropTypes.any
    };

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.chart.range != this.props.chart.range
            || this.props.metrics != nextProps.metrics
            || this.props.cardChart != nextProps.cardChart) {
            this.doFetchData(nextProps,true);
        }


        if (nextProps.chart.crossLine.pos != this.props.chart.crossLine.pos) {
            this.showCrossLine(nextProps);
        }

        if (nextProps.chart.selection != this.props.chart.selection) {
            this.chartSelection(nextProps);
        }

    }


    
    doFetchDataInner(startDate,endDate,chart) {
        let metrics = chart.metrics;

        this.setState({
            network: {
                isFetching: true,
                data: [],
                error: null,
            }
        });
        this.state.network.lastTime = endDate;

        //start=1484727960000&end=1484731560000&interval=120000


        let metricInfo = metrics[0];

        let chartType = this.props.type ? this.props.type : metricInfo.type;
        let interval = startDate / 30;


        retryFetch(API_CONFIG.buckets, {
            method: "GET",
            retries: 3,
            retryDelay: 10000,
            params: {
                start: endDate - startDate,
                end: endDate,
                interval: interval,
                q:chart.meta.events_query,
            }
        }).then(function (response) {
            return response.json();
        }).then((json) => {
            if(!this.mounted) {
                return;
            }
            this.setState({
                network: {
                    isFetching: false,
                    data: json.result,
                    error: null,
                    lastTime: endDate,
                }
            });
            console.log("json", json);
        }).catch((error) => {
            if(!this.mounted) {
                return;
            }
            this.setState({
                network: {
                    isFetching: false,
                    data: [],
                    error: error,
                    lastTime: endDate,
                }
            });
            console.log("error", error);
        });


        /*
                //metricInfo.aggregator + ":" +　metricInfo.metric + "{" + metricInfo.tags+"}by{"+metricInfo.by + "}",
                //"avg:system.mem.free{address=wuhan,host=102}by{host}"
        
                this.props.fetchMetric({
                    id: this.props.id,
                    q: q,
                    begin: startDate,
                    end: endDate,
                    interval: startDate / 60000
                });
        */
    }

    /*
    {"metric":"system.mem.free","aggregator":"avg","type":"line",
    "rate":false,"id":1482717404051,
    "tags":["address=wuhan","host=102"],"by":["host"]}
     */


    componentDidUpdate() {
        if (this.state.network.isFetching) {
            if (this.refs.chart)
                this.refs.chart.getChart().showLoading();
        }
        else if (this.state.network.data.length == 0) {
            //this.doFetchData(this.props.startDate, this.props.endDate);
            // this.refs.chart.getChart().showLoading();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        let isFetching = this.state.network.isFetching;
        let data = this.state.network.data;

        let isFetching2 = nextState.network.isFetching;
        let data2 = nextState.network.data;

        return data2 != data || isFetching != isFetching2;
    }

    showCrossLine(props) {
        if (!this.refs.chart || this.state.network.isFetching || this.state.network.data.length == 0)
            return;
        let ref = ReactDOM.findDOMNode(this.refs.chart);
        if(!ref)
            return;
        let box = ref.getBoundingClientRect();
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
                'z-index': 1,
                opacity: 1,
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
        let chart = this.refs.chart.getChart();
        let xaxis = chart.get("xaxis");



        this.props.setChartSelection({ min: e.resetSelection ? 0 : e.xAxis[0].min, max: e.resetSelection ? 0 : e.xAxis[0].max, resetSelection: e.resetSelection ? e.resetSelection : false, });
    }

    handleMouseMove(event) { /** 处理鼠标的移动事件，移动鼠标的同时移动挡板 */
        //console.log(event); 
        let x = event.pageX;//clientX;
        //this.refs.mychart
        let ref = ReactDOM.findDOMNode(this.refs.chart);
        let box = ref.getBoundingClientRect();
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


    buildSerieName(tags) {
        let name = "";
        for (let [key, value] of Object.entries(tags)) {
            if (key == "user")
                continue;
            if (name)
                name += ",";
            name += key + ":" + value;
        }
        if (!name)
            name = "*";
        return name;
    }

    render() {
        if (!this.props.metrics || this.state.network.isFetching) {

            let style = Object.assign({}, this.props.domProps.style, {
                position: 'relative',
            });

            return <div style={style}><div style={{
                position: 'absolute',
                top: '50%',
                left: '50%'
            }}><Spin /></div></div>;

        }
        let metric = this.props.metrics[0];

        let isFetching = this.state.network.isFetching;
        let data = this.state.network.data;

        let series = [];


        let xAxisVisible = true;

        let chartType = this.props.type ? this.props.type : metric.type;

        let info = {};
        info.showInLegend = false;
        info.data = [];

        let alert = {};
        alert.showInLegend = false;
        alert.data = [];

        let warning = {};
        warning.showInLegend = false;
        warning.data = [];

        let eventMouseMove = null;
        let eventSelection = null;
        eventMouseMove = this.handleMouseMove.bind(this);
        eventSelection = this.handleChartSelection.bind(this);


        let pointlist = data.buckets ? data.buckets : [];
        for (var event of pointlist) {

            info.data.push([event.time, event.events.info]);
            alert.data.push([event.time, event.events.alert]);
            warning.data.push([event.time, event.events.warning]);
            //[129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4]
        }


        series.push(alert);
        series.push(warning);
        series.push(info);

        let tooltip = {
            backgroundColor: "rgba(247,247,247,0.85)",
            style: {                      // 文字内容相关样式
                color: "#333333",
                fontSize: "12px",
                fontWeight: "blod",
                fontFamily: "Courir new",
                fill: "#333333",
            },
            formatter: function () {
                let tips = '<b>' + moment(this.x).format('YYYY-MM-DD HH:mm') + '</b><br/>';
                if (this.points[0].y > 0) {
                    tips += '<b><span color=' + this.points[0].color + '>alert:</span>' + this.points[0].y + '</b><br/>';
                }

                if(!this.points[1]) {
                    console.log(this);
                }

                if (this.points[1].y > 0) {
                    tips += '<b>warning:' + this.points[1].y + '</b><br/>';
                }

                if (this.points[2].y > 0) {
                   // console.log(this);
                    tips += '<b>info:' + this.points[2].y + '</b><br/>';
                }

                return tips;



            },

            shared: true
        };

        const config = {
            global: {
                useUTC: false,
            },
            colors: ['rgb(254,121,84)', '#f00', '#ccc',],
            loading: {  // 加载中选项配置
                labelStyle: {
                    fontSize: '12px'
                }
            },
            chart: {
                type: 'column',
                zoomType: 'x',
                panning: true,
                panKey: 'shift',

                //事件配置
                events: {
                    selection: eventSelection
                }
            },
            xAxis: {
                id: "xaxis",
                type: 'datetime',
                title: {
                    text: null
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
            },

            title: {
                text: null
            },
            plotOptions: {
                column: {
                    stacking: 'normal'
                },
            },
            tooltip: tooltip,
            legend: {},

            series: series,
            credits: {
                enabled: false // 禁用版权信息
            },
        };

        let domProps = Object.assign({}, this.props.domProps, {

            onMouseMove: eventMouseMove
        });

        return <ReactHighcharts ref="chart" config={config} domProps={domProps} />;
    }
}

ChartsColumn.childContextTypes = {
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
    const { chart } = state;
    return {
        chart
    };
}

// Which action creators does it want to receive by props?

function mapDispatchToProps(dispatch) {
    // bindActionCreators(ActionCreators, dispatch)
    return {
        setChartSelection: (params) => dispatch(setChartSelection(params)),
        setChartCrossLine: (params) => dispatch(setChartCrossLine(params))
    };
}


export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null, { withRef: true }
)(ChartsColumn);
