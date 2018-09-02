import React, { Component } from 'react';
import MainContentInfoBlock from './MainContentInfoBlock';
import EditGroup from './MainContent/EditGroup/EditGroup';
import { showCircullarProgress, newGroupTemplate } from '../../../utils/AppHelper';
import axios from 'axios';

class AddGroupComponent extends Component {   

    drawComponent() {
        return  (
            <div className={ this.props.className ? this.props.className : "MainContent" }>
                <MainContentInfoBlock Title="Добавить группу" Content={<EditGroup group={JSON.parse(JSON.stringify(newGroupTemplate))} 
                            finishRoute="api/admin/groups/create" />} BgColor="#F4F3F2" />
            </div>
        ) 
    }

    render() {
        return this.drawComponent();   
    }
}

export default AddGroupComponent;