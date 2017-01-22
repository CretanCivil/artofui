import ReactHighcharts from 'react-highcharts';
import React from 'react';
import { PropTypes } from 'react';
import { fetchMetric } from './../actions/metric';
import { connect } from 'react-redux';
import { Table, Button, Row, Col, Select, Form, Icon, Card, Modal, Dropdown, Menu } from 'antd';
import { retryFetch } from './../utils/cFetch'
import { API_CONFIG } from './../config/api';
import cookie from 'js-cookie';
import { setChartSelection, setChartCrossLine } from './../actions/chart';
import ReactDOM from 'react-dom';

// React.Component
class ChartsTable extends React.Component {
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.chart.range != this.props.chart.range || this.props.metrics != nextProps.metrics) {
            this.doFetchData(nextProps.chart.range.startDate, nextProps.chart.range.endDate, nextProps.metrics);
        }
    }

    doFetchData(startDate, endDate, metrics) {
        if (!metrics)
            return;

        this.setState({
            network: {
                isFetching: true,
                data: [],
                error: null,
            }
        });
        let q = "";
        let interval = startDate / 1000 + 1;
        for (let metricInfo of metrics) {

            if (q)
                q += ';';
            q += metricInfo.aggregator + ":" + metricInfo.metric;
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

            if (metricInfo.by) {
                if (!metricInfo.tags) {
                    q += "{}";
                }
                q += "by{" + metricInfo.by + "}";
            }
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
            console.log("json", json);
        }).catch((error) => {
            this.setState({
                network: {
                    isFetching: false,
                    data: [],
                    error: error,
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
    componentDidMount() {
        this.doFetchData(this.props.chart.range.startDate, this.props.chart.range.endDate, this.props.metrics);
    }

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
        if (!this.props.metrics)
            return <div />;
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


        for (let key in data) {
            tableData.push({
                key: key,
                name: data[key].metric,
                age: data[key].pointlist[Object.keys(data[key].pointlist)],
                address: this.buildSerieName(data[key].tags),
            });
        }

        let style = Object.assign({},this.props.domProps.style, {
                overflow: 'auto',
        })
    

        return <div style={style}><Table  bordered={false} pagination={false} columns={columns} dataSource={tableData} size="small" /></div>
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

