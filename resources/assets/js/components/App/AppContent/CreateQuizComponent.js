import React, { Component } from 'react';
import MainContentInfoBlock from './MainContentInfoBlock';
import EditQuiz from './MainContent/EditQuiz/EditQuiz';
import { NewQuizTemplate, showCircullarProgress } from '../../../utils/AppHelper';
import axios from 'axios';

class CreateQuizComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            newQuizTmp: JSON.parse(JSON.stringify(NewQuizTemplate))
        };
    }

    componentDidMount() {
        let token = localStorage.getItem('token');
        
        axios.get('api/admin/data', {
          params: {
            'token': token
          }
        })
        .then((response) => {
          this.setState( { isLoaded: true, categories: response.data.categories, groups: response.data.groups } );
        })
        .catch((error) => {
            
        });
    }

    drawComponent() {
        return  (
            <div className={ this.props.className ? this.props.className : "MainContent" }>
                <MainContentInfoBlock Title="Создать тест" Content={<EditQuiz quiz={this.state.newQuizTmp} 
                            categories={this.state.categories} groups={this.state.groups} 
                            finishRoute="api/admin/quizzes/create" />} BgColor="#F4F3F2" />
            </div>
        ) 
    }

    render() {
        return this.state.isLoaded ? this.drawComponent() : showCircullarProgress();   
    }
}

export default CreateQuizComponent;