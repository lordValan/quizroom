import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import Moment from 'react-moment';

class QuizBlock extends Component {
    constructor(props) {
      super(props);
    }

    drawQuizBlock() {
      return (  
        <div className="QuizBlock"> 
          <div className="Head">     
            <Link to={'/quizzes/' + this.props.quiz.slug } className="QuizBlockTitle" > { this.props.quiz.name } </Link>
          </div>
          <div className="Body"> 
            <div className="QuizBlockRow Description">
              <span className="Key">Описание: </span>
              <span className="Value">{this.props.quiz.description}</span>
            </div>
            <div className="QuizBlockRow Category">
              <span className="Key">Категория: </span>
              <span className="Value">{this.props.quiz.category.name}</span>
            </div>
            <div className="QuizBlockRow Author">
              <span className="Key">Дата создания: </span>
              <Moment format="DD MMMM YYYY" locale="ru" date={new Date(this.props.quiz.created_at)} className="Value"/> 
            </div>
            <div className="QuizBlockRow Passed">
              <span className="Key">Количество прохождений: </span>
              <span className="Value">{this.props.quiz.passed}</span>
            </div>
          </div>
        </div>      
      );
    }

    render() {
      return this.drawQuizBlock();
    }
  }
  
export default QuizBlock;