import React, { Component } from 'react';
import { showCircullarProgress } from '../../../../../utils/AppHelper';
import axios from 'axios';
import { SecsToTime } from '../../../../../utils/AppHelper';
import { Link } from 'react-router-dom'
import { RaisedButton } from 'material-ui';

class Result extends Component {
    constructor(props) {
      super(props);
      this.state = { IsLoaded: false };
    }

    componentDidMount() {
      let token = localStorage.getItem('token');
      
      axios.post('api/results', {
        'token': token,
        'answers': this.props.answers,
        'quizId': this.props.quizId,
        'pass_time': this.props.pass_time
      })
      .then((response) => {
        let resMess = '';

        if(response.data.result > 80) {
          resMess = 'Отличный результат! Так держать!';
        } else if(response.data.result <= 80 && response.data.result >= 60) {
          resMess = 'Неплохо! Так держать!';
        } else {
          resMess = 'Можно лучше! Подтяните свои знания и приходите в следующий раз!';
        }

        this.setState( { IsLoaded: true, result: response.data, resultMessage: resMess } );
      })
      .catch((error) => {
        console.log(error);
      });
    } 

    drawResult() {
      return (  
        <div className="Result">      
          <div className="ResultContainer" style={{textAlign: 'center'}}>
            <div className="ResultItem ResultMark">
                <h2>{this.state.result.mark}</h2>
                <p>Оценка</p>
            </div>
            <div className="ResultItem ResultScore">
                <h2>{this.state.result.result}</h2>
                <p>Баллы</p>
            </div>
            <div className="ResultItem ResultTime">
                <h2>{SecsToTime(this.state.result.pass_time)}</h2>
                <p>Время</p>
            </div>
          </div> 
          <p className="ResultMessage">{this.state.resultMessage}</p>
          <div className="ButtonContainer">
            <Link to={'/quizzes'}>
                <RaisedButton label="Закончить" primary={true} className="CloseResult" />
            </Link>              
          </div>
        </div>      
      );
    }

    render() {
      return !this.state.IsLoaded ? showCircullarProgress() : this.drawResult();
    }
  }
  
export default Result;