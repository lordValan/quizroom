import React, { Component } from 'react';
import { showCircullarProgress } from '../../../../../utils/AppHelper';
import axios from 'axios';
import { SecsToTime } from '../../../../../utils/AppHelper';

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
        this.setState( { IsLoaded: true, result: response.data } );
      })
      .catch((error) => {
        console.log(error);
      });
    } 

    drawResult() {
      return (  
        <div>      
          <div className="ResultContainer" style={{textAlign: 'center'}}>
            <h1>{this.state.result.mark}</h1>
            <p>{this.state.result.result}</p>
            <p>{SecsToTime(this.state.result.pass_time)}</p>
          </div> 
        </div>      
      );
    }

    render() {
      return !this.state.IsLoaded ? showCircullarProgress() : this.drawResult();
    }
  }
  
export default Result;