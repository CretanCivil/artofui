import ReactHighcharts from 'react-highcharts';
import React from 'react';
import { PropTypes } from 'react';
import { fetchMetric } from './../actions/metric';
import { connect } from 'react-redux';
import {  Button, Row, Col, Select, Form, Icon, Modal, Tabs, Spin, Table, Checkbox, Input } from 'antd';
import NormalSelectEditor from './NormalSelectEditor';
import $ from 'jquery';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import CustomCharts from './CustomCharts';
import PieCharts from './PieCharts';
import TreeMapCharts from './TreeMapCharts';
import ChartsHeatMap from './ChartsHeatMap';
import ChartsTopN from './ChartsTopN';
import ChartsTable from './ChartsTable';
import ChartsArea from './ChartsArea';


// React.Component
class DialogChartSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            indexBox: [],
            metricName: "",
            tags: [],
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
            metricName: metric_name,
            tags: [],
        });


        for (let element of this.props.allMetrics.data) {
            if (element.metric == metric_name) {
                this.setState({
                    tags: element.tags,
                });
                return;
            }
        }


    }

    changeHost(val) {
        console.log(val, this.state.tags[val]);
    }

    render() {

        let options = [];
        for (let tag in this.state.tags) {
            let option = <Select.Option key={tag} value={this.state.tags[tag]}>{this.state.tags[tag]}</Select.Option>
            options.push(option);
        }

        return < Modal
            title = {this.props.metrics ? "编辑图表":"添加图表"}
            wrapClassName = "vertical-center-modal"
            visible = {true}
            onOk = {() => this.props.showDialog(false)
            }
            onCancel = {() => this.props.showDialog(false) }
            width = { 960}
            className = "dialog"
            style = {{ top: 20 }}
            footer = { null}
            >

            <Row style={{ paddingTop: 25, }}></Row>
            <Tabs tabPosition="bottom">
                <TabPane tab="事件流" key="1">
                    <div className="example">
                        <Spin/>
                    </div>
                </TabPane>
                <TabPane tab="热力图" key="2">
                    <div className="example">
                        <ChartsHeatMap
                            metrics={this.props.metrics}
                            type="heatmap"
                            ref="chart_heatmap"
                            domProps={{ style: { height: 160, width: 928 }, }} />

                    </div>
                </TabPane>
                <TabPane tab="图标" key="3">
                    <div className="example">
                        <Spin width={100}/>
                    </div>
                </TabPane>
                <TabPane tab="饼图" key="4">
                    <div className="example">
                        <PieCharts
                            metrics={this.props.metrics}
                            type="pie"
                            ref="chart"
                            domProps={{ style: { height: 160, width: 928 }, }} />
                    </div>
                </TabPane>
                <TabPane tab="状态值" key="5">
                    <div className="example">
                        <ChartsArea
                            metrics={this.props.metrics}
                            type="area"
                            ref="chart_area"
                            domProps={{ style: { height: 160, width: 928 }, }} />
                    </div>
                </TabPane>

                <TabPane tab="表格" key="6">
                    <div className="example" style={{ marginTop: -15, height: 175 }}>
                        <ChartsTable
                            metrics={this.props.metrics}
                            type="area"  />
                    </div>
                </TabPane>
                <TabPane tab="时间序列" key="7">
                    <div className="example">
                        <CustomCharts
                            metrics={this.props.metrics}
                            type="spline"
                            ref="chart_line"
                            domProps={{ style: { height: 160, width: 928 }, }} />
                    </div>
                </TabPane>
                <TabPane tab="TopN" key="8">
                    <div className="example">
                        <ChartsTopN
                            metrics={this.props.metrics}
                            type="bar"
                            ref="chart_bar"
                            domProps={{ style: { height: 160, width: 928 }, }} />
                    </div>
                </TabPane>
                <TabPane tab="树状图" key="9">
                    <div className="example">
                        <TreeMapCharts
                            metrics={this.props.metrics}
                            type="treemap"
                            ref="chart_tree"
                            domProps={{ style: { height: 160, width: 928 }, }} />
                    </div>
                </TabPane>

            </Tabs>

            <Row style={{ padding: 10, paddingLeft: 0 }}>选择和编辑指标</Row>
            <Tabs className="dialog proTab">
                <TabPane  tab="普通模式" key="1">
                    <div style={{ marginLeft: 20, paddingBottom: 20 }}>
                        <Row>
                            <Col  >
                                <label className="pre">选择性能指标</label>
                                <Button id="normalselect" style={{ minWidth: 155 }}
                                    onClick={() => this.showBox() } type="ghost">
                                    {this.state.metricName}
                                    <Icon type={this.state.show ? "up" : "down"} />
                                </Button>


                                <NormalSelectEditor
                                    indexBox={this.state.indexBox}
                                    show={this.state.show}
                                    setMetrics={this.setMetrics.bind(this) }
                                    closeBox={() => this.closeBox() }/>


                            </Col>
                        </Row>

                        <Row style={{ marginTop: 5 }}>
                            <Col  span={8}>
                                <label className="pre">添加数据来源</label>
                                <Select multiple onChange={(val) => this.changeHost(val) } placeholder="全部主机" style={{ width: 200, }} size="large">
                                    {options}
                                </Select>
                            </Col>
                            <Col  >
                                <label className="pre">求该组主机的</label>
                                <Select style={{ width: 200, }} size="large">
                                    <Option key="1" value="avg">平均值</Option>
                                    <Option key="2" value="min">最小值</Option>
                                    <Option key="3" value="max">最大值</Option>
                                    <Option key="4" value="count">求和</Option>
                                </Select>
                            </Col>


                        </Row>

                    </div>
                </TabPane>
                <TabPane tab="专家模式" key="2">
                    <div style={{ marginLeft: 20, paddingBottom: 20 }}>
                        <Row  type="flex" justify="start">
                            <Col  span={5}>
                                <label className="pre">Get</label>
                                <Select style={{ width: 150, }} size="large">
                                    <Option key="1" value="1">lucy</Option>
                                    <Option key="2" value="2">lucy</Option>
                                </Select>
                            </Col>
                            <Col span={5}>
                                <label className="pre" style={{ paddingLeft: 3 }}>From</label>
                                <Select style={{ width: 150, }} size="large">
                                    <Option key="1" value="1">平均值</Option>
                                    <Option key="2" value="2">最小值</Option>
                                    <Option key="3" value="3">最大值</Option>
                                    <Option key="4" value="4">求和</Option>
                                </Select>
                            </Col>
                            <Col  span={6}>
                                <label className="pre">Rate<Checkbox style={{ paddingLeft: 20 }}></Checkbox></label>
                                <Select style={{ width: 150, }} size="large">
                                    <Option key="1" value="1">平均值</Option>
                                    <Option key="2" value="2">最小值</Option>
                                    <Option key="3" value="3">最大值</Option>
                                    <Option key="4" value="4">求和</Option>
                                </Select>
                            </Col>
                            <Col span={5}>
                                <label className="pre">By</label>
                                <Select style={{ width: 150, }} size="large">
                                    <Option key="1" value="1">平均值</Option>
                                    <Option key="2" value="2">最小值</Option>
                                    <Option key="3" value="3">最大值</Option>
                                    <Option key="4" value="4">求和</Option>
                                </Select>
                            </Col>

                        </Row>

                    </div>
                </TabPane>


            </Tabs>

            <Row style={{ backgroundColor: '#f1f1f1', height: 60, padding: 20 }}>
                <Col span={20}><Input  addonBefore="图表命名"/></Col>
                <Col span={4}>
                    <Button  onClick={() => this.showDialog(false) } type="primary" style={{ width: 86, height: 40, position: 'absolute', right: 0, top: -10 }} >保存</Button>
                </Col>
            </Row>

        </Modal >;
    }
}

function mapStateToProps(state) {
    const { allMetrics } = state;
    return {
        allMetrics
    };
}

// Which action creators does it want to receive by props?
export default connect(
    mapStateToProps,
)(DialogChartSetting);
