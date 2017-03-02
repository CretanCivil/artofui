import React from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col, Select, Modal, Tabs, Spin, Checkbox, Input, Radio, Form } from 'antd';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import CustomCharts from './CustomCharts';
import ChartsDetailSetting from './ChartsDetailSetting';
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
import { fetchNormal } from './../actions/normal';
import ChartsModelTypeSettingPro from './ChartsModelTypeSettingPro';
import { retryFetch, toQueryString } from '../utils/cFetch'
import { API_CONFIG } from '../config/api';
let moment = require('moment');
import PubSub from 'vanilla-pubsub';
const FormItem = Form.Item;

// React.Component
class DialogChartSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            metrics: null,
            chartType: "line",
            hasby: false,
            name: '',
            eventsQuery: '',
            chart: null,
        };
    }

    componentWillMount() {
        this.setState({
            chart: Object.assign({},this.props.chart),
            metrics: Array.from(this.props.metrics),
            chartType: this.props.type == "timeseries" ? "line" : this.props.type,
            name: this.props.chart.name,
            eventsQuery: this.props.chart.meta.events_query,
        });
        this.initHasby(this.props.type);
    }

    componentDidMount() {
        this.props.fetchNormal();
    }

    //chart:{
    //"type":"timeseries",
    //"metrics":[{"metric":"system.net.packets_in.count","aggregator":"avg","type":"line","rate":false,"id":1482717689331,"tags":null,"by":null}],
    //"meta":{"modelType":"pro"},
    //"name":"avg-system.net.packets_in.count-timeserie"}

    //https://cloud.oneapm.com/v1/dashboards/11997/charts/1335327/update.json

    /*
    {"type":"timeseries","metrics":[{"metric":"system.net.packets_in.count","aggregator":"avg","type":"line","rate":false,"id":1482474283162,"tags":[],"by":["device_name"]}],"meta":{"modelType":"pro","indexBox":[1,0,0]},"name":"验证含有from里面仅含有两种数据"}
    {"type":"timeseries","metrics":[{"metric":"system.net.packets_in.count","aggregator":"avg","type":"line","rate":false,"id":1482474283162,"tags":[],"by":["device_name"]}],"meta":{"modelType":"normal"},"name":"验证含有from里面仅含有两种数据",}
     */

    saveSetting() {
        let layout = {};
        layout.name = this.state.name;
        layout.meta = this.state.chart.meta;
        layout.type = this.state.chartType == 'line' ? 'timeseries' : this.state.chartType;
        layout.metrics = this.state.chart.metrics;
        // `User ${user.name} is not authorized to do ${action}.`);
        //1484923220972
        //https://cloud.oneapm.com/v1/dashboards/11997/charts/add.json

        let url = `/p1/dashboards/${this.props.chart.dashboard_id}/charts/${this.props.chart.id}/update.json`;

        if (this.props.chart.id == 0) {
            url = `/p1/dashboards/${this.props.chart.dashboard_id}/charts/add.json`;
        }

        for (let metric of this.state.metrics) {
            metric.id = moment().format('x');
        }

        retryFetch(url, {
            method: "POST",
            retries: 3,
            retryDelay: 10000,
            params: {
                api_key:API_CONFIG.apiKey
            },
            body: 'chart=' + encodeURIComponent(JSON.stringify(layout))
        }).then(function (response) {
            return response.json();
        }).then((json) => {
            this.props.showDialog(false);
            console.log("json", json);

            PubSub.publish('App.dashboard.refresh');
        });
    }

    passData(index, params) {
        let tags = params.host.map(function (item) {
            return item.replace(":", "=")
        });
        let arr = Array.from(this.state.metrics);
        let metric = Object.assign({}, arr[index], {
            aggregator: params.agg,
            by: (params.by && params.by.length > 0) ? params.by : null,
            tags: tags.length > 0 ? tags : null,
            metric: params.metricName,
            rate: params.rate ? true : false,
        });

        arr[index] = metric;


        let chart = Object.assign({},this.state.chart) ;
        chart.metrics = arr;

        this.setState({
            metrics: arr,
            chart:chart,
        });
    }

    initHasby(chartType) {
        switch (chartType) {
            case "heatmap":
            case "area":
                this.setState({
                    hasby: false,
                });
                break;
            default:
                this.setState({
                    hasby: true,
                });
        }

    }

    genMetricPanelNormal() {
        let panels = this.state.metrics.map(function (item, index) {
            return <ChartsDetailSetting passData={this.passData.bind(this, index)} key={index} metric={item} hasby={this.state.hasby} />
        }, this);
        return panels;
    }

    genProModel() {
        let panels = this.state.metrics.map(function (item, index) {
            return <ChartsModelTypeSettingPro passData={this.passData.bind(this, index)} key={index} metric={item} hasby={this.state.hasby} />
        }, this);
        return panels;
    }

    genBucket() {
        ////events_query
        //onChange={this.onChangeTitle.bind(this)} defaultValue={this.state.name}
        let panels = <Form vertical={true}><FormItem
            label="关键字"
          >
            <Input ref="eventsQuery" placeholder="Anything" onChange={this.onChangeEventsQuery.bind(this)} defaultValue={this.state.eventsQuery} />
          </FormItem></Form>;
        return panels;
    }
    onChangeEventsQuery(e) {
        let chart = Object.assign({},this.state.chart) ;
        chart.meta.events_query = e.target.value;
        this.setState({
            eventsQuery: e.target.value,
            chart:chart,
        });


    }

    onChangeTitle(e) {
        this.setState({
            name: e.target.value,
        });
    }

    


    changeChartType(event) {
        this.setState({
            chartType: event.target.value,
        });
        this.initHasby(event.target.value);
    }

    changeModelType(event) {
        let chart = Object.assign({},this.state.chart) ;
        chart.meta.modelType = event.target.value;
        /*this.setState({
            modelType: event.target.value,
        });*/
        this.setState({
            chart:chart,
        });
    }


    render() {

        /*
            points

                    active
                    aggregator
                    chartName
                    color
                    metric
                    name
                    value
                    x
                    y
        <RadioButton value="events">事件流</RadioButton>
        
        <RadioButton value="icon">图标</RadioButton>
        
         */
        let panelNormal = null;

        console.log(this.state.chart.meta.modelType);
        if (this.state.chartType == "events") {
            panelNormal = this.genBucket();
        } else {
            panelNormal = this.state.chart.meta.modelType === 'normal' ? this.genMetricPanelNormal() : this.genProModel();
        }

        return < Modal
            title={this.state.metrics ? "编辑图表" : "添加图表"}
            wrapClassName="vertical-center-modal"
            visible={true}
            onOk={() => this.props.showDialog(false)
            }
            onCancel={() => this.props.showDialog(false)}
            width={960}
            className="dialog"
            style={{ top: 20 }}
            footer={null}
            >

            <Row style={{ paddingTop: 25, }}></Row>

            <CustomCharts
                chart={this.state.chart}
                metrics={this.state.metrics}
                type={this.state.chartType}
                ref="chart_heatmap"
                domProps={{ style: { height: 160, width: 928 }, }} />

            <RadioGroup onChange={this.changeChartType.bind(this)} defaultValue={this.state.chartType} size="large">
                
                <RadioButton value="heatmap">热力图</RadioButton>
                
                <RadioButton value="pie">饼图</RadioButton>

                <RadioButton value="area">状态值</RadioButton>
                <RadioButton value="table">表格</RadioButton>
                <RadioButton value="line">时间序列</RadioButton>
                <RadioButton value="bar">TopN</RadioButton>

                <RadioButton value="treemap">树状图</RadioButton>
            </RadioGroup>



            <Row style={{ padding: 10, paddingLeft: 0 }}>选择和编辑指标</Row>

            {this.state.chartType == "events" ? null : <RadioGroup onChange={this.changeModelType.bind(this)} defaultValue={this.state.chart.meta.modelType} size="large">
                <RadioButton value="normal">普通模式</RadioButton>
                <RadioButton value="pro">专家模式</RadioButton>
            </RadioGroup>
            }

            {panelNormal}

            <Row style={{ backgroundColor: '#f1f1f1', height: 60, padding: 20 }}>
                <Col span={20}><Input ref="title" onChange={this.onChangeTitle.bind(this)} defaultValue={this.state.name} addonBefore="图表命名" /></Col>
                <Col span={4}>
                    <Button onClick={() => this.saveSetting()} type="primary" style={{ width: 86, height: 40, position: 'absolute', right: 0, top: -10 }} >保存</Button>
                </Col>
            </Row>

        </Modal >;
    }
}

function mapStateToProps(state) {
    const { allMetrics } = state;
    return {
        allMetrics,
    };
}

// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch) {
    // bindActionCreators(ActionCreators, dispatch)
    return {
        fetchNormal: (params) => dispatch(fetchNormal(params))
    };
}

// Which action creators does it want to receive by props?
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(DialogChartSetting);
