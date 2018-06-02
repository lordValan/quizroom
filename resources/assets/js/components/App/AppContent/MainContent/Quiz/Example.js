import React, { Component } from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

class Example extends Component {
    componentDidMount() {
        let links = document.getElementsByTagName('a');

        for(let i = 0; i < links.length; i++) {
            links[i].addEventListener('click', (e) => {
                e.preventDefault();
            });
        }
    }

    changeHandler() {
        console.log(arguments);
    }

    render() {
        
        return (
            <div className={ this.props.className ? this.props.className : "Example" }>
                <RadioButtonGroup name="shipSpeed" onChange={this.changeHandler}>
                    <RadioButton
                        value="light"
                        label="Simple"
                        className="quiz-answer"
                    />
                    <RadioButton
                        value="not_light"
                        label="Selected by default"
                        className="quiz-answer"
                    />
                    <RadioButton
                        value="ludicrous"
                        label="Custom icon"
                        className="quiz-answer"
                    />
                </RadioButtonGroup>                             
            </div>
        )        
    }
}

export default Example;