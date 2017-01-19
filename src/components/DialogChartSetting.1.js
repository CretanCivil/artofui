import React from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col, Select,  Modal, Tabs, Spin, Checkbox, Input } from 'antd';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
import CustomCharts from './CustomCharts';
import PieCharts from './PieCharts';
import TreeMapCharts from './TreeMapCharts';
import ChartsHeatMap from './ChartsHeatMap';
import ChartsTopN from './ChartsTopN';
import ChartsTable from './ChartsTable';
import ChartsArea from './ChartsArea';
import ChartsDetailSetting from './ChartsDetailSetting';

// React.Component
class DialogChartSetting extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            metrics: null,
        };
    }

  componentWillMount() {

      this.setState({
          metrics: Array.from(this.props.metrics),
      });
    }

 
    genMetricPanelNormal() {



        let panels = this.state.metrics.map(function (item,index) {
          
            return <ChartsDetailSetting key={index} metric={item}/>
                 
        }, this);

        return panels;

    }

    render() {
  


        let panelNormal = this.genMetricPanelNormal();

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
            <Tabs tabPosition="bottom">
                <TabPane tab="事件流" key="1">
                    <div className="example">
                        <Spin />
                    </div>
                </TabPane>
                <TabPane tab="热力图" key="2">
                    <div className="example">
                        <ChartsHeatMap
                            metrics={this.state.metrics}
                            type="heatmap"
                            ref="chart_heatmap"
                            domProps={{ style: { height: 160, width: 928 }, }} />

                    </div>
                </TabPane>
                <TabPane tab="图标" key="3">
                    <div className="example">
                        <Spin width={100} />
                    </div>
                </TabPane>
                <TabPane tab="饼图" key="4">
                    <div className="example">
                        <PieCharts
                            metrics={this.state.metrics}
                            type="pie"
                            ref="chart"
                            domProps={{ style: { height: 160, width: 928 }, }} />
                    </div>
                </TabPane>
                <TabPane tab="状态值" key="5">
                    <div className="example">
                        <ChartsArea
                            metrics={this.state.metrics}
                            type="area"
                            ref="chart_area"
                            domProps={{ style: { height: 160, width: 928 }, }} />
                    </div>
                </TabPane>

                <TabPane tab="表格" key="6">
                    <div className="example" style={{ marginTop: -15, height: 175 }}>
                        <ChartsTable
                            metrics={this.state.metrics}
                            type="area" />
                    </div>
                </TabPane>
                <TabPane tab="时间序列" key="7">
                    <div className="example">
                        <CustomCharts
                            metrics={this.state.metrics}
                            type="spline"
                            ref="chart_line"
                            domProps={{ style: { height: 160, width: 928 }, }} />
                    </div>
                </TabPane>
                <TabPane tab="TopN" key="8">
                    <div className="example">
                        <ChartsTopN
                            metrics={this.state.metrics}
                            type="bar"
                            ref="chart_bar"
                            domProps={{ style: { height: 160, width: 928 }, }} />
                    </div>
                </TabPane>
                <TabPane tab="树状图" key="9">
                    <div className="example">
                        <TreeMapCharts
                            metrics={this.state.metrics}
                            type="treemap"
                            ref="chart_tree"
                            domProps={{ style: { height: 160, width: 928 }, }} />
                    </div>
                </TabPane>

            </Tabs>

            <Row style={{ padding: 10, paddingLeft: 0 }}>选择和编辑指标</Row>
            <Tabs className="dialog proTab">
                <TabPane tab="普通模式" key="1">


                    {panelNormal}

                </TabPane>
                <TabPane tab="专家模式" key="2">
                    <div style={{ marginLeft: 20, paddingBottom: 20 }}>
                        <Row type="flex" justify="start">
                            <Col span={5}>
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
                            <Col span={6}>
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
                <Col span={20}><Input addonBefore="图表命名" /></Col>
                <Col span={4}>
                    <Button onClick={() => this.showDialog(false)} type="primary" style={{ width: 86, height: 40, position: 'absolute', right: 0, top: -10 }} >保存</Button>
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
export default connect(
    mapStateToProps,
)(DialogChartSetting);
