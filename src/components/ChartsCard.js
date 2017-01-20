import ReactHighcharts from 'react-highcharts';
import React from 'react';
import { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, Row, Col, Select, Form, Icon, Card, Modal, Dropdown, Menu } from 'antd';
import CustomCharts from './CustomCharts';
import ReactDOM from 'react-dom';
import Dimensions from 'react-dimensions';
import Measure from 'react-measure';

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
            }
        }
    }

    clickSetting() {
        // this.refs.chart.getWrappedInstance().getChart().showLoading();
        this.props.setting(true, this.props.chart.metrics, this.props.chart.type);
    }

    menuClick(e) {
        message.info('Click on menu item.');
        console.log('click', e);
    }

    componentDidMount() {

    }

    onMeasure(dimensions) {
        this.setState({ dimensions: dimensions });
        console.log(this.refs.chart);
       // if (this.refs.chart && this.refs.chart.getChart()) {
        //    this.refs.chart.getChart().reflow();
        //    this.refs.chart.getChart().redraw();
       // }

    }

    render() {
        let key = "key" + this.props.id;

        let series = [];

       

        let domProps = Object.assign({}, this.props.domProps, {
             style: {  height: this.props.containerHeight - 48 },
        });

        const menu = (
            <Menu onClick={() => this.menuClick()}>
                <Menu.Item key="1">1st menu item</Menu.Item>
                <Menu.Item key="2">2nd menu item</Menu.Item>
                <Menu.Item key="3">3d menu item</Menu.Item>
            </Menu>
        );
//<Measure style={{ height: '100%' }} onMeasure={this.onMeasure.bind(this)}>
        return  <Card title={this.props.chart.name}
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
                    metrics={this.props.chart.metrics}
                    type={this.props.chart.type == 'timeseries' ? 'line' : this.props.chart.type}
                    ref="chart"
                    domProps={domProps} />
            </Card>;
    }
}

ChartsCard.childContextTypes = {
    domProps: PropTypes.any,
    chartSelection: PropTypes.func
};

export default Dimensions()(ChartsCard);