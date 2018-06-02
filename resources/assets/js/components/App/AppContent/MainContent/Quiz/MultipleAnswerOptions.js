import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';

class MultipleAnswerOptions extends Component {
    render() {        
        return (
            <div className={ this.props.className ? this.props.className : "MultipleAnswerOptions" }>
                {this.props.options.map((a) => {
                    return <Checkbox key={a.id} value={a.id} label={a.value} className="quiz-answer" 
                        onCheck={ this.props.onSet } />
                })}                          
            </div>
        )        
    }
}

export default MultipleAnswerOptions;