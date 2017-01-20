import React from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col, Select, Icon, Checkbox } from 'antd';
import $ from 'jquery';
import NormalSelectEditor from './NormalSelectEditor';
const Option = Select.Option;

// React.Component
class ChartsModelTypeSettingPro extends React.Component {
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
            rate: false,
        };
    }

    componentWillReceiveProps(nextProps) {

        if (!nextProps.normalModel.isFetching && nextProps.normalModel.data.length > 0) {
            this.initModelMap(nextProps.normalModel);
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

    initModelMap(normalModel) {
        for (let item of normalModel.data) {
            for (let item2 of Object.values(item)) {
                for (let item3 of item2) {
                    for (let item4 of Object.values(item3)) {
                        for (let item5 of item4) {
                            for (let item6 of Object.values(item5)) {
                                this.normalModelMap.set(item6.metric_name, [normalModel.data.indexOf(item), item2.indexOf(item3), item4.indexOf(item5)]);
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

    componentWillMount() {
        this.initModelMap(this.props.normalModel);
        let tags = [];
        if (this.props.metric.tags != null) {
            tags = this.props.metric.tags.map(function (item) {
                return item.replace("=", ":")
            });
        }

        let rate = false;

        if (this.props.metric.rate) {
            rate = true;
        }

        this.setState({
            metricName: this.props.metric.metric,
            host: tags,
            by: this.props.metric.by,
            agg: this.props.metric.aggregator,
            rate: rate,
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
        this.props.metric.tags = val.map(function (item) {
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

    changeMetric(val) {
        let path = this.normalModelMap.get(val);
        this.setMetrics(val, path);
    }

    changeRate(e) {
        this.setState({
            rate: e.target.checked,
        });

        if (e.target.checked) {
            this.props.passData(Object.assign({}, this.state, {
                rate: true,
            }));
        } else {
            this.props.passData(Object.assign({}, this.state, {
                rate: false,
            }));
        }

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

        let optionMetrics = [];

        for (let metric of this.normalModelMap.keys()) {
            let option = <Select.Option key={metric} value={metric}>{metric}</Select.Option>
            optionMetrics.push(option);
        }

        return <div style={{ marginTop: 10 }}>
            <Row type="flex" justify="start">
                <Col  >
                    <label className="pre">Get</label>
                    <Select
                        showSearch
                        value={this.state.metricName}
                        onChange={(val) => this.changeMetric(val)}
                        dropdownMatchSelectWidth={false}
                        style={{ minWidth: 150, }}
                        size="large">
                        {optionMetrics}
                    </Select>
                </Col>
                <Col  >
                    <label className="pre" style={{ paddingLeft: 3 }}>From</label>
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
                <Col >
                    <label className="pre">Rate<Checkbox checked={this.state.rate} onChange={this.changeRate.bind(this)} style={{ paddingLeft: 20 }}></Checkbox></label>
                    <Select style={{ width: 100, }}
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
                {this.props.hasby ? <Col  >
                    <label className="pre">by</label>
                    <Select multiple
                        onChange={(val) => this.changeBy(val)}
                        style={{ width: 160, }}
                        defaultValue={this.state.by ? this.state.by : []}
                        value={this.state.by ? this.state.by : []}
                        size="large">
                        {optionsBy}
                    </Select>
                </Col> : null}



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
)(ChartsModelTypeSettingPro);
