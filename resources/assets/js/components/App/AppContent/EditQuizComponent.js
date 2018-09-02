import React, { Component } from 'react';
import MainContentInfoBlock from './MainContentInfoBlock';
import EditQuiz from './MainContent/EditQuiz/EditQuiz';
import { showCircullarProgress } from '../../../utils/AppHelper';
import axios from 'axios';

class EditQuizComponent extends Component {
    constructor(props) {
        super(props);

        this.state= {
            isLoaded: false
        };
    }

    componentDidMount() {
        let token = localStorage.getItem('token');
        let slug = this.props.match.params.quiz;
        
        axios.get('api/quizzes/' + slug, {
          params: {
            'token': token
          }
        })
        .then((response) => {
          

          this.setState( { quiz: this.createQuizObj(response.data.quiz) } );

          axios.get('api/admin/data', {
            params: {
              'token': token
            }
          })
          .then((response) => {
            this.setState( { isLoaded: true, categories: response.data.categories, groups: response.data.groups } );
          })
        })
        .catch((error) => {
            
        });
    }

    createQuizObj(quiz) {
        const quizObj = {
            'id': quiz.id,
            'name': quiz.name,
            'slug': quiz.slug,
            'description': quiz.description,
            'private': quiz.private,
            'category_id': quiz.category.id,
        };

        if(quiz.private == true) {
            quizObj.groups = quiz.groups.map((group) => {
                return group.id;
            });
        }
        else {
            quizObj.groups = [];
        }

        quizObj.questions = quiz.questions.map((question) => {
            return {
                'text': question.text,
                'extra_text': question.extra_text,
                'answers': question.answers.map((answer) => {
                    return {
                        'text': answer.text,
                        'is_right': answer.is_right
                    }
                })
            };
        });
        
        return quizObj;
    }

    drawComponent() {
        return  (
            <div className={ this.props.className ? this.props.className : "MainContent" }>
                <MainContentInfoBlock Title="Редактировать тест" Content={<EditQuiz quiz={this.state.quiz} 
                            categories={this.state.categories} groups={this.state.groups} 
                            finishRoute="api/admin/quizzes/edit" />} BgColor="#F4F3F2" />
            </div>
        ) 
    }

    render() {
        return this.state.isLoaded ? this.drawComponent() : showCircullarProgress();   
    }
}

export default EditQuizComponent;