import React, { Component } from 'react';
import { TextField, IconButton, Checkbox, FlatButton } from 'material-ui';
import { Close as CloseIcon } from 'material-ui-icons';

class EditQuestion extends Component {
    constructor(props) {
      super(props);
    }    

    render() {
      return (
        <div className="Question">
            <h3>Вопрос:</h3>
            <table className="QuestionHead">
                <tbody>
                    <tr>
                        <td className="ColIndex">{this.props.index + 1}</td>
                        <td className="ColText">
                            <TextField hintText="Вопрос" floatingLabelText="Вопрос" 
                            type="text" required={true} underlineFocusStyle={{ borderColor: '#0098d4' }} 
                            floatingLabelFocusStyle={{ color: '#0098d4' }}
                            defaultValue={this.props.question.text} className="TF"
                            onBlur={(e) => this.props.changeQuestionText(this.props.index, e.target.value)} />                    
                        </td>
                        <td className="ColBtns">
                            <IconButton onClick={() => this.props.removeQuestion(this.props.index)} ><CloseIcon /></IconButton>
                        </td>
                    </tr>
                </tbody>
            </table>
            <h3>Ответы:</h3>
            <table className="QuestionAnswers">
                <tbody>
                    {this.props.question.answers.map((answer, index) => {
                        return ( 
                            <tr key={Math.random()} >
                                <td className="ColIndex">{index + 1}</td>
                                <td className="ColText">
                                    <TextField hintText="Ответ" floatingLabelText="Ответ" 
                                        type="text" required={true} underlineFocusStyle={{ borderColor: '#0098d4' }} 
                                        floatingLabelFocusStyle={{ color: '#0098d4' }}
                                        defaultValue={answer.text} className="TF"
                                        onBlur={(e) => this.props.changeAnswerText(this.props.index, index, e.target.value)} />                    
                                </td>
                                <td className="ColRight">
                                    <Checkbox checked={answer.is_right == true ? true : false} className="RightCheck" 
                                                onCheck={ (event, is_checked) => this.props.changeAnswerRight(this.props.index, index, is_checked) } />
                                </td>
                                <td className="ColBtns">
                                    <IconButton onClick={() => this.props.removeAnswer(this.props.index, index)}><CloseIcon /></IconButton>
                                </td>
                            </tr>
                        )
                    })}                    
                </tbody>
            </table>
            <div className="AnswersButtonContainer">
                <FlatButton label="Добавить ответ" onClick={ () => this.props.addNewAnswer(this.props.index) } />
            </div>
        </div>
      )
    }
  }
  
export default EditQuestion;