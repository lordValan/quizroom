import React, { Component } from 'react';
import MainContentInfoBlock from './MainContentInfoBlock';

class ProfileComponent extends Component {
    render() {
        return  (
            <div className={ this.props.className ? this.props.className : "MainContent" }>
                <MainContentInfoBlock Title="Profile" Content={<div>content</div>} BgColor="#F4F3F2" />
            </div>
        )        
    }
}

export default ProfileComponent;