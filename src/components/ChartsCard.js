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
import PubSub from 'vanilla-pubsub';
import { retryFetch, toQueryString } from '../utils/cFetch'
import { API_CONFIG } from '../config/api';

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

    deleteChart() {
        const confirm = Modal.confirm;

        confirm({
            title: '删除仪表盘图表?',
            content: `确认要删除  ${this.props.chart.name} 这个图表?`,
            onOk:this.doDeleteChart.bind(this),
            /*return new Promise((resolve, reject) => {
                setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
            }).catch(() => console.log('Oops errors!'));*/
              
            onCancel() {},
        });
    }

    doDeleteChart() {
        // `User ${user.name} is not authorized to do ${action}.`);
        //1484923220972
        //https://cloud.oneapm.com/v1/dashboards/11997/charts/add.json
        //https://cloud.oneapm.com/v1/dashboards/11997/charts/1361641/delete.json
        let url = `/p1/dashboards/${this.props.chart.dashboard_id}/charts/${this.props.chart.id}/delete.json`;

        retryFetch(url, {
            method: "POST",
            retries: 3,
            retryDelay: 10000,
            params: {
                api_key:API_CONFIG.apiKey
            },
            body: ''
        }).then(function (response) {
            return response.json();
        }).then((json) => {
            //this.props.showDialog(false);
            console.log("json", json);

            PubSub.publish('App.dashboard.refresh');
        });
    }

    addChart() {
        let layout = this.props.chart;
        // `User ${user.name} is not authorized to do ${action}.`);
        //1484923220972
        //https://cloud.oneapm.com/v1/dashboards/11997/charts/add.json

        let url = `/p1/dashboards/${this.props.chart.dashboard_id}/charts/add.json`;

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
            //this.props.showDialog(false);
            console.log("json", json);

            PubSub.publish('App.dashboard.refresh');
        });
    }


    menuClick(item) {
        // message.info('Click on menu item.');
        console.log('click', item);
        switch(item.key) {
            case "copy":
                this.addChart();
                break;
             case "delete":
                this.deleteChart();
                break;   
        }
    }

    componentDidMount() {

    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props.chart.name != nextProps.chart.name || JSON.stringify(this.props.chart) != JSON.stringify(nextProps.chart))
            return true;

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
            <Menu onClick={this.menuClick.bind(this)}>
                <Menu.Item key="delete">删除图表</Menu.Item>
                <Menu.Item key="copy">创建副本</Menu.Item>
                <Menu.Item key="share">分享图表</Menu.Item>
            </Menu>
        );

        let extra = null;

        if(!this.props.readonly) {
            extra = <Row>
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
                </Row>;
        }

        return <Measure style={{ height: '100%' }} onMeasure={this.onMeasure.bind(this)}><VisibilitySensor intervalDelay={500} partialVisibility={true} onChange={this.onChangeVisible.bind(this)}>
        <Card title={this.props.chart.name}
            className="chart"
            style={{ height: '100%' }}
            extra={
                extra
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