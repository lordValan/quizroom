import React, { Component } from 'react';
import Question from './Question';
import QuestionCounter from './QuestionCounter';
import { RaisedButton, Dialog, FlatButton } from 'material-ui';
import { showCircullarProgress, StopLinkEvent, SecsToTime } from '../../../../../utils/AppHelper';
import axios from 'axios';
import Result from './Result';
import QuizTimer from './QuizTimer';
import Moment from 'react-moment';
import Worker from 'worker-loader!../../../../../utils/TimerWorker.js';

class Quiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IsLoaded: false,
            currentQuestion: 1,
            isLast: false,
            isStarted: false,
            isFinished: false,
            isSet: false,
            answers: [],
            startQuizDialogOpen: false,
            currentSec: 0
        };  
        this.worker = undefined;
    }

    componentDidMount() {
        let token = localStorage.getItem('token');
        let slug = this.props.parent_props.match.params.quiz;
        this.timer_worker = undefined;
        
        axios.get('/api/quizzes/' + slug, {
          params: {
            'token': token
          }
        })
        .then((response) => {
            if(!response.data.access) {
                this.setState( { access: false, IsLoaded: true } );
            } else {
                this.setState( { access: true, IsLoaded: true, quiz: response.data.quiz, isLast: response.data.quiz.questions.length === this.state.currentQuestion } );
            }
        })
        .catch((error) => {
            this.setState( { access: false, IsLoaded: true } );
        });
    } 

    setNextQuestion() {
        if(this.state.isLast) {
            this.setState({isFinished: true});
        }

        const counter = this.state.currentQuestion + 1;

        if(this.state.quiz.questions.length === counter) {
            this.setState({isLast: true});
        }

        this.setState({currentQuestion: counter, isSet: false});
    }

    simpleQuestionSetHandler(event, value) {
        let qIndex = this.state.currentQuestion - 1;
        let arr = this.state.answers;

        arr[qIndex] = {
            questionId: this.state.quiz.questions[qIndex].id,
            answer: [value]
        };

        this.setState({isSet: true, answers: arr});
    }

    multipleQuestionSetHandler(event, isChecked) {
        let qIndex = this.state.currentQuestion - 1,
        arr = this.state.answers,
        answArr = arr[qIndex] ? arr[qIndex].answer : [],
        value = event.target.value;

        if(isChecked){
            answArr.push(value);
        } else {
            let index = answArr.indexOf(value);
            if (index !== -1) answArr.splice(index, 1);
        }

        arr[qIndex] = {
            questionId: this.state.quiz.questions[qIndex].id,
            answer: answArr
        };

        if(answArr.length === 0 && this.state.isSet) {
            this.setState({isSet: false});
        } else if(answArr.length > 0 && !this.state.isSet) {
            this.setState({isSet: true});
        }

        this.setState({answers: arr});
    }

    componentWillUnmount() {
        if(this.worker) {
            this.stopWorker();
        }
    }

    renderQuiz() {
        return (
            <div className={ this.props.className ? this.props.className : "Quiz" }>
                <QuizTimer pass_time={this.state.quiz.time_to_pass} current_sec={this.state.currentSec} />
                <QuestionCounter counter={this.state.currentQuestion} total={this.state.quiz.questions.length} />
                <Question question={ this.state.quiz.questions[this.state.currentQuestion - 1] } 
                    onSimpleSet={ this.simpleQuestionSetHandler.bind(this) }
                    onMultipleSet={ this.multipleQuestionSetHandler.bind(this) } />
                <div className="quiz-buttons-container">
                    <RaisedButton label={ this.state.isLast ? 'Финиш' : 'Дальше' } className="button-next" primary={true}
                        disabled={ !this.state.isSet } onClick={ this.setNextQuestion.bind(this) } />
                </div>
            </div>
        )
    }

    renderPreQuiz() {
        const startQuizDialogActions = [
            <FlatButton
              label="Да"
              primary={ false }
              onClick={ this.startQuiz.bind(this) }
            />,
            <FlatButton
              label="Нет"
              primary={ true }        
              keyboardFocused={ true }
              onClick={ this.startQuizCloseDialog.bind(this) }
            />      
        ];

        return (
            <div className="PreQuiz">
                <h1>{this.state.quiz.name}</h1>
                <p>{this.state.quiz.description}</p>
                <div className="PreQuizData">
                    <div className="PreQuizDataItem">
                        <span className="Key">Автор</span>
                        <span className="Value">{this.state.quiz.author}</span>
                    </div>                    
                    <div className="PreQuizDataItem">
                        <span className="Key">Дата создания</span>
                        <span className="Value">{<Moment format="DD MMMM YYYY" locale="ru" date={new Date(this.state.quiz.created_at)} />}</span>
                    </div>
                    <div className="PreQuizDataItem">
                        <span className="Key">Категория</span>
                        <span className="Value">{this.state.quiz.category.name}</span>
                    </div>
                    <div className="PreQuizDataItem">
                        <span className="Key">Количество прохождений</span>
                        <span className="Value">{this.state.quiz.passed}</span>
                    </div>
                    <div className="PreQuizDataItem">
                        <span className="Key">Количество вопросов</span>
                        <span className="Value">{this.state.quiz.questions.length}</span>
                    </div>
                    <div className="PreQuizDataItem">
                        <span className="Key">Количество времени на прохождение</span>
                        <span className="Value">{SecsToTime(this.state.quiz.time_to_pass)}</span>
                    </div>
                    <div className="PreQuizDataItem">
                        <span className="Key">Среднее количество времени на прохождение</span>
                        <span className="Value">{SecsToTime(this.state.quiz.aver_time)}</span>
                    </div>
                    <div className="PreQuizDataItem">
                        <span className="Key">Средняя оценка</span>
                        <span className="Value">{this.state.quiz.aver_score} ({this.state.quiz.aver_mark})</span>
                    </div>
                </div>
                <RaisedButton label="Начать" className="button-start-quiz" primary={true}
                        disabled={ this.state.quiz.questions.length <= 0 } onClick={ this.startQuizOpenDialog.bind(this) } />
                <Dialog
                    title="Вы готовы?"
                    actions={ startQuizDialogActions }
                    modal={ false }
                    open={ this.state.startQuizDialogOpen }
                    onRequestClose={ this.startQuizCloseDialog.bind(this) }
                >
                    Вы готовы приступить к прохождению теста?
                </Dialog>
            </div>
        )
    }

    startQuizOpenDialog() { 
        this.setState({startQuizDialogOpen: true}); 
    };

    startQuizCloseDialog() {
        this.setState({startQuizDialogOpen: false}); 
    };

    startQuiz() {
        this.setState({isStarted: true}); 
        this.startWorker();
        this.linkClickStopEvents();
    }

    startWorker() {
        this.worker = new Worker();
        this.worker.addEventListener('message', (m) => { 
            this.setState({currentSec: m.data}); 

            if(this.state.quiz.time_to_pass === this.state.currentSec) {
                this.setState({isFinished: true});                
            }            
        });
    }
    
    stopWorker() { 
        if(this.worker) {
            this.worker.terminate();
            this.worker = undefined;
        }        
    }

    linkClickStopEvents() {
        document.querySelectorAll('a').forEach((elem) => {
            elem.addEventListener('click', StopLinkEvent);
        });
    }

    linkClickAllowEvents() {
        document.querySelectorAll('a').forEach((elem) => {
            elem.removeEventListener('click', StopLinkEvent);
        });
    }

    renderResult() {
        this.stopWorker();
        this.linkClickAllowEvents();
        return <Result answers={this.state.answers} quizId={this.state.quiz.id} pass_time={this.state.currentSec} />
    }

    renderComponent() {
        if(this.state.access) {
            if(!this.state.isStarted && !this.state.isFinished) {
                return this.renderPreQuiz();
            } else if(this.state.isStarted && !this.state.isFinished) {
                return this.renderQuiz();
            } else if(this.state.isStarted && this.state.isFinished) {
                return this.renderResult();
            } 
        }
        else {
            return <p>Доступ запрещен!</p>;
        }
    }

    render() {       
        return !this.state.IsLoaded ? showCircullarProgress() : this.renderComponent();   
    }
}

export default Quiz;