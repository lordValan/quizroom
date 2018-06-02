import React, { Component } from 'react';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

class SimpleAnswerOptions extends Component {
    render() {        
        return (
            <div className={ this.props.className ? this.props.className : "SimpleAnswerOptions" }>
                <RadioButtonGroup name="shipSpeed" onChange={ this.props.onSet } >
                    {this.props.options.map((a) => {
                        return <RadioButton key={a.id} value={a.id} label={a.value} className="quiz-answer" />
                    })}
                </RadioButtonGroup>                             
            </div>
        )        
    }
}

export default SimpleAnswerOptions;