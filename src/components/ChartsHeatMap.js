import ReactHighcharts from 'react-highcharts';
import React from 'react';
import { PropTypes } from 'react';
import { fetchMetric } from './../actions/metric';
import { connect } from 'react-redux';
import {  Button, Row, Col, Select, Form, Icon, Card, Modal, Dropdown, Menu } from 'antd';
import {retryFetch} from './../utils/cFetch'
import { API_CONFIG } from './../config/api';
import cookie from 'js-cookie';
import {setChartSelection, setChartCrossLine } from './../actions/chart';
import ReactDOM from 'react-dom';
var moment = require('moment');

import highchartsHeatmap from 'highcharts-heatmap';
highchartsHeatmap(ReactHighcharts.Highcharts);

// React.Component
class ChartsHeatMap extends React.Component {
    static propTypes = {
        fetchMetric: React.PropTypes.func,
        metric: React.PropTypes.any
    };

    constructor(props) {
        super(props);
        this.state = {
            network: {
                isFetching: true,
                data: [],
                error: null,
            },
        };
    }


    doFetchData(startDate, endDate) {
        if (!this.props.metrics)
            return;

        this.setState({
            network: {
                isFetching: false,
                data: [],
                error: null,
            }
        });


        let metricInfo = this.props.metrics[0];
        let interval = 3600;
        if (this.props.chart.range.startDate <= 3600000 * 24) {
            interval = 60;
        }


        let q = metricInfo.aggregator + ":" + metricInfo.metric;
        //avg:system.load.1
        if (metricInfo.tags) {
            q += "{" + metricInfo.tags + "}";
        }

        /*if (metricInfo.by) {
            if (!metricInfo.tags) {
                q += "{}";
            }
            q += "by{" + metricInfo.by + "}";
        }*/

        retryFetch(API_CONFIG.metric, {
            method: "GET",
            retries: 3,
            retryDelay: 10000,
            params: {
                q: q,
                begin: startDate,
                end: endDate,
                interval: interval,

            }
        }).then(function (response) {
            return response.json();
        }).then((json) => {
            this.setState({
                network: {
                    isFetching: false,
                    data: json.result,
                    error: null,
                }
            });
            console.log("json", json);
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
    componentDidMount() {
        this.doFetchData(this.props.chart.range.startDate, this.props.chart.range.endDate);
    }

    componentDidUpdate() {
        if (this.state.network.isFetching)
            this.refs.chart.getChart().showLoading();
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


    getChart() {
        return this.refs.chart.getChart();
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
        if (!this.props.metrics)
            return <div/>;
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

        let xMin = null;
        let xMax = null;



        let chartType = this.props.type ? this.props.type : metric.type;

        for (let key in data) {
            let serie = {

            };
            serie.data = [];
            serie.type = this.props.type ? this.props.type : metric.type;
            serie.name = "name";
            serie.showInLegend = false;


            let pointlist = data[key].pointlist;

            for (var keyTime in pointlist) {
                if (pointlist[keyTime] == null)
                    continue;
                let tmp = [];


                //this.props.chart.range.startDate, this.props.chart.range.endDate
                if (this.props.chart.range.startDate <= 3600000 * 24) {
                    //y 轴 0~60 分钟
                    //x 轴 就是1~24小时
                    let endTime = moment(parseInt(this.props.chart.range.endDate));
                    //  console.log(endTime.format("YYYY-MM-DD"));

                    let time = moment(keyTime * 1000);
                    let hour = endTime.diff(time, 'hours');
                    time = time.add(hour, "hours");
                    tmp.push(hour + 1);
                    tmp.push(endTime.diff(time, 'minutes'));
                    //console.log(time.format("YYYY-MM-DD"));
                    // tmp.push('2013-12-11');
                    xMin = 1;
                    xMax = parseInt(this.props.chart.range.startDate) / 3600000;


                    tmp.push(pointlist[keyTime]);
                } else {
                    //y 轴 0~24 小时
                    //x 轴 就是1~30天
                    let endTime = moment(parseInt(this.props.chart.range.endDate));
                    //  console.log(endTime.format("YYYY-MM-DD"));

                    let time = moment(keyTime * 1000);
                    let hour = endTime.diff(time, 'days');
                    time = time.add(hour, "days");
                    tmp.push(hour + 1);
                    tmp.push(endTime.diff(time, 'hours'));
                    //console.log(time.format("YYYY-MM-DD"));
                    // tmp.push('2013-12-11');
                    xMin = 1;
                    xMax = parseInt(this.props.chart.range.startDate) / 3600000 / 24;


                    tmp.push(pointlist[keyTime]);
                }



                serie.data.push(tmp);


                //[129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4]
            }

            series.push(serie);
            break;
        }

        const config = {
            global: {
                useUTC: false,
            },
            //   colors: ['#008acd', '#2ec7c9', '#b6a2de', '#0cc2aa', '#6887ff', '#6cc788'],
            loading: {  // 加载中选项配置
                labelStyle: {
                    fontSize: '12px'
                }
            },
            tooltip: {
                headerFormat: 'Temperature<br/>',
                pointFormat: '{point.x:%e %b, %Y} {point.y}:00: <b>{point.value} ℃</b>'
            },
            chart: {

            },
            title: {
                text: null
            },

            plotOptions: {
                heatmap: {
                    marker: {
                        lineWidth: 4,
                        //   lineColor: '#f00',
                        //   fillColor: '#0f0',
                        states: {
                            hover: {
                                halo: !1, brightness: .2,
                                lineColor: "#f00",
                            }
                        },
                    },
                },

            },
            xAxis: {
                min: xMin,
                max: xMax,
            },

            series: series,
            credits: {
                enabled: false // 禁用版权信息
            },
        };

        console.log(series);

        let domProps = Object.assign({}, this.props.domProps, {
        });

        return <ReactHighcharts ref="chart" config= { config } domProps={ domProps } />;
    }
}

ChartsHeatMap.childContextTypes = {
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
)(ChartsHeatMap);
