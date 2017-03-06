import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Login from './../Login/Login';
import { Link } from 'react-router';

import './boot.scss';
import './daterangepicker.css';
import './ali.css';
import './diyselect.css';
import './App.scss';
import { Menu, Breadcrumb, Icon, } from 'antd';

import AppSide from '../../components/AppSide/AppSide';

//import ReactHighcharts from 'react-highcharts';
//import highchartsTreemap from 'highcharts-treemap';


//highchartsTreemap(ReactHighcharts.Highcharts);

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
      <div>
        <div className="app-side">
          <AppSide />
        </div>

        <div className="app-main" >
          {this.props.children}
        </div>
      </div>
    );
  }

  render() {
    const { isAuthenticated } = this.props;
    console.log(isAuthenticated);
    return (
      <div>
        {isAuthenticated ?  <Login /> : this.renderAuthenticatedPage()}
      </div>
    );
  }
}
//  {this.renderAuthenticatedPage()}

function mapStateToProps(state) {
  const { routing, auth: { isAuthenticated, }, user, dashboard } = state;
  return {
    isAuthenticated, user, routing, dashboard
  };
}

export default connect(mapStateToProps)(App);
