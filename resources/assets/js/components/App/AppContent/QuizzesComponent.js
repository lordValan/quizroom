import React, { Component } from 'react';
import MainContentInfoBlock from './MainContentInfoBlock';
import Quizzes from './MainContent/Quizzes/Quizzes';

class QuizzesComponent extends Component {
    render() {
        return  (
            <div className={ this.props.className ? this.props.className : "MainContent" }>
                <MainContentInfoBlock Title="Тесты" Content={<Quizzes route="api/quizzes" 
                                        emptyMessage="Ничего не найдено :(" />} BgColor="#F4F3F2" />
            </div>
        )        
    }
}

export default QuizzesComponent;