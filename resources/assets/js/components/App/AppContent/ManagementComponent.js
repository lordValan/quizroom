import React, { Component } from 'react';
import MainContentInfoBlock from './MainContentInfoBlock';
import Management from './MainContent/Management/Management';

class ManagementComponent extends Component {
    render() {
        return  (
            <div className={ this.props.className ? this.props.className : "MainContent" }>
                <MainContentInfoBlock Title="Управление" Content={<Management />} BgColor="#F4F3F2" />
            </div>
        )        
    }
}

export default ManagementComponent;