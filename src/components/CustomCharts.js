import ReactHighcharts from 'react-highcharts';
import React from 'react';
import { PropTypes } from 'react';
import { fetchMetric } from './../actions/metric';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import { retryFetch } from './../utils/cFetch'
import { API_CONFIG } from './../config/api';
import cookie from 'js-cookie';
import { setChartSelection } from './../actions/chart';
import ReactDOM from 'react-dom';

import ChartsHeatmap from './ChartsHeatmap';
import ChartsLine from './ChartsLine';
import ChartsTreeMap from './ChartsTreeMap';
import ChartsTopN from './ChartsTopN';
import ChartsPie from './ChartsPie';
import ChartsTable from './ChartsTable';
import ChartsArea from './ChartsArea';
import ChartsColumn from './ChartsColumn';



// React.Component
export default class CustomCharts extends React.Component {

    getChart() {
        if (this.refs.chart && this.refs.chart.getWrappedInstance().getChart)
            return this.refs.chart.getWrappedInstance().getChart();
        return null;
    }

    reloadData() {
        if (this.refs.chart && this.refs.chart.getWrappedInstance().reloadData)
            return this.refs.chart.getWrappedInstance().reloadData();
    }

    render() {
        /*  return <div className="example">
                      
                  </div>;*/

        switch (this.props.type) {
            case "heatmap":
                return <ChartsHeatmap
                    cardChart={this.props.chart} 
                    metrics={this.props.metrics}
                    type={this.props.type}
                    ref="chart"
                    domProps={this.props.domProps} />;
            case "line":

                return <ChartsLine 
                    cardChart={this.props.chart} 
                    metrics={this.props.metrics}
                    type={this.props.type}
                    ref="chart"
                    domProps={this.props.domProps} />;
            case "area":
                return <ChartsArea 
                    cardChart={this.props.chart} 
                    metrics={this.props.metrics}
                    type={this.props.type}
                    ref="chart"
                    domProps={this.props.domProps} />;
            case "pie":
                return <ChartsPie 
                    cardChart={this.props.chart} 
                    metrics={this.props.metrics}
                    type={this.props.type}
                    ref="chart"
                    domProps={this.props.domProps} />;
            case "table":
                return <ChartsTable 
                    cardChart={this.props.chart} 
                    metrics={this.props.metrics}
                    type={this.props.type}
                    ref="chart"
                    domProps={this.props.domProps} />;
            case "bar":
                return <ChartsTopN 
                    cardChart={this.props.chart} 
                    metrics={this.props.metrics}
                    type={this.props.type}
                    ref="chart"
                    domProps={this.props.domProps} />;
            case "treemap":
                return <ChartsTreeMap 
                    cardChart={this.props.chart} 
                    metrics={this.props.metrics}
                    type={this.props.type}
                    ref="chart"
                    domProps={this.props.domProps} />;
            case "events":
                return <ChartsColumn 
                    cardChart={this.props.chart} 
                    metrics={this.props.metrics}
                    type="column"
                    ref="chart"
                    domProps={this.props.domProps} />;
            case "column":
                return <ChartsColumn 
                    cardChart={this.props.chart} 
                    metrics={this.props.metrics}
                    type={this.props.type}
                    ref="chart"
                    domProps={this.props.domProps} />;


            default:
                return <div className="example">
                    <Spin width={100} />
                </div>
        }

    }
}