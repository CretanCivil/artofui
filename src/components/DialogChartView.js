import ReactHighcharts from 'react-highcharts';
import React from 'react';
import { PropTypes } from 'react';
import { fetchMetric } from './../actions/metric';
import { connect } from 'react-redux';
import {  Button, Row, Col, Select, Form, Icon, Modal, Tabs, Spin, Table, Checkbox, Input } from 'antd';
import NormalSelectEditor from './NormalSelectEditor';
import $ from 'jquery';
import { APP_CONFIG } from './../config/app';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import CustomCharts from './CustomCharts';

// React.Component
export default class DialogChartView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            indexBox: [],
            metricName: "",
        };
    }


    closeBox() {
        this.setState({
            show: false
        });
        $('.ant-tabs').css('overflow', 'hidden');
    }

    showBox() {
        this.setState({
            show: true
        });
        $('.ant-tabs').css('overflow', 'visible');
    }

    setMetrics(metric_name, path) {
        console.log(metric_name);
        this.setState({
            indexBox: path,
            metricName: metric_name
        });
    }

    render() {

        let pieConfig = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,

            },
            title: {
                text: null
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
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
            legend: {//控制图例显示位置
                layout: 'vertical',
                align: 'left',
                floating: true,
                x: 560,
                y: 15,
                verticalAlign: 'top',
                borderWidth: 0
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                data: [
                    ['Firefox', 45.0],
                    ['IE', 26.8],
                    {
                        name: 'Chrome',
                        y: 12.8,
                    },
                    ['Safari', 8.5],
                    ['Opera', 6.2],
                    ['Others', 0.7]
                ]
            }],
            credits: {
                enabled: false // 禁用版权信息
            },
        };

        const lineConfig = {
            chart: {
                type: 'spline'
            },
            colors: APP_CONFIG.colors,
            title: {
                text: null
            },
            credits: {
                enabled: false // 禁用版权信息
            },
            xAxis: {
                type: 'datetime',
                dateTimeLabelFormats: { // don't display the dummy year
                    month: '%e. %b',
                    year: '%b'
                },
                title: {
                    text: null
                }
            },
            yAxis: {
                title: {
                    text: null
                },
                min: 0
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
            },
            plotOptions: {
                spline: {
                    marker: {
                        enabled: true
                    }
                }
            },
            series: [{
                name: 'Winter 2007-2008',
                showInLegend: false,
                // Define the data points. All series have a dummy year
                // of 1970/71 in order to be compared on the same x axis. Note
                // that in JavaScript, months start at 0 for January, 1 for February etc.
                data: [
                    [Date.UTC(1970, 9, 27), 0],
                    [Date.UTC(1970, 10, 10), 0.6],
                    [Date.UTC(1970, 10, 18), 0.7],
                    [Date.UTC(1970, 11, 2), 0.8],
                    [Date.UTC(1970, 11, 9), 0.6],
                    [Date.UTC(1970, 11, 16), 0.6],
                    [Date.UTC(1970, 11, 28), 0.67],
                    [Date.UTC(1971, 0, 1), 0.81],
                    [Date.UTC(1971, 0, 8), 0.78],
                    [Date.UTC(1971, 0, 12), 0.98],
                    [Date.UTC(1971, 0, 27), 1.84],
                    [Date.UTC(1971, 1, 10), 1.80],
                    [Date.UTC(1971, 1, 18), 1.80],
                    [Date.UTC(1971, 1, 24), 1.92],
                    [Date.UTC(1971, 2, 4), 2.49],
                    [Date.UTC(1971, 2, 11), 2.79],
                    [Date.UTC(1971, 2, 15), 2.73],
                    [Date.UTC(1971, 2, 25), 2.61],
                    [Date.UTC(1971, 3, 2), 2.76],
                    [Date.UTC(1971, 3, 6), 2.82],
                    [Date.UTC(1971, 3, 13), 2.8],
                    [Date.UTC(1971, 4, 3), 2.1],
                    [Date.UTC(1971, 4, 26), 1.1],
                    [Date.UTC(1971, 5, 9), 0.25],
                    [Date.UTC(1971, 5, 12), 0]
                ]
            }, {
                    name: 'Winter 2008-2009',
                    showInLegend: false,
                    data: [
                        [Date.UTC(1970, 9, 18), 0],
                        [Date.UTC(1970, 9, 26), 0.2],
                        [Date.UTC(1970, 11, 1), 0.47],
                        [Date.UTC(1970, 11, 11), 0.55],
                        [Date.UTC(1970, 11, 25), 1.38],
                        [Date.UTC(1971, 0, 8), 1.38],
                        [Date.UTC(1971, 0, 15), 1.38],
                        [Date.UTC(1971, 1, 1), 1.38],
                        [Date.UTC(1971, 1, 8), 1.48],
                        [Date.UTC(1971, 1, 21), 1.5],
                        [Date.UTC(1971, 2, 12), 1.89],
                        [Date.UTC(1971, 2, 25), 2.0],
                        [Date.UTC(1971, 3, 4), 1.94],
                        [Date.UTC(1971, 3, 9), 1.91],
                        [Date.UTC(1971, 3, 13), 1.75],
                        [Date.UTC(1971, 3, 19), 1.6],
                        [Date.UTC(1971, 4, 25), 0.6],
                        [Date.UTC(1971, 4, 31), 0.35],
                        [Date.UTC(1971, 5, 7), 0]
                    ]
                }, {
                    name: 'Winter 2009-2010',
                    showInLegend: false,
                    data: [
                        [Date.UTC(1970, 9, 9), 0],
                        [Date.UTC(1970, 9, 14), 0.15],
                        [Date.UTC(1970, 10, 28), 0.35],
                        [Date.UTC(1970, 11, 12), 0.46],
                        [Date.UTC(1971, 0, 1), 0.59],
                        [Date.UTC(1971, 0, 24), 0.58],
                        [Date.UTC(1971, 1, 1), 0.62],
                        [Date.UTC(1971, 1, 7), 0.65],
                        [Date.UTC(1971, 1, 23), 0.77],
                        [Date.UTC(1971, 2, 8), 0.77],
                        [Date.UTC(1971, 2, 14), 0.79],
                        [Date.UTC(1971, 2, 24), 0.86],
                        [Date.UTC(1971, 3, 4), 0.8],
                        [Date.UTC(1971, 3, 18), 0.94],
                        [Date.UTC(1971, 3, 24), 0.9],
                        [Date.UTC(1971, 4, 16), 0.39],
                        [Date.UTC(1971, 4, 21), 0]
                    ]
                }]
        };

        const treeConfig = {
            colorAxis: {
                minColor: '#FFFFFF',
                maxColor: '#FF0000',
            },
            series: [{
                type: "treemap",
                layoutAlgorithm: 'squarified',
                data: [{
                    name: 'A',
                    value: 6,
                }, {
                        name: 'B',
                        value: 6,
                    }, {
                        name: 'C',
                        value: 4,
                    }, {
                        name: 'D',
                        value: 3,
                    }, {
                        name: 'E',
                        value: 2,
                    }, {
                        name: 'F',
                        value: 2,
                    }, {
                        name: 'G',
                        value: 1,
                    }]
            }],
            title: {
                text: null
            },
            credits: {
                enabled: false // 禁用版权信息
            },
        };

        const barConfig = {
            chart: {
                type: 'bar'
            },
            title: {
                text: null,
            },
            credits: {
                enabled: false // 禁用版权信息
            },
            xAxis: {
                categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
            },
            yAxis: {
                min: 0,
                title: {
                    text: null,
                }
            },


            series: [{
                showInLegend: false,
                name: 'John',
                data: [5, 3, 4, 7, 2]
            }, {
                    name: 'Jane',
                    showInLegend: false,
                    data: [2, 2, 3, 2, 1]
                }, {
                    name: 'Joe',
                    showInLegend: false,
                    data: [3, 4, 4, 2, 5]
                }]
        };

        const areaConfig = {
            chart: {
                type: 'area',
                spacingBottom: 30,
            },
            title: {
                text: null,
            },
            xAxis: {
                categories: ['Apples', 'Pears', 'Oranges', 'Bananas', 'Grapes', 'Plums', 'Strawberries', 'Raspberries']
            },
            yAxis: {
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                },
                title: {
                    text: null,
                }
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        this.x + ': ' + this.y;
                }
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: false,//是否显示节点
                    },
                    stickyTracking: true,
                },
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Jane',
                showInLegend: false,
                data: [1, 0, 3, null, 3, 1, 2, 1]
            }]
        };

        const columnConfig = {
            chart: {
                type: 'column'
            },
            credits: {
                enabled: false
            },
            title: {
                text: null
            },
            xAxis: {
                categories: ['一小时前']
            },
            yAxis: {
                min: 0,
                title: {
                    text: null
                },
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                }
            },
            series: [{
                showInLegend: false,
                name: 'John',
                data: [5]
            }, {
                    name: 'John',
                    showInLegend: false,
                    data: [6]
                }, {
                    name: 'John',
                    showInLegend: false,
                    data: [7]
                }, {
                    name: 'John',
                    showInLegend: false,
                    data: [8]
                },]
        };

        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            width: 150,

            render: (value, row, index) => <Icon  type="appstore"
                style={{ color: APP_CONFIG.colors[index], fontSize: 20 }}></Icon>
        }, {
                title: 'Age',
                dataIndex: 'age',
                width: 150,
            }, {
                title: 'Address',
                dataIndex: 'address',
                width: 150,
            }];
        const tableData = [];
        for (let i = 0; i < 100; i++) {
            tableData.push({
                key: i,
                name: `Edward King ${i}`,
                age: 32,
                address: `London, Park Lane no. ${i}`,
            });
        };

        let options = [];
        for (let tag in this.props.tags.data) {
            let option = <Select.Option key={tag} value={tag}>{this.props.tags.data[tag]}</Select.Option>
            options.push(option);
        }

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

