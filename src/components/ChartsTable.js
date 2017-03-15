import ReactHighcharts from 'react-highcharts';
import React from 'react';
import { PropTypes } from 'react';
import { fetchMetric } from './../actions/metric';
import { connect } from 'react-redux';
import { Table, Button, Row, Col, Select, Form, Icon, Card, Modal, Dropdown, Menu, Spin } from 'antd';
import { retryFetch } from './../utils/cFetch'
import { API_CONFIG } from './../config/api';
import cookie from 'js-cookie';
import { setChartSelection } from './../actions/chart';
import ReactDOM from 'react-dom';
import moment from 'moment';
import ChartsBase from './ChartsBase';

// React.Component
class ChartsTable extends ChartsBase {
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


        let interval = startDate / 1000;// + 1;
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
                //q += "{*}";
                let qtags = [];
                if (metricInfo.query) {
                    let regex = /^(\w+):(?:(\w+-\w+(?:-(?:\w+))?):)?(?:(rate.*):)?([\w./-]+)(?:\{([^}]+)?\})?(?:(by))?(?:\{([^}]+)?\})?/;
                    let m = regex.exec(metricInfo.query);
                    if (m !== null && m.length > 5) {

                        qtags = m[5].split(",");
                        //console.log(qtags);
                    }
                }
                tags = qtags.map(function (item) {
                    //console.log("===", item);
                    if (props.params[item]) {
                        if (props.params[item].value) {
                            //console.log(props.params[item]);
                            return props.params[item].value.replace(":", "=");
                        } else {
                            return "";
                        }
                    }
                    return item.replace(":", "=")
                });
                if (tags) {
                    q += "{" + tags + "}";
                } else {
                    q += "{}";
                }
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


        const columns = [{
            title: '指标',
            dataIndex: 'name',
            width: 150,
        }, {
            title: '值',
            dataIndex: 'age',
            width: 150,
        }, {
            title: '标签',
            dataIndex: 'address',
            width: 150,
            sorter: (a, b) => a > b,
        }];


        const tableData = [];

        if (data.length > 0) {
            data = data[0].series;
            for (let key in data) {
                tableData.push({
                    key: key,
                    name: this.props.metrics[data[key].queryId].metric,//data[key].metric,
                    age: data[key].pointlist[Object.keys(data[key].pointlist)],
                    address: this.buildSerieName(data[key].tags),
                });
            }
        }

        let style = Object.assign({}, this.props.domProps.style, {
            overflow: 'auto',
        })


        return <div style={style}><Table bordered={false} pagination={false} columns={columns} dataSource={tableData} size="small" /></div>
    }
}


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
)(ChartsTable);

