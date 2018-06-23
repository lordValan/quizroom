import React, { Component } from 'react';
import { showCircullarProgress } from '../../../../../utils/AppHelper';
import axios from 'axios';
import QuizBlock from '../Quizzes/QuizBlock';

class Invitations extends Component {
    constructor(props) {
      super(props);
      this.token = localStorage.getItem('token');
      this.state = { IsLoaded: false };
    }

    componentDidMount() {
      axios.get('api/user/invitations', {
        params: {
          'token': this.token,
        }
      })
      .then((response) => {
        this.setState( { IsLoaded: true, quizzes: response.data } );        
      })
      .catch((error) => {
        console.log(error);
      });
    } 
    
    drawQuizzes() {
      return this.state.quizzes.map((quiz, index) => {
        return <QuizBlock key={quiz.id} quiz={quiz.quiz} />
      });  
    }

    drawEmpty() {
      return <p className="EmptyQuizzes">
        У Вас нет приглашений :(
      </p>
    }

    drawComponent() {
      return (  <div>          
          <div className="Quizzes">      
              { this.state.quizzes.length > 0 ? this.drawQuizzes() : this.drawEmpty() }              
          </div>   
        </div>   
      );
    }

    render() {
      return !this.state.IsLoaded ? showCircullarProgress() : this.drawComponent();
    }
  }
  
export default Invitations;