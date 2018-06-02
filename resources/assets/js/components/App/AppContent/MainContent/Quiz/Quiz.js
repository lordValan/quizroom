import React, { Component } from 'react';
import Question from './Question';
import QuestionCounter from './QuestionCounter';
import RaisedButton from 'material-ui/RaisedButton';

let questions = [{
    id: 1,
    isMultiple: false,
    value: 'What is the best club of England?',
    options: [
        {
            id: 1,
            value: 'Arsenal'
        },
        {
            id: 2,
            value: 'Liverpool'
        },
        {
            id: 3,
            value: 'Chelsea'
        },
        {
            id: 4,
            value: 'Newcastle'
        }
    ]
}, 
{
    id: 2,
    isMultiple: true,
    value: 'What are the luckiest clubs in Italy?',
    options: [
        {
            id: 5,
            value: 'Roma'
        },
        {
            id: 6,
            value: 'Juventus'
        },
        {
            id: 7,
            value: 'AC Milan'
        },
        {
            id: 8,
            value: 'Sampdoria'
        },
        {
            id: 9,
            value: 'Napoli'
        }
    ]
},
{
    id: 3,
    isMultiple: true,
    value: 'What are the luckiest clubs in Italy?',
    options: [
        {
            id: 5,
            value: 'Roma'
        },
        {
            id: 6,
            value: 'Juventus'
        },
        {
            id: 7,
            value: 'AC Milan'
        },
        {
            id: 8,
            value: 'Sampdoria'
        },
        {
            id: 9,
            value: 'Napoli'
        }
    ]
}
];

class Quiz extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questions: questions,
            currentQuestion: 1,
            isLast: false,
            isFinished: false,
            isSet: false,
            answers: []
        };
    }

    setNextQuestion() {
        if(this.state.isLast) {
            this.setState({isFinished: true});
        }

        const counter = this.state.currentQuestion + 1;

        if(this.state.questions.length === counter) {
            this.setState({isLast: true});
        }

        this.setState({currentQuestion: counter, isSet: false});
    }

    simpleQuestionSetHandler(event, value) {
        let qIndex = this.state.currentQuestion - 1;
        let arr = this.state.answers;

        arr[qIndex] = {
            questionId: this.state.questions[qIndex].id,
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
            questionId: this.state.questions[qIndex].id,
            answer: answArr
        };

        if(answArr.length === 0 && this.state.isSet) {
            this.setState({isSet: false});
        } else if(answArr.length > 0 && !this.state.isSet) {
            this.setState({isSet: true});
        }

        this.setState({answers: arr});
    }

    renderQuiz() {
        return (
            <div className={ this.props.className ? this.props.className : "Quiz" }>
                <QuestionCounter counter={this.state.currentQuestion} total={this.state.questions.length} />
                <Question question={ this.state.questions[this.state.currentQuestion - 1] } 
                    onSimpleSet={ this.simpleQuestionSetHandler.bind(this) }
                    onMultipleSet={ this.multipleQuestionSetHandler.bind(this) } />
                <div className="quiz-buttons-container">
                    <RaisedButton label={ this.state.isLast ? 'Finish' : 'Next' } className="button-next" primary={true}
                        disabled={ !this.state.isSet } onClick={ this.setNextQuestion.bind(this) } />
                </div>
            </div>
        )
    }

    renderResult() {
        let answers = this.state.answers;

        let options = [];

        this.state.questions.forEach((question, i) => {
            question.options.forEach((option, i) => {
                let alreadyIn = options.filter((elem) => {
                    return option.id === elem.id;
                });

                if(alreadyIn.length === 0){
                    options.push(option);
                }
            });
        });

        return (
            answers.map((answ, i) => {
                let str = '';
                answ.answer.forEach((elem, i) => {
                    str += options.find((option) => {
                        return option.id === parseInt(elem, 10);
                    }).value + ' ';
                });

                return <div key={answ.questionId}>
                    <p>Answer #{i + 1}: { str }</p>
                </div>
            })
        );
    }

    render() {
        return this.state.isFinished ? this.renderResult() : this.renderQuiz();      
    }
}

export default Quiz;