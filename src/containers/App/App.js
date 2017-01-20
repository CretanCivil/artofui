import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Login from './../Login/Login';
import { Link } from 'react-router';

import './boot.scss';
import './daterangepicker.css';
import './ali.css';
import './diyselect.css';
import './App.scss';
import { Menu, Breadcrumb, Icon, Modal, Row, Col, Input, Button, Select, Tabs, Spin, Table, Checkbox } from 'antd';

import ReactHighcharts from 'react-highcharts';
import highchartsTreemap from 'highcharts-treemap';

const Option = Select.Option;
const TabPane = Tabs.TabPane;

highchartsTreemap(ReactHighcharts.Highcharts);

const SubMenu = Menu.SubMenu;
class App extends Component {
  static propTypes = {
    children: PropTypes.element,
    isAuthenticated: React.PropTypes.bool,
    routing: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.renderAuthenticatedPage = this.renderAuthenticatedPage.bind(this);

    this.state = {
      collapse: false
    };
  }

  componentDidMount() {
  }



  renderAuthenticatedPage() {
    return (
      <div className="ant-layout-aside">
        <aside className="ant-layout-sider" >
          <div className="ant-layout-logo"/>
          <Menu mode="inline" theme="dark"
            defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']}>
            <SubMenu key="sub1" title={<span><Icon type="user" />用户管理</span>}>
              <Menu.Item key="1">
                <Link to={'/users'}>
                  用户列表
                </Link>
              </Menu.Item>
              <Menu.Item key="2">角色配置</Menu.Item>
              <Menu.Item key="3">
                <Link to={'/charts'}>
                  图表测试
                </Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </aside>
        <div className="ant-layout-main" >
          <div className="ant-layout-header" />
          <div className="ant-layout-breadcrumb">
            <Breadcrumb>
              <Breadcrumb.Item>首页</Breadcrumb.Item>
              <Breadcrumb.Item>用户管理</Breadcrumb.Item>
              <Breadcrumb.Item>用户列表</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="ant-layout-container">
            <div className="ant-layout-content">
              <div>
                {this.props.children}
              </div>
            </div>
          </div>
          <div className="ant-layout-footer">
            Ant Design & reactjs & redux & oneapm.com
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { isAuthenticated } = this.props;
    return (
      <div>
        {isAuthenticated ? this.renderAuthenticatedPage() : <Login/>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { routing, auth: { isAuthenticated, }, user, dashboard } = state;
  return {
    isAuthenticated, user, routing, dashboard
  };
}

export default connect(mapStateToProps)(App);
