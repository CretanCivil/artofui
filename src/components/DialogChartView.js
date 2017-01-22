import React from 'react';
import { Modal, } from 'antd';
import CustomCharts from './CustomCharts';
import { Table,Icon } from 'antd';
import { APP_CONFIG } from './../config/app';

// React.Component
export default class DialogChartView extends React.Component {
    constructor(props) {
        super(props);
    }
  
    render() {
        const data = [{
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',

        }, {
                key: '2',
                name: 'Jim Green',
                age: 42,
                address: 'London No. 1 Lake Park',
            }, {
                key: '3',
                name: 'Joe Black',
                age: 32,
                address: 'Sidney No. 1 Lake Park',
            }];
            const columns = [{
            title: 'Name',
            dataIndex: 'name',
            width: 150,

            render: (value, row, index) => <Icon  type="appstore"
                style={{ color: APP_CONFIG.colors[index], fontSize: 20 }}/>
        }, {
                title: 'Age',
                dataIndex: 'age',
                width: 150,
            }, {
                title: 'Address',
                dataIndex: 'address',
                width: 150,
            }];
        return < Modal
            className="expandCharDialog"
            title = {this.props.chart.name}
            wrapClassName = "vertical-center-modal"
            visible = {true}
            onOk = {() => this.props.showDialog(false)}
            onCancel = {() => this.props.showDialog(false)}
            width = {960}
            footer = {<Table columns={columns}  dataSource={data} showHeader={false}
                pagination={false} bordered={false} size="middle" />}
            >
                <CustomCharts
                    metrics={this.props.chart.metrics} 
                    ref="chart" 
                    type={this.props.chart.type == 'timeseries' ? 'line' : this.props.chart.type} 
                    domProps={{style:{ border: '1px solid #ddd', height: 160, width: 928 }}}/>
            </Modal >;
    }
}

