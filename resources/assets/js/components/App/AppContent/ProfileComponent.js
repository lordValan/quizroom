import React, { Component } from 'react';
import MainContentInfoBlock from './MainContentInfoBlock';
import Profile from './MainContent/Profile/Profile';

class ProfileComponent extends Component {
    render() {
        return  (
            <div className={ this.props.className ? this.props.className : "MainContent" }>
                <MainContentInfoBlock Title="Профиль" Content={<Profile />} BgColor="#F4F3F2" />
            </div>
        )        
    }
}

export default ProfileComponent;