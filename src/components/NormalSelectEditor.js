import React from 'react';
import { fetchNormal } from './../actions/normal';
import { connect } from 'react-redux';
import $ from 'jquery';

class NormalSelectEditor extends React.Component {
    //https://cloud.oneapm.com/v1/metric_types/normal_mode_list?windowTime=864000
    constructor(props) {
        super(props);
        this.state = {
            path: [0, 0, 0],
        };
    }

    changeFirst(index) {
        this.state.path.splice(0, 1, index);
        this.state.path.splice(1, 1, 0);
        this.state.path.splice(2, 1, 0);
        this.setState({
            path: this.state.path
        });
    }
    changeSecond(index) {
        this.state.path.splice(1, 1, index);
        this.state.path.splice(2, 1, 0);
        this.setState({
            path: this.state.path
        });
    }
    changeThird(index) {
        this.state.path.splice(2, 1, index);
        this.setState({
            path: this.state.path
        });
    }
    passData(metric_name, path) {
        //console.log(metric_name,path);
        
        this.props.setMetrics( metric_name, path);
        //this.props.passData(e);
        this.props.closeBox();
    }
    closeByMasking() {
        this.props.closeBox();
    }



    componentDidMount() {
        this.props.fetchNormal();

    }
    render() {

        var e = $(".dialog"),
            t = $(".masking"),
            n = e.css("width"),
            r = e.css("height");
        t.css("width", n);
        t.css("height", r);
        t.css("margin-left",-1 * (parseInt(n) / 2 + 8 ) );
        

        const { normalModel: { data } } = this.props;

        if (data.length == 0)
            return <div/>


        let subData = data[this.state.path[0]];
        let thirdData = subData[Object.keys(subData)][this.state.path[1]];
        let theItem = thirdData[Object.keys(thirdData)][this.state.path[2]];

        return <div id="DIYSelect" className={this.props.show === true ? "show" : ""}>
            <div  className="masking" onClick={this.closeByMasking.bind(this) }/>
            <ul>
                <li>平台 & 平台服务</li>
                {data.map(function (child, index) {
                    return <li  onMouseOver={this.changeFirst.bind(this, index) }
                        key={index}
                        className={this.state.path[0] === index ? "active" : ""}>
                        {Object.keys(child) }
                        <i/>
                    </li>;
                }, this) }


            </ul>
            <ul>
                <li>指标类别</li>
                {subData[Object.keys(subData)].map(function (child, index) {
                    return <li  onMouseOver={this.changeSecond.bind(this, index) }
                        key={index}
                        className={this.state.path[1] === index ? "active" : ""}>
                        {Object.keys(child) }
                        <i/>
                    </li>;
                }, this) }
            </ul>
            <ul>
                <li>指标项</li>
                {thirdData[Object.keys(thirdData)].map(function (child, index) {
                    return <li  onMouseOver={this.changeThird.bind(this, index) }
                        key={index}
                        className={this.state.path[2] === index ? "active" : ""}
                        onClick={this.passData.bind(this, theItem[Object.keys(theItem)].metric_name, this.state.path) } >
                        {Object.keys(child) }
                        <i/>
                    </li>;
                }, this) }
            </ul>
            <ul>
                <li>指标含义</li>
                <h3>{theItem[Object.keys(theItem)].metric_name}</h3>
                <p>{theItem[Object.keys(theItem)].description}</p>
                <h3>类型：{theItem[Object.keys(theItem)].type}</h3>
                <h3>单位：{theItem[Object.keys(theItem)].unit}</h3>
            </ul>
        </div>;
    }

}




// Which part of the Redux global state does our component want to receive as props?
function mapStateToProps(state) {
    const { normalModel } = state;
    return {
        normalModel
    };
}

// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch) {
    // bindActionCreators(ActionCreators, dispatch)
    return {
        fetchNormal: (params) => dispatch(fetchNormal(params))
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(NormalSelectEditor);
