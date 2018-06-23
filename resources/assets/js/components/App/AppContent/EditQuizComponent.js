import React, { Component } from 'react';
import MainContentInfoBlock from './MainContentInfoBlock';

class EditQuizComponent extends Component {
    render() {
        return  (
            <div className={ this.props.className ? this.props.className : "MainContent" }>
                <MainContentInfoBlock Title="Редактировать тест" Content={<div>Данный функционал в процессе разработки</div>} BgColor="#F4F3F2" />
            </div>
        )        
    }
}

export default EditQuizComponent;