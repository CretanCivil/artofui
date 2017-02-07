import React from 'react';
import { Modal, } from 'antd';
import CustomCharts from './CustomCharts';
import { Table, Icon } from 'antd';
import { APP_CONFIG } from './../config/app';
import ReactResizeDetector from 'react-resize-detector';
import { connect } from 'react-redux';

// React.Component
class DialogChartView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dimensions: {
                width: -1,
                height: -1
            }
        }
    }


    render() {
        let table = null;
        if(this.props.chart.type == 'timeseries') {
            const data = [];

            for(let i = 0; i < this.props.points.points.length;i++) {
                let point = this.props.points.points[i];
                let tmp = {};
                tmp.key = i;
                tmp.color = point.color;
                tmp.value = point.value.toFixed(2);
                tmp.metric = point.aggregator + ":" + point.metric + " - " + point.name;
                data.push(tmp);
            }

            const columns = [{
                title: '',
                dataIndex: 'color',
                width: '1em',

                render: (value, row, index) => <Icon type="appstore"
                    style={{ color: this.props.points.points[index].color, fontSize: 20 }} />
            }, {
                title: '',
                dataIndex: 'value',
                width: '4em',
            }, {
                title: '',
                dataIndex: 'metric',
                width: '7em',
            }];

            table = <Table columns={columns} dataSource={data} showHeader={false} style={{padding:'10px 0',height:'35%',overflow:'auto'}}
                    pagination={false} bordered={false} size="middle" />
        }
        
        return < Modal
            className="expandCharDialog modal-dialog-max"
            title={this.props.chart.name}
            wrapClassName="vertical-center-modal"
            visible={true}
            style={{ margin: '30px auto', top: 0,minHeight:400 }}
            onOk={() => this.props.showDialog(false)}
            onCancel={() => this.props.showDialog(false)}
            footer={null}
            >
   
            <CustomCharts
                metrics={this.props.chart.metrics}
                ref="chart"
                chart={this.props.chart} 
                type={this.props.chart.type == 'timeseries' ? 'line' : this.props.chart.type}
                domProps={{ style: { border: '1px solid #ddd', height: table ? '50%' : '80%', width: '100%', marginBottom:20} }} />

                {table}
        </Modal >;
    }
}


function mapStateToProps(state) {
    const { points, } = state;
    return {
        points,

    };
}

export default connect(
    mapStateToProps,
)(DialogChartView);