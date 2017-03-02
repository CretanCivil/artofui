import React from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col, Select, Icon, } from 'antd';
import $ from 'jquery';
import NormalSelectEditor from './NormalSelectEditor';
const Option = Select.Option;

// React.Component
class ChartsDetailSetting extends React.Component {
    normalModelMap = new Map();

    static propTypes = {
        fetchMetric: React.PropTypes.func,
        metric: React.PropTypes.any
    };

    constructor(props) {
        super(props);

        this.state = {
            show: false,
            indexBox: [0, 0, 0],
            tags: [],
            host: [],
            by: [],
            agg: null,
        };
    }

    componentWillReceiveProps(nextProps) {

        if (!nextProps.normalModel.isFetching && nextProps.normalModel.data.length > 0) {
            for (let item of nextProps.normalModel.data) {
                for (let item2 of Object.values(item)) {
                    for (let item3 of item2) {
                        for (let item4 of Object.values(item3)) {
                            for (let item5 of item4) {
                                for (let item6 of Object.values(item5)) {
                                    this.normalModelMap.set(item6.metric_name, [nextProps.normalModel.data.indexOf(item), item2.indexOf(item3), item4.indexOf(item5)]);
                                }
                            }
                        }
                    }
                }
            }
            this.setState({
                indexBox: this.normalModelMap.get(this.state.metricName),
            });
        }

        if (!nextProps.allMetrics.isFetching && nextProps.allMetrics.data.length > 0) {
            for (let element of nextProps.allMetrics.data) {
                if (element.metric == this.state.metricName) {
                    this.setState({
                        tags: element.tags,
                    });
                    break;
                }
            }
        }
    }

    componentWillMount() {
        let tags = [];
        if (this.props.metric.tags != null) {
            tags = this.props.metric.tags.map(function(item) {
                return item.replace("=", ":")
            });
        }

        this.setState({
            metricName: this.props.metric.metric,
            host: tags,
            by: this.props.metric.by,
            agg: this.props.metric.aggregator,
        });
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

    changeHost(val) {
        this.props.metric.tags = val.map(function(item) {
            return item.replace(":", "=")
        });

        this.setState({
            host: val,
        });

        this.props.passData(Object.assign({}, this.state, {
            host: val,
        }));
    }

    changeBy(val) {
        this.setState({
            by: val,
        });
        this.props.passData(Object.assign({}, this.state, {
            by: val,
        }));
    }

    changeAgg(val) {
        this.setState({
            agg: val,
        });
        this.props.passData(Object.assign({}, this.state, {
            agg: val,
        }));
    }

    setMetrics(metric_name, path) {
        this.setState({
            indexBox: path,
            metricName: metric_name,
            tags: [],
            host: [],
            by: [],
        });

        for (let element of this.props.allMetrics.data) {
            if (element.metric == metric_name) {
                this.setState({
                    tags: element.tags,
                });
                break;
            }
        }

        this.props.passData(Object.assign({}, this.state, {
            indexBox: path,
            metricName: metric_name,
            tags: [],
            host: [],
            by: [],
        }));
    }

    render() {

        let optionsHost = [];

        for (let tag in this.state.tags) {
            let option = <Select.Option key={tag} value={this.state.tags[tag]}>{this.state.tags[tag]}</Select.Option>
            optionsHost.push(option);
        }

        let optionsBy = [];
        let bySet = new Set();
        for (let tag in this.state.tags) {
            bySet.add(this.state.tags[tag].split(':')[0]);
        }
        for (let tag of bySet) {
            let option = <Select.Option key={tag} value={tag}>{tag}</Select.Option>
            optionsBy.push(option);
        }

        return <div style={{ marginTop:10}}>
            <Row type="flex" justify="space-between">
                <Col>
                    <label className="pre">选择性能指标</label>
                    <Button id="normalselect" style={{ minWidth: 155 }}
                        onClick={() => this.showBox()} type="ghost">
                        {this.state.metricName}
                        <Icon type={this.state.show ? "up" : "down"} />
                    </Button>

                    <NormalSelectEditor
                        indexBox={this.state.indexBox}
                        metricName={this.state.metricName}
                        show={this.state.show}
                        setMetrics={this.setMetrics.bind(this)}
                        closeBox={() => this.closeBox()} />
                </Col>
                <Col>
                    <Button icon="delete" style={{
                        color: 'white',
                        marginRight: 15,
                        backgroundColor: '#d9534f',
                        borderColor: '#d9534f',
                        display:'none',
                    }} onClick={() => this.showDialog(true)} />
                </Col>
            </Row>

            <Row style={{ marginTop: 5 }}>
                <Col span={8}>
                    <label className="pre">添加数据来源</label>
                    <Select multiple
                        onChange={(val) => this.changeHost(val)}
                        defaultValue={this.state.host ? this.state.host : []}
                        value={this.state.host ? this.state.host : []}
                        showSearch
                        placeholder="全部主机"
                        style={{ width: 214, }} size="large">
                        {optionsHost}
                    </Select>
                </Col>
                {this.props.hasby ? <Col span={8}>
                    <label className="pre">将数据按如下条件分组</label>
                    <Select multiple
                        onChange={(val) => this.changeBy(val)}
                        style={{ width: 160, }}
                        defaultValue={this.state.by ? this.state.by : []} 
                        value={this.state.by ? this.state.by : []}
                        size="large">
                        {optionsBy}
                    </Select>
                </Col> : null}
                <Col>
                    <label className="pre">求该组主机的</label>
                    <Select style={{ width: 200, }}
                        onChange={(val) => this.changeAgg(val)}
                        defaultValue={this.state.agg} 
                        value={this.state.agg}
                        size="large">
                        <Option key="1" value="avg">平均值</Option>
                        <Option key="2" value="min">最小值</Option>
                        <Option key="3" value="max">最大值</Option>
                        <Option key="4" value="sum">求和</Option>
                    </Select>
                </Col>
            </Row>
        </div>;
    }
}


/*
别删 别删 别删 
//
获取connect后的对象 refs.chart.getWrappedInstance()
*/
// Which part of the Redux global state does our component want to receive as props?
function mapStateToProps(state) {
    const { allMetrics, normalModel } = state;
    return {
        allMetrics,
        normalModel
    };
}

// Which action creators does it want to receive by props?



export default connect(
    mapStateToProps,
)(ChartsDetailSetting);
