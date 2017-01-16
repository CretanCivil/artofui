import ReactHighcharts from 'react-highcharts';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {retryFetch} from './../utils/cFetch';
import { API_CONFIG } from './../config/api';

// React.Component
class ChartsTopN extends React.Component {
    static propTypes = {
        fetchMetric: React.PropTypes.func,
        metric: React.PropTypes.any
    };

    constructor(props) {
        super(props);
        this.state = {
            network: {
                isFetching: false,
                data: [],
                error: null,
            },
        };
    }


    componentDidMount() {
        this.doFetchData(this.props.chart.range.startDate, this.props.chart.range.endDate);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.chart.range != this.props.chart.range) {
            this.doFetchData(nextProps.chart.range.startDate, nextProps.chart.range.endDate);
        }
    }



    doFetchData(startDate, endDate) {
        if (!this.props.metrics)
            return;

        this.setState({
            network: {
                isFetching: true,
                data: [],
                error: null,
            }
        });

        let metricInfo = this.props.metrics[0];

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
            this.setState({
                network: {
                    isFetching: false,
                    data: json.result,
                    error: null,
                }
            });
        }).catch((error) => {
            this.setState({
                network: {
                    isFetching: false,
                    data: [],
                    error: error,
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
        if (this.state.network.isFetching)
            this.refs.chart.getChart().showLoading();
        else if (this.state.network.data.length == 0) {
            //this.doFetchData(this.props.startDate, this.props.endDate);
            // this.refs.chart.getChart().showLoading();
        }
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

        let data = this.state.network.data;

        let series = [];
        let legend = {};
        let tooltip =  {
            backgroundColor: "rgba(247,247,247,0.85)",
            style: {                      // 文字内容相关样式
                color: "#333333",
                fontSize: "12px",
                fontWeight: "blod",
                fontFamily: "Courir new",
                fill: "#333333",
            },
            pointFormat: metric.metric + '<br/>{point.value:.1f}<br/>',
            shared: false
        };

        let xAxisVisible = true;

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

                tmp.push(pointlist[keyTime]);
                serieDatas.push(tmp);
                //[129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4]
            }
            serie.data = serieDatas;
            series.push(serie);
        }
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
                zoomType: 'x',
                panning: true,
                panKey: 'shift',



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
