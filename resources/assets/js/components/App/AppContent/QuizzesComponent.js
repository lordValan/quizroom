import React, { Component } from 'react';
import MainContentInfoBlock from './MainContentInfoBlock';
import Quiz from './MainContent/Quiz/Quiz';

class QuizzesComponent extends Component {
    render() {
        return  (
            <div className={ this.props.className ? this.props.className : "MainContent" }>
                <MainContentInfoBlock Title="Quizzes" Content={<Quiz />} BgColor="#F4F3F2" />
            </div>
        )        
    }
}

export default QuizzesComponent;