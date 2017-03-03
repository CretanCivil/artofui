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
class ChartsArea extends ChartsBase {
    static propTypes = {
        fetchMetric: React.PropTypes.func,
        metric: React.PropTypes.any
    };

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.chart.range != this.props.chart.range || this.props.metrics != nextProps.metrics) {
            this.doFetchData(nextProps, true);
        }

        if (nextProps.chart.crossLine.pos != this.props.chart.crossLine.pos) {
            this.showCrossLine(nextProps);
        }

        if (nextProps.chart.selection != this.props.chart.selection) {
            this.chartSelection(nextProps);
        }
    }

    doFetchDataInner(startDate, endDate, chart) {
        let metrics = chart.metrics;

        this.state.network.lastTime = endDate;
        this.setState({
            network: {
                isFetching: true,
                data: [],
                error: null,
            }
        });

        let metricInfo = metrics[0];


        let interval = startDate / 60000;

        let queries = [];
        for (let metricInfo of metrics) {

            let metric = { begin: (endDate - startDate) / 1000, end: endDate / 1000, interval: interval, attributes: { index: metrics.indexOf(metricInfo) } };
            let q = "";

            queries.push(metric);

            q += metricInfo.aggregator;

            if (metricInfo.rate) {
                q += ":rate";
            }

            q += ":" + metricInfo.metric;
            //avg:system.load.1
            let tags = null;

            if (metricInfo.tags) {
                tags = metricInfo.tags.map(function (item) {
                    return item.replace(":", "=")
                });
            }
            if (tags) {
                q += "{" + tags + "}";
            }
            if (!metricInfo.tags) {
                q += "{*}";
            }
            /* if (metricInfo.by) {
 
                 q += "by{" + metricInfo.by + "}";
             }
             */

            metric.q = q;
        }


        retryFetch(API_CONFIG.metric, {
            method: "POST",
            retries: 3,
            retryDelay: 10000,
            params: {
                /*q: q,
                begin: startDate,
                end: endDate,
                interval: interval,*/
                api_key: API_CONFIG.apiKey,
            },
            //ContentType: "application/json",
            //body: JSON.stringify({ queries: queries }),
            body: encodeURIComponent(JSON.stringify({ queries: queries }))
        }).then(function (response) {
            return response.json();
        }).then((json) => {
            if (!this.mounted) {
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
            if (!this.mounted) {
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

    showCrossLine(props) {
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
            chart.crossLines.attr({ d: path });
        } else {
            chart.crossLines = chart.renderer.path(path).attr({
                'stroke-width': 2,
                stroke: 'green',
                zIndex: 1
            }).add();
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
        // let ref = ReactDOM.findDOMNode(this.refs.chart);
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
        let legend = {};
        let tooltip = {
            backgroundColor: "rgba(0,0,0,0.5)",
            style: {                      // 文字内容相关样式
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "blod",
                fontFamily: "Courir new"
            },
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:.1f}</b> ({point.minute:,.0f} millions)<br/>',
            shared: true
        };

        let xAxisVisible = true;

        let eventMouseMove = null;
        let eventSelection = null;

        let chartType = this.props.type ? this.props.type : metric.type;

        eventMouseMove = this.handleMouseMove.bind(this);
        eventSelection = this.handleChartSelection.bind(this);
        if (data.length > 0) {
            data = data[0].series;
            for (let key in data) {
                let serie = {};
                serie.data = [];
                serie.type = this.props.type ? this.props.type : metric.type;
                serie.name = "name";
                serie.showInLegend = false;
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
        }

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
                visible: false,
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
                visible: false,
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

        let domProps = Object.assign({}, this.props.domProps, {

            onMouseMove: eventMouseMove
        });

        return <ReactHighcharts ref="chart" config={config} domProps={domProps} />;
    }
}

ChartsArea.childContextTypes = {
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
)(ChartsArea);
