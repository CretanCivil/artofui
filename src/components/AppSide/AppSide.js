import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';
import { Menu, Icon } from 'antd';
import './AppSide.scss';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class AppSide extends Component {
  state = {
    current: '',
    openKeys: [],
  }

  handleClick = (e) => {
    //console.log('Clicked: ', e);
    let tempState = {current: e.key};
    if(e.keyPath.length == 1) {
      tempState.openKeys = [];
    }
    this.setState(tempState);
  }

  onOpenChange = (openKeys) => {this.setState({current: null});
    const state = this.state;
    const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
    const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    this.setState({ openKeys: nextOpenKeys });
  }

  getAncestorKeys = (key) => {
    const map = {
      sub3: ['sub2'],
    };
    return map[key] || [];
  }

  render() {
    //暂时使用a跳转，之后要用Link
    return (
      <div>
        <a href="/apmsys" className="app-side-title"><img src={require('./logo.png')} alt="logo" width="32" height="32" /><span>PAAS INSIGHT</span></a>
        <Menu mode="inline"
              openKeys={this.state.openKeys}
              selectedKeys={[this.state.current]}
              onOpenChange={this.onOpenChange}
              onClick={this.handleClick}
        >
          <MenuItemGroup title="主要">
            <Menu.Item key="1" className="b-success"><a href="/apmsys"><i className="ion-android-apps"></i><b>平台列表</b></a></Menu.Item>
            <SubMenu key="2" className="b-event" title={<span><i className="ion-speedometer"></i><b>仪表盘</b></span>}>
              <Menu.Item key="21"><a href="/apmsys/dashboardList"><b>自定义仪表盘</b></a></Menu.Item>
              <Menu.Item key="22"><a href="/apmsys/platformList"><b>平台仪表盘</b></a></Menu.Item>
              <Menu.Item key="23"><a href="/apmsys/collectDashBoardList"><b>已收藏的仪表盘</b></a></Menu.Item>
            </SubMenu>
            <Menu.Item key="3" className="b-event"><a href="/apmsys/eventflowList"><i className="ion-ios-timer"></i><b>事件流</b></a></Menu.Item>
            <Menu.Item key="4" className="b-danger"><a href="/apmsys/alarmList"><i className="ion-ios-bell"></i><b>报警/预警</b></a></Menu.Item>
            <SubMenu key="5" className="b-warning" title={<span><i className="ion-arrow-graph-up-right"></i><b>指标</b></span>}>
              <Menu.Item key="51"><a href="/apmsys/userMetric"><b>用户指标</b></a></Menu.Item>
              <Menu.Item key="52"><a href="/apmsys/metrics/explore"><b>浏览</b></a></Menu.Item>
            </SubMenu>
          </MenuItemGroup>
          <MenuItemGroup title="用户中心">
            <Menu.Item key="6" className="b-default"><a href="#"><i className="ion-information"></i><b>帮助</b></a></Menu.Item>
            <Menu.Item key="7" className="b-default"><a href="#"><i className="ion-ios-gear"></i><b>设置</b></a></Menu.Item>
          </MenuItemGroup>
        </Menu>
      </div>
    );
  }
}


export default AppSide;
