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

// React.Component
export default class ChartsBase extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            network: {
                isFetching: false,
                data: [],
                error: null,
                lastTime: 0,
            },
        };
    }



    componentWillUnmount() {
        this.mounted = false;
    }

    componentDidMount() {
        this.mounted = true;
        this.doFetchData(this.props);
    }

    getChart() {
        return !this.refs.chart ? null : this.refs.chart.getChart();
    }

    reloadData(must) {
        this.doFetchData(this.props,must);
    }

    doFetchData(props,must) {
        let startDate = props.chart.range.startDate;
        let endDate = props.chart.range.endDate;
        if (!props.chart.range.chosenFlag)
            endDate = moment().format('x');
        let metrics = props.cardChart.metrics;

        //|| (moment().diff(moment(parseInt(this.state.network.lastTime))) < 1000 * 60 && !this.state.network.error)
        //|| this.state.network.isFetching
        //console.log(must,endDate,this.state.network.lastTime,moment().diff(moment(parseInt(this.state.network.lastTime))));
        if(!must) {
            if (!metrics|| (moment().diff(moment(parseInt(this.state.network.lastTime))) < 1000 * 60 && !this.state.network.error) || this.state.network.isFetching)
                return;
        }
        
        this.doFetchDataInner(startDate, endDate, props.cardChart);
    }


/*
其他图表 慢慢集成
一定要实现 getInterval 和 initConfig
 */
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


        /*
        
        {"queries":[{"begin":1488161700,"end":1488165300,"interval":60,"q":"avg:datadog.agent.collector.collection.time{host=wangxh.pc.c}by{host} ; 
        avg:ntp.offset{*}","attributes":{"index":0}},{"begin":1488161700,
        "end":1488165300,"interval":60,
        "q":"avg:system.mem.cached{*}","attributes":{"index":1}}]}
         */


        let interval = this.getInterval(startDate);
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
            let config = this.initConfig({

                isFetching: false,
                data: json.result,
                error: null,

            });

            this.setState({
                network: {
                    isFetching: false,
                    data: json.result,
                    error: null,
                    lastTime: endDate,
                },
                config: config,
            });
            // console.log("json", json);
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
    }
}

