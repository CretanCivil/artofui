import React from 'react';
import { connect } from 'react-redux';

//import CustomTable from './../../components/CustomTable';
//import StringFilterDropdown from './../../components/StringFilterDropdown';
//import DateTimeFilterDropdown from './../../components/DateTimeFilterDropdown';
//const ReactHighcharts = require('react-highcharts');
//import ReactHighcharts from 'react-highcharts';
import ChartsCard from './../../components/ChartsCard';
import { fetchDashboard } from './../../actions/dashboard';
import { fetchTags } from './../../actions/tags';
import { fetchAllMetrics } from './../../actions/all_metrics';
import DialogChartView from './../../components/DialogChartView';
import DialogChartSetting from './../../components/DialogChartSetting';
import { setChartRange, setScopeParams } from './../../actions/chart';
import { setDraging } from './../../actions/app';
let WidthProvider = require('react-grid-layout').WidthProvider;
let ReactGridLayout = require('react-grid-layout');
ReactGridLayout = WidthProvider(ReactGridLayout);
import { Button, Row, Col, Select, Form, Icon, Spin, Dropdown, Menu, notification, Card, Input, Tooltip } from 'antd';
let DateRangerPicker = require('react-bootstrap-daterangepicker');
let moment = require('moment');
import { retryFetch } from '../../utils/cFetch'
import { API_CONFIG } from '../../config/api';
//import '../../../node_modules/react-grid-layout/css/styles.css';
//import './rgl-styles.css';
//import '../../../node_modules/react-resizable/css/styles.css';

//import ReactHighcharts from 'react-highcharts';
//import highchartsTreemap from 'highcharts-treemap';
//import 'rc-cascader/assets/index.css';
import './index.css';
import Highcharts from 'highcharts';
import PubSub from 'vanilla-pubsub';
import Draggable from 'react-draggable';
import InspectorToggle from './../../components/InspectorToggle';

import NoPreviewForMetricsExplorer from './nodata';
//highchartsTreemap(ReactHighcharts.Highcharts);
import format from 'string-format';
import $ from 'jquery';

//const InputGroup = Input.Group;
//const ButtonGroup = Button.Group;
const FormItem = Form.Item;

Highcharts.setOptions({
    global: {
        useUTC: false,
        //timezoneOffset: 8
    },
});


class MetricExplorePage extends React.Component {
    MapAllMetrics = new Map();

    static propTypes = {
        fetchTags: React.PropTypes.func,
        fetchDashboard: React.PropTypes.func,
        dashboard: React.PropTypes.object,
        fetchAllMetrics: React.PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            metrics: [],
            tagKeys: new Set(),
            tagKey: null,

            readonly: true,
            selectedRowKeys: [],

            ranges: {
                '最近60分钟': [moment().subtract(1, 'hours').startOf('minute'), moment().startOf('minute')],
                '最近3小时': [moment().subtract(3, 'hours').startOf('minute'), moment().startOf('minute')],
                '最近12小时': [moment().subtract(12, 'hours').startOf('minute'), moment().startOf('minute')],
                '最近1天': [moment().subtract(1, 'days').startOf('minute'), moment().startOf('minute')],
                '最近3天': [moment().subtract(3, 'days').startOf('minute'), moment().startOf('minute')],
                '最近7天': [moment().subtract(7, 'days').startOf('minute'), moment().startOf('minute')],
                '最近15天': [moment().subtract(15, 'days').startOf('minute'), moment().startOf('minute')],
                '最近30天': [moment().subtract(30, 'days').startOf('minute'), moment().startOf('minute')]
            },
            startDate: moment().subtract(12, 'hours').startOf('minute'),
            endDate: moment().startOf('minute'),
            chosenLabel: '最近12小时',
            chosenFlag: false,//是否为自定义时间，自定义时间列表不更新
            inputValue: '',
            value: [],
            show: false,
            indexBox: [],
            metricName: "",
            expandChart: {
                chart: null,
                show: false,
                type: null,
            },
            settingChart: {
                metric: null,
                show: false,
                type: null,
                chart: null,
            },
            layout: [],
            scope: null,
            dashboardShow: null,
        };

        this.props.setChartRange({
            startDate: this.state.endDate.diff(this.state.startDate),
            endDate: this.state.endDate.format('x')
        });
    }


    componentDidMount() {
        this.props.fetchAllMetrics();
    }


    handleDateRangeChanged(event, picker) {
        //  picker.chosenLabel
        this.setState({
            startDate: picker.startDate,
            endDate: picker.endDate,
            chosenFlag: picker.chosenLabel == '自定义区间',
            chosenLabel: picker.chosenLabel == '自定义区间' ? picker.startDate.format('YYYY-MM-DD') + " - " + picker.endDate.format('YYYY-MM-DD') : picker.chosenLabel,
        });
        //   console.log(moment().subtract(7, 'hours').format('YYYY-MM-DD HH:mm:ss'));
        //console.log(this.state.startDate.format('YYYY-MM-DD HH:mm:ss') + " - " + this.state.endDate.format('YYYY-MM-DD HH:mm:ss'));

        this.props.setChartRange({
            startDate: picker.endDate.diff(picker.startDate),
            endDate: picker.endDate.format('x'),
            chosenFlag: picker.chosenLabel == '自定义区间',
        });
    }


    changeMetric(val) {




        console.log(val);
        let keys = new Set();
        for (let metric of val) {
            for (let key of this.MapAllMetrics.get(metric).keys()) {
                keys.add(key);
            }
            // console.log(this.MapAllMetrics.get(metric));

        }
        console.log(keys);

        let tagKey = keys.has(this.state.tagKey) ? this.state.tagKey : null;


        this.setState({
            metrics: val,
            tagKeys: keys,
            tagKey: tagKey,
        });
    }

    initAllMetricMap(allMetrics) {
        for (let metric of allMetrics.data) {
            let mapTag = new Map();
            for (let tag of metric.tags) {
                let arr = tag.split(':');
                if (arr.length > 0) {
                    let vals = mapTag.get(arr[0]);
                    if (!vals) {
                        vals = [];
                        mapTag.set(arr[0], vals);
                    }


                    vals.push(arr[1]);
                }
            }
            this.MapAllMetrics.set(metric.metric, mapTag);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.allMetrics != this.props.allMetrics) {
            this.initAllMetricMap(nextProps.allMetrics);
        }
    }

    reset() {
        this.setState({
            metrics: [],
            tagKeys: new Set(),
            tagKey: null,
        });
    }

    changeTagKey(val) {
        this.setState({
            tagKey: val,
        });
    }


    render() {
        //scope=host%3Awan-177
        //console.log(this.props.params);
        //console.log(this.props.location.query);

        // console.log(this.props.allMetrics);

        let optionMetrics = [];

        if (!this.props.allMetrics.isFetching) {
            for (let metric of this.props.allMetrics.data) {
                let option = <Select.Option key={metric.metric} value={metric.metric}>{metric.metric}</Select.Option>
                optionMetrics.push(option);
            }
        }


        let optionKeys = [];
        for (let key of this.state.tagKeys) {
            let option = <Select.Option key={key} value={key}>{key}</Select.Option>
            optionKeys.push(option);
        }





        const menu = (
            <Menu>
                <Menu.Item>
                    10
                </Menu.Item>
                <Menu.Item>
                    20
                </Menu.Item>
                <Menu.Item>
                    30
                </Menu.Item>
            </Menu>
        );

        let charts = [];
        for (let metric of this.state.metrics) {
            let metrics = [];
            if (this.state.tagKey && this.MapAllMetrics.get(metric).has(this.state.tagKey)) {
                // console.log("sssss", this.MapAllMetrics,this.MapAllMetrics.get(metric).get(this.state.tagKey));

                for (let tval of this.MapAllMetrics.get(metric).get(this.state.tagKey)) {


                    metrics.push({
                        metric: metric,
                        aggregator: "avg",
                        type: "line",
                        rate: false,
                        by: null,
                        tags: [this.state.tagKey + ":" + tval],
                        id: 0
                    });
                }
            } else {
                metrics.push({
                    metric: metric,
                    aggregator: "avg",
                    type: "line",
                    rate: false,
                    by: null,
                    tags: null,
                    id: 0
                });
            }


            let chart = {
                dashboard_id: 0,
                id: 0,
                meta: { modelType: "normal" },
                metrics: metrics,
                name: metric,
                type: "timeseries"
            };
            let card = <Col key={this.state.metrics.indexOf(metric)} sm={12} style={{ height: '320px', textAlign: 'left', marginBottom: '10px', }}><ChartsCard chart={chart}

                readonly={true}></ChartsCard></Col>;

            charts.push(card);
        }



        return (
            <div style={{}}>
                <div className="page-header" >
                    <Row type="flex" justify="space-between" >
                        <Col>
                            <h1>浏览指标<small><Tooltip placement="bottom" title="指标浏览器允许您快速选择指标并保存到仪表盘中。您可以从指标浏览器中选择并预览指标。还可以对指标按照标签进行过滤或分组。选择的指标可以保存到已有的仪表盘终,也可以用其创建全新的仪表盘。"><Icon type="question-circle" /></Tooltip></small></h1>
                        </Col>
                        <Col span={7} style={{ marginLeft: '4%' }}>
                            <Row type="flex" justify="end">
                                <Col style={{ textAlign: 'right' }} >
                                    <DateRangerPicker startDate={this.state.startDate}
                                        endDate={this.state.endDate} ranges={this.state.ranges}
                                        opens="left"
                                        timePicker={true}
                                        dateLimit={{ days: 30 }}
                                        maxDate={moment()}
                                        locale={{
                                            customRangeLabel: '自定义区间',
                                            applyLabel: '应用',
                                            cancelLabel: '取消',
                                        }}
                                        onApply={this.handleDateRangeChanged.bind(this)}>
                                        <Button type="primary" size="large" style={{ paddingRight: 10 }}><Icon type="calendar" />{this.state.chosenLabel}<Icon type="arrow-down" /></Button >
                                    </DateRangerPicker>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </div>



                <Row key={"4"} style={{ marginLeft: '10px', marginRight: '10px', marginBottom: '10px' }}>
                    <Col lg={8} >
                        <Card>
                            <FormItem label="指标" hasFeedback>
                                <Select multiple style={{ width: '100%' }} placeholder="请选择指标"
                                    onChange={(val) => this.changeMetric(val)}
                                    defaultValue={this.state.metrics ? this.state.metrics : []}
                                    value={this.state.metrics ? this.state.metrics : []}
                                    showSearch
                                    >
                                    {optionMetrics}
                                </Select>
                            </FormItem>

                            <FormItem label="按标签key分组" hasFeedback>
                                <Select style={{ width: '100%' }} placeholder="请选择标签key"
                                    onChange={(val) => this.changeTagKey(val)}
                                    defaultValue={this.state.tagKey}
                                    value={this.state.tagKey}
                                    >
                                    {optionKeys}
                                </Select>
                            </FormItem>

                            <FormItem label="保存设置" hasFeedback>
                                <Input placeholder="请输入前缀..." />
                            </FormItem>

                            <div className="ant-form-item-label"><div style={{float: 'left'}}>选择图表数量最大值</div><Dropdown overlay={menu} >
                                <div href="#" style={{float: 'left',padding: '0 5px'}}>
                                    10 <Icon type="down" />
                                </div>
                                
                            </Dropdown></div>

                            <FormItem label="保存当前选择" >
                                <Row type="flex" justify="start">
                                    <Col span={4} >{this.state.metrics.length == 0 ? <Button disabled>新建仪表盘</Button> : <Button>新建仪表盘</Button>}</Col>
                                    <Col span={4} style={{ marginLeft: '20px' }}>{this.state.metrics.length == 0 ? <Button disabled>已有仪表盘</Button> : <Button>已有仪表盘</Button>}</Col>
                                    <Col span={4} style={{ marginLeft: '20px' }}>{this.state.metrics.length == 0 ? <Button disabled>保存为仪表盘</Button> : <Button>保存为仪表盘</Button>}</Col>
                                </Row>


                            </FormItem>

                            <FormItem >
                                <Button onClick={this.reset.bind(this)} type="primary">重置</Button>
                            </FormItem>
                        </Card>
                    </Col>

                    <Col lg={16} style={{ textAlign: 'right' }}>
                        {this.state.metrics.length == 0 ? <NoPreviewForMetricsExplorer /> : <div className="metric-layout" >
                            <Row >
                                {charts}
                            </Row>

                        </div>}

                    </Col>

                </Row>

            </div>

        );


    }
}

// Which part of the Redux global state does our component want to receive as props?
function mapStateToProps(state) {
    const { dashboard, tags, allMetrics } = state;
    return {
        dashboard,
        tags,
        allMetrics
    };
}

// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch) {
    // bindActionCreators(ActionCreators, dispatch)
    return {
        fetchDashboard: (params) => dispatch(fetchDashboard(params)),
        fetchTags: (params) => dispatch(fetchTags(params)),
        fetchAllMetrics: (params) => dispatch(fetchAllMetrics(params)),
        setChartRange: (params) => dispatch(setChartRange(params)),
        setDraging: (params) => dispatch(setDraging(params)),
        setScopeParams: (params) => dispatch(setScopeParams(params)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MetricExplorePage);
