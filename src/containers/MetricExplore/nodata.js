import React from 'react';


export default class NoPreviewForMetricsExplorer extends React.Component {


    render() {

        return (
            <div className="metric-no-data">
                ← 选择指标
                <div className="metric-explorer-tip">指标浏览器，可以快速帮助您了解监控内容。将预览出来的图表，添加至仪表盘中<br/>或者，保存为模板，备用。</div>
                <div><img src="https://c.oneapm.com/v5.7.2/8f65c5f27b26903c64d98add409651bf.jpg" alt="Metric Explorere preview"/></div>
            
            </div>



        );
    }
}