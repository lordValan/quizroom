import React, { Component } from 'react';
import MainContentInfoBlock from './MainContentInfoBlock';
import TabsExample from './MainContent/TabsExample';

class MainContent extends Component {
    render() {
        return (
            <div className={ this.props.className ? this.props.className : "MainContent" }>
                <MainContentInfoBlock Title="First" Content={<TabsExample />} BgColor="#F4F3F2" />
                <MainContentInfoBlock Title="Second" Content={<div>content</div>} BgColor="#E1F1ED" />                
            </div>
        )        
    }
}

export default MainContent;