import React, { Component } from 'react';
import SimpleAnswerOptions from './SimpleAnswerOptions';
import MultipleAnswerOptions from './MultipleAnswerOptions';
import QuestionHead from './QuestionHead';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Question extends Component {
    renderQuestion() {
        if(this.props.question.is_multiple){
            return <MultipleAnswerOptions options={this.props.question.answers} onSet={ this.props.onMultipleSet } />
        } else {
            return <SimpleAnswerOptions options={this.props.question.answers} onSet={ this.props.onSimpleSet } />
        }
    }

    render() {
        return  (
            <div className={ this.props.className ? this.props.className : "Question" } key={this.props.question.id}>
                <ReactCSSTransitionGroup
                    className="container"
                    component="div"
                    transitionName="fade"
                    transitionEnterTimeout={800}
                    transitionLeaveTimeout={500}
                    transitionAppear
                    transitionAppearTimeout={500}
                >                                        
                    <QuestionHead content={this.props.question.text} />
                    {this.renderQuestion()}
                </ReactCSSTransitionGroup>            
            </div>
        )        
    }
}

export default Question;