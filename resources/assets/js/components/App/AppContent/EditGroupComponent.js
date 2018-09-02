import React, { Component } from 'react';
import MainContentInfoBlock from './MainContentInfoBlock';
import EditGroup from './MainContent/EditGroup/EditGroup';
import { showCircullarProgress } from '../../../utils/AppHelper';
import axios from 'axios';

class EditGroupComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false
        };
    }

    componentDidMount() {
        let token = localStorage.getItem('token');
        let id = this.props.match.params.group;
        
        axios.get('api/admin/groups/' + id, {
          params: {
            'token': token
          }
        })
        .then((response) => {
          this.setState( { 
              group: this.createGroupObj(response.data.group),
              isLoaded: true
        } );

          
        })
        .catch((error) => {
            
        });
    }

    createGroupObj(group) {
        const groupObj = {
            'id': group.id,
            'name': group.name,
            'users': group.users
        };
        
        return groupObj;
    }

    drawComponent() {
        return  (
            <div className={ this.props.className ? this.props.className : "MainContent" }>
                <MainContentInfoBlock Title="Редактировать группу" Content={<EditGroup group={this.state.group} 
                            finishRoute="api/admin/groups/edit" />} BgColor="#F4F3F2" />
            </div>
        ) 
    }

    render() {
        return this.state.isLoaded ? this.drawComponent() : showCircullarProgress();   
    }
}

export default EditGroupComponent;