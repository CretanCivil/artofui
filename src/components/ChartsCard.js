import ReactHighcharts from 'react-highcharts';
import React from 'react';
import { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col, Select, Form, Icon, Card, Modal, Dropdown, Menu } from 'antd';
import CustomCharts from './CustomCharts';
import ReactDOM from 'react-dom';
import Dimensions from 'react-dimensions';
import Measure from 'react-measure';
import VisibilitySensor from 'react-visibility-sensor';

// React.Component
class ChartsCard extends React.Component {
    static propTypes = {
    };

    constructor(props) {
        super(props);
        this.state = {
            dimensions: {
                width: -1,
                height: -1
            },
        }
    }

    clickSetting() {
        // this.refs.chart.getWrappedInstance().getChart().showLoading();
        this.props.setting(true, this.props.chart.metrics, this.props.chart.type, this.props.chart);
    }

    menuClick(item, key, keyPath) {
        // message.info('Click on menu item.');
        console.log('click', item, key, keyPath);
    }

    componentDidMount() {

    }

    shouldComponentUpdate(nextProps, nextState) {

        return false;
    }

    onMeasure(dimensions) {
        //  this.setState({ dimensions: dimensions });
        // console.log(this.refs.chart);
        if (this.refs.chart && this.refs.chart.getChart()) {
            this.refs.chart.getChart().setSize(dimensions.width, dimensions.height - 48);
            // this.refs.chart.getChart().reflow();
            //  this.refs.chart.getChart().redraw();
        }

    }

    onChangeVisible(isVisible) {
        // this.setState({
        //     isVisible: isVisible,
        //  });
        //  return;
       // console.log(p2);
        if (isVisible && this.refs.chart) {
            this.refs.chart.reloadData();
            // this.refs.chart.getChart().reflow();
            //  this.refs.chart.getChart().redraw();
        }

    }

    render() {
        let key = "key" + this.props.id;

        console.log("ChartsLine");
        let series = [];



        let domProps = Object.assign({}, this.props.domProps, {
            style: { height: '100%' },
        });

        const menu = (
            <Menu onClick={() => this.menuClick()}>
                <Menu.Item key="delete">删除</Menu.Item>
                <Menu.Item key="copy">创建副本</Menu.Item>
                <Menu.Item key="share">分享图表</Menu.Item>
            </Menu>
        );

        return <Measure style={{ height: '100%' }} onMeasure={this.onMeasure.bind(this)}><VisibilitySensor intervalDelay={500} partialVisibility={true} onChange={this.onChangeVisible.bind(this)}><Card title={this.props.chart.name}
            className="chart"
            style={{ height: '100%' }}
            extra={
                <Row>
                    <Col span="7" offset="1">
                        <Button icon="arrows-alt" size="small" onClick={() => this.props.expand(true, this.props.chart)} />
                    </Col>
                    <Col span="7" offset="1">
                        <Button icon="edit" size="small" onClick={this.clickSetting.bind(this)} />
                    </Col>


                    <Col span="7" offset="1">
                        <Dropdown overlay={menu} trigger={['click']}>
                            <Button icon="setting" size="small" />
                        </Dropdown>
                    </Col>
                </Row>
            }
            bordered={false} >
            <CustomCharts
                chart={this.props.chart}
                metrics={this.props.chart.metrics}
                type={this.props.chart.type == 'timeseries' ? 'line' : this.props.chart.type}
                ref="chart"
                domProps={domProps} />
        </Card></VisibilitySensor></Measure>;
    }
}

ChartsCard.childContextTypes = {
    domProps: PropTypes.any,
    chartSelection: PropTypes.func
};

export default Dimensions()(ChartsCard);