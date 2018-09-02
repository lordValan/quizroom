import React, { Component } from 'react';
import MainContentInfoBlock from './MainContentInfoBlock';
import Groups from './MainContent/Management/Groups';

class GroupsManagementComponent extends Component {
    render() {
        return  (
            <div className={ this.props.className ? this.props.className : "MainContent" }>
                <MainContentInfoBlock Title="Управление группами" Content={<Groups />} BgColor="#F4F3F2" />
            </div>
        )        
    }
}

export default GroupsManagementComponent;