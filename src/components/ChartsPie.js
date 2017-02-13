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
class ChartsPie extends ChartsBase {
    static propTypes = {
        fetchMetric: React.PropTypes.func,
        metric: React.PropTypes.any
    };

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.chart.range != this.props.chart.range || this.props.metrics != nextProps.metrics) {
            this.doFetchData(nextProps,true);
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

        let metricInfo = metrics[0];

        let chartType = this.props.type ? this.props.type : metricInfo.type;
        let interval = startDate / 1000 + 1;

        let q = metricInfo.aggregator + ":" + metricInfo.metric;
        //avg:system.load.1
        if (metricInfo.tags) {
            q += "{" + metricInfo.tags + "}";
        }

        if (metricInfo.by) {
            if (!metricInfo.tags) {
                q += "{}";
            }
            q += "by{" + metricInfo.by + "}";
        }

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
        let legend = {};
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
                return metric.metric + '<br/>{' + this.point.name + '}<br/>{' + this.y.toFixed(2) + "(" + (this.y / this.total * 100).toFixed(2) + '%)}<br/>';
            },

            shared: false
        };


        let xAxisVisible = true;

        let eventMouseMove = null;
        let eventSelection = null;

        let chartType = this.props.type ? this.props.type : metric.type;

        let serie = {};
        serie.data = [];
        serie.type = this.props.type ? this.props.type : metric.type;

        for (let key in data) {

            let pointlist = data[key].pointlist;
            let metricTags = data[key].tags;

            for (var keyTime in pointlist) {
                if (pointlist[keyTime] == null)
                    continue;
                let piePice = {};
                piePice.y = pointlist[keyTime];

                piePice.name = this.buildSerieName(metricTags);

                serie.data.push(piePice);
                //[129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4]
            }

        }

        series.push(serie);


        legend = {//控制图例显示位置
            layout: 'vertical',
            align: 'left',
            floating: true,
            x: 560,
            y: 15,
            verticalAlign: 'top',
            borderWidth: 0
        };


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
            title: {
                text: null
            },

            legend: legend,
            tooltip: tooltip,

            plotOptions: {
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

        });

        return <ReactHighcharts ref="chart" config={config} domProps={domProps} />;
    }
}

ChartsPie.childContextTypes = {
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
)(ChartsPie);
