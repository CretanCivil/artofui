import React from 'react';
import { Modal, } from 'antd';
import CustomCharts from './CustomCharts';

// React.Component
export default class DialogChartView extends React.Component {
    constructor(props) {
        super(props);
    }
  
    render() {
        return < Modal
            className="expandCharDialog"
            title = {this.props.chart.name}
            wrapClassName = "vertical-center-modal"
            visible = {true}
            onOk = {() => this.props.showDialog(false)
            }
            onCancel = {() => this.props.showDialog(false) }
            width = { 960}
            footer = { <Table columns={columns}  dataSource={data} showHeader={false}
                pagination={false} bordered={false} size="middle" /> }
            >
            <CustomCharts
                metrics={this.props.chart.metrics} ref="chart" type={this.props.chart.type == 'timeseries' ? 'line' : this.props.chart.type} domProps={{ style: { border: '1px solid #ddd', height: 160, width: 928 }, }} />

         

        </Modal >;
    }
}

