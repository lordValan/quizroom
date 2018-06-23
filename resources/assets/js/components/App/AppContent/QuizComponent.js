import React, { Component } from 'react';
import MainContentInfoBlock from './MainContentInfoBlock';
import Quiz from './MainContent/Quiz/Quiz';

class QuizComponent extends Component {
    render() {
        return  (
            <div className={ this.props.className ? this.props.className : "MainContent" }>
                <MainContentInfoBlock Title="Тест" Content={<Quiz parent_props={this.props} />} BgColor="#F4F3F2" />
            </div>
        )        
    }
}

export default QuizComponent;