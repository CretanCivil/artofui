import ReactHighcharts from 'react-highcharts';
import React from 'react';
import { PropTypes } from 'react';
import { fetchMetric } from './../actions/metric';
import { connect } from 'react-redux';
import { Button, Row, Col, Select, Form, Icon, Card, Modal, Dropdown, Menu, Spin } from 'antd';
import { retryFetch } from './../utils/cFetch'
import { API_CONFIG } from './../config/api';
import cookie from 'js-cookie';
import { setChartSelection } from './../actions/chart';
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
        this.doFetchData(this.props, must);
    }

    doFetchData(props, must) {
        let startDate = props.chart.range.startDate;
        let endDate = props.chart.range.endDate;
        if (!props.chart.range.chosenFlag)
            endDate = moment().startOf('second').format('x');
        let metrics = props.cardChart.metrics;

        //|| (moment().diff(moment(parseInt(this.state.network.lastTime))) < 1000 * 60 && !this.state.network.error)
        //|| this.state.network.isFetching
        //console.log(must,endDate,this.state.network.lastTime,moment().diff(moment(parseInt(this.state.network.lastTime))));
        if (!must) {
            if (!metrics || (moment().diff(moment(parseInt(this.state.network.lastTime))) < 1000 * 60 && !this.state.network.error) || this.state.network.isFetching)
                return;
        }

        this.doFetchDataInner(startDate, endDate, props.cardChart, props);
    }


    /*
    其他图表 慢慢集成
    一定要实现 getInterval 和 initConfig
     */
    doFetchDataInner(startDate, endDate, chart, props) {
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
            let mustInterupt = false;
            if (metricInfo.tags) {
                tags = metricInfo.tags.map(function (item) {
                    if (props.params[item]) {
                        if (props.params[item].value) {
                            //console.log(props.params[item]);
                            return props.params[item].value.replace(":", "=");
                        } else {
                            mustInterupt = true;
                            return "";
                        }
                    }
                    return item.replace(":", "=")
                });
            }

            if (mustInterupt) {
                this.setState({
                    network: {
                        isFetching: false,
                        data: [],
                        error: null,
                    }
                });

                return;
            }
            if (tags) {
                q += "{" + tags + "}";
            }
            if (!metricInfo.tags) {//*
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
            //console.log(metric.q);
        }
        
        //console.log(API_CONFIG.userHost + API_CONFIG.metric);
        //API_CONFIG.userHost +
        retryFetch(API_CONFIG.metric, {
            method: "POST",
            retries: 3,
            retryDelay: 10000,
            params: {
                /* q: q,
                begin: startDate,
                end: endDate,
                interval: interval,*/
                api_key: API_CONFIG.apiKey,
            },
            ContentType: "application/json",
            //ContentType: "text/plain",
            body: JSON.stringify({ queries: queries }),
            //body: encodeURIComponent(JSON.stringify({ queries: queries }))
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

