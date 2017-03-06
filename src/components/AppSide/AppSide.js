import React from 'react';
import { Link } from 'react-router';
import { Icon } from 'antd';
import './AppSide.scss';

const AppSide = () => {
  return (
    <dl className="aside">
      <dt>主要</dt>
      <dd><a className="b-success active"><i><Icon type="appstore" /></i><span>平台列表</span></a></dd>
      <dd><a className="b-event"><i><Icon type="pie-chart" /></i><span>仪表盘</span></a></dd>
      <dd><a className="b-event"><i><Icon type="line-chart" /></i><span>事件流</span></a></dd>
      <dd><a className="b-danger"><i><Icon type="notification" /></i><span>报警/预警</span></a></dd>
      <dd><a className="b-warning"><i><Icon type="pushpin-o" /></i><span>指标</span></a></dd>
      <dt>用户中心</dt>
      <dd><a className="b-default"><i><Icon type="question" /></i><span>帮助</span></a></dd>
      <dd><a className="b-default"><i><Icon type="setting" /></i><span>设置</span></a></dd>
    </dl>
  );
};

/*const AppSide = () => {
  return (
    <dl className="aside">
      <dt>主要</dt>
      <dd><Link to="/" className="b-success" activeClassName="active"><i><Icon type="appstore" /></i><span>平台列表</span></Link></dd>
      <dd><Link to="/1" className="b-event" activeClassName="active"><i><Icon type="pie-chart" /></i><span>仪表盘</span></Link></dd>
      <dd><Link to="/2" className="b-event" activeClassName="active"><i><Icon type="line-chart" /></i><span>事件流</span></Link></dd>
      <dd><Link to="/3" className="b-danger" activeClassName="active"><i><Icon type="notification" /></i><span>报警/预警</span></Link></dd>
      <dd><Link to="/4" className="b-warning" activeClassName="active"><i><Icon type="pushpin-o" /></i><span>指标</span></Link></dd>
      <dt>用户中心</dt>
      <dd><Link to="/5" className="b-default" activeClassName="active"><i><Icon type="question" /></i><span>帮助</span></Link></dd>
      <dd><Link to="/6" className="b-default" activeClassName="active"><i><Icon type="setting" /></i><span>设置</span></Link></dd>
    </dl>
  );
};*/

export default AppSide;
