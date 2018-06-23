import React, { Component } from 'react';
import MainContentInfoBlock from './MainContentInfoBlock';
import Quizzes from './MainContent/Quizzes/Quizzes';

class InvitationsComponent extends Component {
    render() {
        return  (
            <div className={ this.props.className ? this.props.className : "MainContent" }>
                <MainContentInfoBlock Title="Приглашения" Content={<Quizzes route="api/user/invitations" 
                                        emptyMessage="У Вас нет приглашений :(" />} BgColor="#F4F3F2" />
            </div>
        )        
    }
}

export default InvitationsComponent;