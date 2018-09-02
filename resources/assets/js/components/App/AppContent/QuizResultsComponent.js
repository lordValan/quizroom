import React, { Component } from 'react';
import MainContentInfoBlock from './MainContentInfoBlock';
import QuizResults from './MainContent/QuizResults/QuizResults';

class QuizResultsComponent extends Component {
    render() {
        return  (
            <div className={ this.props.className ? this.props.className : "MainContent" }>
                <MainContentInfoBlock Title="Результаты" Content={<QuizResults parent_props={this.props} /> } BgColor="#F4F3F2" />
            </div>
        )        
    }
}

export default QuizResultsComponent;