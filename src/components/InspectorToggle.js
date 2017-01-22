import React from 'react';
import { Icon } from 'antd';
import Draggable from 'react-draggable';


// React.Component
export default class InspectorToggle extends React.Component {
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
        return <Draggable
            onDrag={this.handleDrag.bind(this)}
            axis="y"
            bounds={{ bottom: 90, top: -500 }}
            handle=".inspector-toggle i">
            <div className="inspector" style={{ height: 90 - this.state.deltaPosition.y }}>
                <div className="inspector-toggle"><Icon type="bars" /></div>
                <div><div className="inspector-header"><span title="{host:102,address:wuhan} by {host}">host:102,address:wu...</span>
                    <span style={{ color: 'orange' }}>01月22日 周日 16:46</span>&nbsp;&nbsp; （距现在：  ）<small><br /></small></div>
                    <div className="inspector-body container-fluid"><div className="row"><div className="col-md-6 col-xs-12">
                        <div className="wrapper">
                            <div className="inspector-line-item numberic active">
                                <i className="iconfont" style={{ color: 'rgb(86, 188, 118)' }}></i>
                            </div>
                            <div className="inspector-line-item metric active">*</div></div></div></div></div></div>
            </div>
        </Draggable>;
    }
}

