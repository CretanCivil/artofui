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
        console.log(must,endDate,this.state.network.lastTime,moment().diff(moment(parseInt(this.state.network.lastTime))));
        if(!must) {
            if (!metrics|| (moment().diff(moment(parseInt(this.state.network.lastTime))) < 1000 * 60 && !this.state.network.error) || this.state.network.isFetching)
                return;
        }
        
        this.doFetchDataInner(startDate, endDate, props.cardChart);
    }
}

