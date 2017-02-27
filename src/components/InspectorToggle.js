import React from 'react';
import { Icon,Row,Col } from 'antd';
import Draggable from 'react-draggable';
import { connect } from 'react-redux';
import moment from 'moment';

// React.Component
class InspectorToggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deltaPosition: {
                x: 0,
                y: 0,
            },
        };
    }

    handleDrag(e, ui) {
        this.setState({
            deltaPosition: {
                y: ui.y,
            }
        });
        // console.log(ui.x, ui.y);
    }

    render() {
        moment.locale("zh-cn", { weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"), });
        let content = null;
        if (this.props.points.points.length > 0) {
            let endTime = moment(this.props.points.points[0].x);
            let timeFomatter = "MM月DD日 HH:mm";
            let day = endTime.format(timeFomatter) + " " + moment.weekdays(endTime.format("d"));
            let diff = moment().diff(endTime) / 1000 / 60;
            let dayDiff = moment().endOf("day").diff(endTime.endOf("day")) / 1000 / 60;

            if (dayDiff >= 60 * 24) {
                diff = parseInt(dayDiff / 24 / 60) + "天前";
            } else if (diff > 60) {
                diff = parseInt(diff / 60) + "小时前";
            } else {
                diff = parseInt(diff) + "分钟前";
            }
           
            /*let metricName = this.props.points.points[0].metric;
            let agg = this.props.points.points[0].aggregator;
            for(let i  = 0; i < this.props.points.points.length; i ++) {
                let point = this.props.points.points[i];
                if(point.metric != metricName || agg != point.aggregator) {
                    metricName = null;
                    agg = null;
                    break;
                }
            }

            if(metricName) {
                metricName = agg + ":" + metricName;
            }
            
            
            //metricName ? point.name : point.aggregator + ":" + point.metric + " - " + point.name
            */

            let rows = [];

            for(let i  = 0; i < this.props.points.points.length; i++) {
                let point = this.props.points.points[i];
                 
                let row = <Col key={i} span={12}>
                            <div className="wrapper">
                                <div className={point.active ? "inspector-line-item numberic active"  : "inspector-line-item numberic" }>
                                    <Icon type="appstore" className="iconfont" style={{ color: point.color, fontSize: 6 }} />
                                   
                                    {point.value.toFixed(2)}
                                </div>
                                <div className={point.active ? "inspector-line-item metric active"  : "inspector-line-item metric" }>{point.name}</div>
                            </div>
                        </Col>;

                rows.push(row);
            }


            content = <div>
                <div className="inspector-header">
                    <span title={this.props.points.points[0].chartName}>{this.props.points.points[0].chartName}</span>
                    &nbsp;&nbsp;|&nbsp;&nbsp;
                    <span style={{ color: 'orange' }}>{day}</span>&nbsp;&nbsp; （距现在： {diff}）
                </div>
                <div className="inspector-body container-fluid">
                    <Row>
                        {rows}
                    </Row>
                </div>
            </div>;
        }


        return <Draggable
            onDrag={this.handleDrag.bind(this)}
            axis="y"
            bounds={{ bottom: 90, top: -500 }}
            handle=".inspector-toggle i">
            <div className="inspector" style={{ height: 90 - this.state.deltaPosition.y }}>
                <div className="inspector-toggle"><Icon type="bars" /></div>

                {content}

            </div>
        </Draggable>;
    }
}

/*
别删 别删 别删 
//
获取connect后的对象 refs.chart.getWrappedInstance()
*/
// Which part of the Redux global state does our component want to receive as props?
function mapStateToProps(state) {
    const { points, } = state;
    return {
        points,

    };
}

export default connect(
    mapStateToProps,
)(InspectorToggle);
