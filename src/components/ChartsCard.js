import ReactHighcharts from 'react-highcharts';
import React from 'react';
import { PropTypes } from 'react';
import { connect } from 'react-redux';
import {  Button, Row, Col, Select, Form, Icon, Card, Modal, Dropdown, Menu } from 'antd';
import CustomCharts from './CustomCharts';


// React.Component
export default class ChartsCard extends React.Component {
    static propTypes = {
       
    };

    constructor(props) {
        super(props);
    }



    clickSetting() {
       // this.refs.chart.getWrappedInstance().getChart().showLoading();
       this.props.setting(true,this.props.chart.metrics,this.props.chart.type);
    }

    menuClick(e) {
        message.info('Click on menu item.');
        console.log('click', e);
    }

 
    render() {

        let key = "key" + this.props.id;


        let series = [];



        let domProps = Object.assign({}, this.props.domProps, {
            style: { height: 310, width: 340 },
        });

        const menu = (
            <Menu onClick={() => this.menuClick() }>
                <Menu.Item key="1">1st menu item</Menu.Item>
                <Menu.Item key="2">2nd menu item</Menu.Item>
                <Menu.Item key="3">3d menu item</Menu.Item>
            </Menu>
        );

        const tabledata = [{
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',

        }, {
                key: '2',
                name: 'Jim Green',
                age: 42,
                address: 'London No. 1 Lake Park',
            }, {
                key: '3',
                name: 'Joe Black',
                age: 32,
                address: 'Sidney No. 1 Lake Park',
            }];

        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            width: 150,

            render: (value, row, index) => <Icon  type="appstore"
                style={{ color: APP_CONFIG.colors[index], fontSize: 20 }}></Icon>
        }, {
                title: 'Age',
                dataIndex: 'age',
                width: 150,
            }, {
                title: 'Address',
                dataIndex: 'address',
                width: 150,
            }];

        return <div style={{ float: "left", marginLeft: 10, marginTop: 10, maxWidth: 340, }}  >
            <Card title={this.props.chart.name} className="chart" extra={<Row>
                <Col span="7" offset="1">
                    <Button icon="arrows-alt" size="small" onClick={() => this.props.expand(true,this.props.chart) }/>
                </Col>
                <Col span="7" offset="1">
                    <Button icon="edit" size="small" onClick={this.clickSetting.bind(this) }/>
                </Col>


                <Col span="7" offset="1">
                    <Dropdown  overlay={menu} trigger={['click']}>
                        <Button icon="setting" size="small" />
                    </Dropdown>
                </Col>
            </Row>} bordered={false} >
                <CustomCharts
                    metrics={this.props.chart.metrics} type="line" ref="chart" domProps={domProps} />
            </Card>

            

        </div>;
    }
}

ChartsCard.childContextTypes = {
    domProps: PropTypes.any,
    chartSelection: PropTypes.func
};

