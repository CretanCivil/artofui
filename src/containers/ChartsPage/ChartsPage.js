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
import { setChartRange } from './../../actions/chart';
import { setDraging } from './../../actions/app';
let WidthProvider = require('react-grid-layout').WidthProvider;
let ReactGridLayout = require('react-grid-layout');
ReactGridLayout = WidthProvider(ReactGridLayout);
import { Button, Row, Col, Select, Form, Icon, Spin } from 'antd';
let DateRangerPicker = require('react-bootstrap-daterangepicker');
let moment = require('moment');
import { retryFetch } from '../../utils/cFetch'
import { API_CONFIG } from '../../config/api';
import '../../../node_modules/react-grid-layout/css/styles.css';
import '../../../node_modules/react-resizable/css/styles.css';

//import ReactHighcharts from 'react-highcharts';
//import highchartsTreemap from 'highcharts-treemap';
import 'rc-cascader/assets/index.css';
import Highcharts from 'highcharts';
import PubSub from 'vanilla-pubsub';
import Draggable from 'react-draggable';
import InspectorToggle from './../../components/InspectorToggle';
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


export class ChartsPage extends React.Component {



    static propTypes = {
        fetchTags: React.PropTypes.func,
        fetchDashboard: React.PropTypes.func,
        dashboard: React.PropTypes.object,
        fetchAllMetrics: React.PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.handleTableChange = this.handleTableChange.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.state = {
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

        };

        this.props.setChartRange({
            startDate: this.state.endDate.diff(this.state.startDate),
            endDate: this.state.endDate.format('x')
        });
    }



    setMetrics(metric_name, path) {
        this.setState({
            indexBox: path,
            metricName: metric_name
        });
    }

    componentDidMount() {
        PubSub.subscribe('App.dashboard.refresh', this.doFetchData.bind(this));

        this.doFetchData();
    }

    componentWillUnmount() {
        PubSub.unsubscribe('App.dashboard.refresh', this.doFetchData.bind(this));
    }


    doFetchData() {
        retryFetch(format(API_CONFIG.show,$("#dashboard").attr("dashboardid")), {
            method: "GET",
            retries: 3,
            retryDelay: 10000,
            params: {
            }
        }).then(function (response) {
            return response.json();
        }).then((json) => {
            let layout = [];
            if (json.result) {


               // console.log("json.result.order", JSON.parse(json.result.order));
                for (let data of JSON.parse(json.result.order)) {
                   // console.log(data);
                    let tmp = {};
                    tmp.i = data[0];
                    tmp.x = data[1];
                    tmp.y = data[2];
                    if (data[3] == 1 && data[4] == 1) {
                        data[3] = 3;
                        data[4] = 2;
                    }
                    tmp.w = data[3];
                    tmp.h = data[4];
                    tmp.minW = 3;
                    layout.push(tmp);
                }

                this.setState({
                    layout: layout,

                });
                console.log("layoutlayoutjson", json);
            }
            this.props.fetchDashboard();
            this.props.fetchTags();
            this.props.fetchAllMetrics();
        });
    }

    updateLyaouts(layout) {
        retryFetch(format(API_CONFIG.updateLayout,$("#dashboard").attr("dashboardid")), {
            method: "POST",
            retries: 3,
            retryDelay: 10000,
            body: 'charts=' + encodeURIComponent(JSON.stringify(layout))
        }).then(function (response) {
            return response.json();
        }).then((json) => {
            let layout = [];
            if (json.result) {
                //console.log("json.result.order", JSON.parse(json.result.order));
                for (let data of JSON.parse(json.result.order)) {
                    //console.log(data);
                    let tmp = {};
                    tmp.i = data[0];
                    tmp.x = data[1];
                    tmp.y = data[2];
                    if (data[3] == 1 && data[4] == 1) {
                        data[3] = 3;
                        data[4] = 2;
                    }
                    tmp.w = data[3];
                    tmp.h = data[4];
                    tmp.minW = 3;
                    layout.push(tmp);
                }

                this.setState({
                    layout: layout,

                });
                console.log("json", json);
            }
        });
    }

    //https://cloud.oneapm.com/v1/dashboards/11997/update.json
    /*
    charts:[["1335363",1,0,3,2],["1335324",4,0,4,2],["1334614",8,0,4,2],["1340727",0,2,4,2],["1335422",4,2,4,2],["1337562",8,2,4,2],["1334605",0,4,4,2],["1353676",4,4,4,2],["1335345",8,4,4,2],["1333992",3,6,5,3],["1335327",8,6,4,2],["1344412",8,8,4,2],["1340726",0,9,4,2],["1353280",0,11,4,2]]

    
     */


    onChange(value, selectedOptions) {
        const lastSelected = selectedOptions[selectedOptions.length - 1];
        if (lastSelected.children && lastSelected.children.length === 1) {

            value.push(lastSelected.children[0].value);
            this.setState({
                inputValue: ['浙江', '杭州'],
                value: ["jiangsu", "nanjing", "zhonghuamen"],
            });
            return;
        }
        this.setState({
            inputValue: selectedOptions.map(o => o.label).join(', '),
            value,
        });
    }

    handleTableChange(pagination, filters = {}, sorter = {}) {
        const pageParams = { page: pagination.current, per_page: pagination.pageSize };
        const filtersField = {};
        if (Object.keys(filters).length !== 0) {
            // enum filters
            [{
                key: "roles", filterParams: "roles_in"
            }].map(item => {
                if (filters[item.key]) {
                    filtersField[`q[${item.filterParams}]`] = filters[item.key];
                }
            });

            // date range filter
            ['created_at'].map(item => {
                if (filters[item]) {
                    filtersField[`q[${item}_gteq]`] = filters[item][0];
                    filtersField[`q[${item}_lteq]`] = filters[item][1];
                }
            });

            // string filter
            ['name'].map(item => {
                if (filters[item]) {
                    filtersField[`q[${item}_cont]`] = filters[item];
                }
            });
        }
        const sortParams = {};
        if (Object.keys(sorter).length !== 0) {
            const sortMethod = sorter.order === "descend" ? "desc" : "asc";
            sortParams['sorts'] = `${sorter.columnKey} ${sortMethod}`;
        }

        const params = Object.assign({}, pageParams, filtersField, sortParams);
        this.props.fetchDashboard(params);
    }

    onSelectChange(selectedRowKeys) {
        this.setState({ selectedRowKeys });
    }



    showDialog(show, metric, type, chart) {
        this.setState({
            settingChart: {
                metric: metric,
                show: show,
                type: type,
                chart: chart,
            }
        });
    }

    showChartDialog(isShow, metric, type) {
        this.setState({
            expandChart: {
                chart: metric,
                show: isShow,
                type: type,
            }
        });
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

    onLayoutChange(layout) {
        let datas = [];
        for (let data of layout) {
            let tmp = [];
            tmp.push(data.i, data.x, data.y, data.w, data.h)

            datas.push(tmp);
        }
        this.updateLyaouts(datas);
    }

    onDragStart(layout, oldLayoutItem, layoutItem) {
        this.props.setDraging({
            isDraging: true,
            item: layoutItem,
        });
    }
    // Calls on each drag movement.
    onDrag() {

    }
    // Calls when drag is complete.
    onDragStop() {
        this.props.setDraging({
            isDraging: false,
            item: null,
        });
    }



    render() {
        const { dashboard: { data, isFetching } } = this.props;
        const { tags } = this.props;

        if (isFetching && data.length == 0) {
            return (
                <Row type="flex" justify="space-around" align="middle" style={{ minHeight: 500 }}><Col><Spin /></Col></Row>
            );
        }

        let charts = [];
        for (let i = 0; i < data.length; i++) {
            let chart = data[i];
            let col = <div key={chart.id} style={{ backgroundColor: 'white', height: '100%' }}><ChartsCard
                ref={"chart_" + chart.id}
                chart={chart}
                expand={this.showChartDialog.bind(this)}
                setting={this.showDialog.bind(this)}
                /></div>;
            charts.push(col);
        }

        let options = [];
        for (let tag in tags.data) {
            let option = <Select.Option key={tag} value={tag}>{tags.data[tag]}</Select.Option>;
            options.push(option);
        }



        /*
        var layouts = getLayoutsFromSomewhere();
  return (
    <ResponsiveReactGridLayout className="layout" layouts={layouts}
      breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
      cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}>
      <div key={"1"}>1</div>
      <div key={"2"}>2</div>
      <div key={"3"}>3</div>
    </ResponsiveReactGridLayout>
  )

         <CascadeSelect style={{ width: 200, }}
                          defaultValue={['alibaba', 'platform', 'fe']}
                          options={casCadeoptions}
                          expandTrigger='hover'
                          clearable
                          onChange={(value, selected) => console.log(value, selected) }
                          />
    
    
            timePicker: React.PropTypes.bool,
            timePickerIncrement: React.PropTypes.number,
            timePicker24Hour: React.PropTypes.bool,
            timePickerSeconds: React.PropTypes.bool,
             */
        return (
            <div style={{}}>

                <Row key={"4"} type="flex" justify="space-between" style={{ marginLeft: 10 }}>
                    <Col span={8}>
                        <Form inline >
                            <FormItem>
                                <Select multiple style={{ width: 400 }}>
                                    {options}
                                </Select>
                            </FormItem>
                        </Form>
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
                            <Col style={{ marginLeft: 4 }}>
                                <Button icon="setting" className="ant-search-btn" onClick={() => this.showDialog(true,
                                    [{ metric: "system.load.1", aggregator: "avg", type: "line", rate: false, by: null, tags: null, id: 0 }],
                                    'timeseries',
                                    {
                                        dashboard_id: $("#dashboard").attr("dashboardid"),
                                        id: 0,
                                        meta: { modelType: "normal" },
                                        metrics:
                                        [{
                                            metric: "system.load.1", aggregator: "avg", type: "line",
                                            rate: false, by: null, tags: null, id: 0
                                        }],
                                        name: "新建图表",
                                        type: "timeseries"
                                    })} />

                            </Col>
                        </Row>
                    </Col>
                </Row>
                <ReactGridLayout layout={this.state.layout} style={{ width: '100%' }} className="layout"
                    onDragStart={this.onDragStart.bind(this)}
                    onDrag={this.onDrag.bind(this)}
                    onDragStop={this.onDragStop.bind(this)}
                    onLayoutChange={this.onLayoutChange.bind(this)} >

                    {charts}
                </ReactGridLayout>
                {this.state.settingChart.show ? <DialogChartSetting key="DialogChartSetting"
                    tags={tags}
                    chart={this.state.settingChart.chart}
                    type={this.state.settingChart.type}
                    metrics={this.state.settingChart.metric}
                    showDialog={this.showDialog.bind(this)} /> : ''}
                {this.state.expandChart.show ? <DialogChartView key="DialogChartView"
                    chart={this.state.expandChart.chart}
                    type={this.state.expandChart.type}
                    tags={tags}
                    showDialog={this.showChartDialog.bind(this)} /> : ''}

                <InspectorToggle />



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
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChartsPage);
