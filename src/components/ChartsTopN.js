import ReactHighcharts from 'react-highcharts';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { retryFetch } from './../utils/cFetch';
import { API_CONFIG } from './../config/api';
import { Spin } from 'antd';
import moment from 'moment';
import ChartsBase from './ChartsBase';

// React.Component
class ChartsTopN extends ChartsBase {
    static propTypes = {
        fetchMetric: React.PropTypes.func,
        metric: React.PropTypes.any
    };

    constructor(props) {
        super(props);
        this.state = Object.assign(this.state, {
            metrics: null,
        });
    }


    componentDidMount() {
        this.setState({
            metrics: JSON.parse(JSON.stringify(this.props.metrics)),
        });
        super.componentDidMount();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.chart.range != this.props.chart.range || this.props.metrics != nextProps.metrics) {
            this.doFetchData(nextProps, true);
        }
        /*  if (nextProps.metrics[0].metric !== this.state.metrics[0].metric) {
              this.setState({
                  metrics: JSON.parse(JSON.stringify(this.props.metrics)),
              });
              this.doFetchData(nextProps.chart.range.startDate, nextProps.chart.range.endDate);
          }*/
    }


    doFetchDataInner(startDate, endDate, chart) {
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

        let interval = startDate / 1000;//+ 1;
        // let interval = startDate / 60000;
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
            if (metricInfo.by) {

                q += "by{" + metricInfo.by + "}";
            }

            metric.q = q;
        }





        retryFetch(API_CONFIG.metric, {
            method: "POST",
            retries: 3,
            retryDelay: 10000,
            /*params: {
                q: q,
                begin: startDate,
                end: endDate,
                interval: interval,

            }*/
            ContentType: "application/json",
            body: JSON.stringify({ queries: queries }),
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
        });


    }

    shouldComponentUpdate(nextProps, nextState) {
        let isFetching = this.state.network.isFetching;
        let data = this.state.network.data;

        let isFetching2 = nextState.network.isFetching;
        let data2 = nextState.network.data;

        return data2 != data || isFetching != isFetching2;
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
            pointFormat: metric.metric + '<br/>{point.value:.1f}<br/>',
            shared: false,
            enabled: false,
        };

        let xAxisVisible = true;


        let serie = {};
        serie.data = [];
        serie.type = this.props.type ? this.props.type : metric.type;

        serie.showInLegend = false;
        let serieNames = [];

        serie.dataLabels = {
            enabled: true,
            // rotation: -90,
            color: '#FFFFFF',
            align: 'left',
            verticalAlign: 'middle',
            formatter: function () {
                console.log(this);
                //serie.name = this.buildSerieName(data[key].tags);
                return '{' + serieNames[this.x] + '}';
            }, // one decimal
            inside: true,
            // y: 10, // 10 pixels down from the top
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        };


        let serieDatas = [];
        if (data.length > 0) {
            data = data[0].series;
            data.sort(function (a, b) {
                return Object.values(b.pointlist)[0] - Object.values(a.pointlist)[0]
            });
            for (let key in data) {
                let pointlist = data[key].pointlist;
                serieNames[key] = this.buildSerieName(data[key].tags);

                for (var keyTime in pointlist) {
                    if (pointlist[keyTime] == null)
                        continue;
                    let tmp = [];

                    tmp.push(pointlist[keyTime].toFixed(2) + " pkt");
                    tmp.push(pointlist[keyTime]);
                    serieDatas.push(tmp);
                    //[129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4]
                }
                serie.data = serieDatas;
                if (serie.data.length > 4)
                    break;
            }
        }

        series.push(serie);
        xAxisVisible = false;







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

            },
            title: {
                text: null
            },
            xAxis: {
                id: "xaxis",
                title: {
                    text: null
                },
                type: 'category',
                //categories: ['Jan', 'Feb'],
                lineColor: 'transparent',
                tickColor: '',
                tickWidth: 3
            },
            yAxis: {
                title: {
                    text: null
                },
                lineColor: 'red',
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
                    fillOpacity: 0.2,

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

            },

            series: series,
            credits: {
                enabled: false // 禁用版权信息
            },
        };




        return <ReactHighcharts ref="chart" config={config} domProps={this.props.domProps} />;
    }
}

ChartsTopN.childContextTypes = {
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




export default connect(
    mapStateToProps,
    null,
    null, { withRef: true }
)(ChartsTopN);
