import React, { Component } from 'react';
import { Step, Stepper, StepLabel, TextField, RaisedButton, FlatButton, 
            Dialog, Toggle, SelectField, MenuItem } from 'material-ui';
import { RecoverSlug, NewQuestionTemplate, NewAnswerTemplate, showCircullarProgress, capitalizeFirstLetter } from '../../../../../utils/AppHelper';
import EditQuestion from './EditQuestion';
import { withRouter } from 'react-router-dom';

class EditQuiz extends Component {
    constructor(props) {
      super(props);

      this.state = {
        stepIndex: 0,
        quiz: props.quiz,
        categories: props.categories,
        groups: props.groups,
        alertDialogOpen: false,
        alertDialogMessage: '',
        isLoaded: true,
        newCategoryDialogOpen: false, 
      };   

      this.slug_input = React.createRef();
      this.new_cat_input = React.createRef();
      this.catCounter = 0;
    };

    /* first step start */
    
    firstStep() {
        return (
            <Step>
                <StepLabel>Основная информация</StepLabel>                
            </Step>
        );
    };

    firstStepContent() {
        return (
            <form className="EditQuizForm" onSubmit={this.firstStepSubmit.bind(this)}>
                {this.drawNewCategoryDialog()}
                <div className="FormRow">
                    <TextField hintText="Название" floatingLabelText="Название" 
                      type="text" required={true} underlineFocusStyle={{ borderColor: '#0098d4' }} 
                      floatingLabelFocusStyle={{ color: '#0098d4' }}
                      defaultValue={this.state.quiz.name}
                      onBlur={(e) => this.firstStepTFBlurHandler(e, 'name') } />
                    <TextField hintText="Идентификатор (slug)" floatingLabelText="Идентификатор (slug)" 
                      type="text" required={true} underlineFocusStyle={{ borderColor: '#0098d4' }} 
                      floatingLabelFocusStyle={{ color: '#0098d4' }}
                      defaultValue={this.state.quiz.slug}
                      onBlur={(e) => this.firstStepTFBlurHandler(e, 'slug') } 
                      ref={this.slug_input} />
                </div>
                <div className="FormRow">
                    <TextField hintText="Описание" floatingLabelText="Описание" className="Description" 
                      multiLine={true} rows={2} required={true} underlineFocusStyle={{ borderColor: '#0098d4' }} 
                      floatingLabelFocusStyle={{ color: '#0098d4' }}
                      defaultValue={this.state.quiz.description}
                      onBlur={(e) => this.firstStepTFBlurHandler(e, 'description') } />
                </div>
                <div className="FormRow">
                    <Toggle label="Приватный" toggled={this.state.quiz.private == true ? true : false} 
                        trackSwitchedStyle={{backgroundColor: '#0098d4'}}
                        thumbSwitchedStyle={{backgroundColor: '#2a92f5'}}
                        onToggle={this.privateToggleHandler.bind(this)}
                        style={{width: '49%'}} />
                    <SelectField hintText="Категория" value={this.state.quiz.category_id} floatingLabelText="Категория"
                            onChange={this.choseCategoryHandler.bind(this)} autoWidth={true} className="CategorySelect"
                            selectedMenuItemStyle={{color: '#0098d4'}}
                            underlineFocusStyle={{borderColor: '#0098d4'}}
                            maxHeight={200} >
                        <MenuItem key="new_category_item" value="new_category_item" primaryText="**Новая категория**" />
                        {this.categoryItems()}
                    </SelectField>
                </div>
                { this.state.quiz.private ? this.renderGroupItems() : '' }
                <div className="ButtonContainer">
                    <RaisedButton type="submit" label="Дальше" primary={true} className="NextFinishButton" />
                </div>
            </form>
        );
    }

    privateToggleHandler(e, checked) {
        let quiz = Object.assign({}, this.state.quiz);
        quiz.private = checked == true ? 1 : 0;

        this.setState({quiz: quiz});
    }

    categoryItems() {
        return this.state.categories.map((item) => (
          <MenuItem key={item.id} value={item.id} primaryText={item.name} />
        ));
    }   

    choseCategoryHandler(event, index, value) {
        let quiz = JSON.parse(JSON.stringify(this.state.quiz)); 

        if(value === "new_category_item") {
            this.setState({newCategoryDialogOpen: true});
        } else {
            quiz.category_id = value;
        }

        this.setState({quiz: quiz});
    }

    drawNewCategoryDialog() {
        const newCategoryDialogActions = [
            <FlatButton
              label="Ок"
              primary={ false }
              onClick={ this.createNewCatHandler.bind(this) }
            />,
            <FlatButton
              label="Отмена"
              primary={ true }        
              keyboardFocused={ true }
              onClick={ this.closeNewCategoryDialog.bind(this) }
            />      
        ];

        return <Dialog
            title="Новая категория"
            actions={ newCategoryDialogActions }
            modal={ false }
            open={ this.state.newCategoryDialogOpen }
            onRequestClose={ this.closeNewCategoryDialog.bind(this) }
          >
            <p>Введите название новой категории</p>
            <TextField hintText="Название" floatingLabelText="Название" className="CatName" 
                      required={true} underlineFocusStyle={{ borderColor: '#0098d4' }} 
                      floatingLabelFocusStyle={{ color: '#0098d4' }}
                      ref={this.new_cat_input} />
        </Dialog>
    }

    closeNewCategoryDialog() {
        this.setState({newCategoryDialogOpen: false});
    }

    choseGroupHandler(event, index, values) {
        let quiz = JSON.parse(JSON.stringify(this.state.quiz)); 
        quiz.groups = values;

        this.setState({quiz: quiz});
    }

    createNewCatHandler() {
        let value = this.new_cat_input.current.input.value;

        if(value.trim().length > 0) {
            let id = 'new_category' + this.catCounter++,
                quiz = JSON.parse(JSON.stringify(this.state.quiz))
                value = capitalizeFirstLetter(value); 

            this.state.categories.push({
                'id': id,
                'name': value,
                'slug': RecoverSlug(value)
            });

            quiz.category_id = id;
            this.closeNewCategoryDialog();
            this.setState({quiz: quiz});
        } else {
            this.new_cat_input.current.focus();
        }
    }

    groupsItems() {
        return this.state.groups.map((item) => (
          <MenuItem key={item.id} value={item.id} primaryText={item.name} insetChildren={true}
                        checked={this.state.quiz.groups.indexOf(item.id) > -1} />
        ));
    } 
    
    renderGroupItems() {
        return (
            <div className="FormRow">
                <SelectField multiple={true} hintText="Группы" value={this.state.quiz.groups} floatingLabelText="Группы"
                    onChange={this.choseGroupHandler.bind(this)} className="GroupSelect"
                    selectedMenuItemStyle={{color: '#0098d4'}} underlineFocusStyle={{borderColor: '#0098d4'}}
                    maxHeight={200} >
                        {this.groupsItems()}
                </SelectField>
            </div>
        );
    }

    firstStepTFBlurHandler(e, action) {
        const val = e.target.value;
        let quiz = JSON.parse(JSON.stringify(this.state.quiz)); 
        let trans = RecoverSlug(val);

        switch(action) {
            case 'slug':                
                e.target.value = trans;
                quiz.slug = trans;
                break;
            case 'name':
                quiz.name = val;
                this.slug_input.current.input.value = trans;
                quiz.slug = trans;
                break;
            case 'description':
                quiz.description = val;
                break;
            default: 
                break;
        }
        
        this.setState({quiz: quiz});        
    }

    firstStepSubmit(e) {
        e.preventDefault();

        if(this.state.quiz.category_id === null){
            this.showAlertDialog('Необходимо выбрать категорию!');
            return false;
        }

        if(this.state.quiz.private) {
            if(this.state.quiz.groups.length <= 0){
                this.showAlertDialog('Необходимо выбрать группы, которым доступен тест!');
                return false;
            }
        }        

        this.handleNext();
    }

    /* first step end */

    /* second step start */

    secondStep() {
        return (
            <Step>
                <StepLabel>Вопросы</StepLabel>
            </Step>
        );
    };

    secondStepContent() {
        const isLast = this.state.stepIndex === (this.state.quiz.private ? 2 : 1);

        return (            
            <form className="EditQuizForm" onSubmit={this.secondStepSubmit.bind(this)}>
                <div className="Questions">
                    {this.state.quiz.questions.map((question, index) => {
                        return <EditQuestion key={Math.random()} question={question} index={index} 
                                addNewAnswer={this.addNewAnswerHandler.bind(this)}
                                removeAnswer={this.removeAnswerHandler.bind(this)}
                                removeQuestion={this.removeQuestionHandler.bind(this)}
                                changeAnswerText={this.changeAnswerTextHandler.bind(this)}
                                changeQuestionText={this.changeQuestionTextHandler.bind(this)}
                                changeAnswerRight={this.changeAnswerRightHandler.bind(this)} />
                    })}
                    <div className="QuestionsButtonContainer">
                        <FlatButton label="Добавить вопрос" onClick={this.addNewQuestionHandler.bind(this)} />
                    </div>
                </div>
                <div className="ButtonContainer">
                    <FlatButton label="Назад" disabled={this.state.stepIndex === 0} onClick={this.handlePrev.bind(this)} />
                    <RaisedButton type="submit" label={'Завершить'} 
                        primary={true} className="NextFinishButton" />
                </div>
            </form>
        );
    }

    addNewQuestionHandler() {
        if(this.state.quiz.questions.length >= 25) {
            this.showAlertDialog('Максимальное количество вопросов - 25');
            return false;
        }

        let quiz = JSON.parse(JSON.stringify(this.state.quiz)); 

        quiz.questions.push(Object.assign({}, NewQuestionTemplate));

        this.setState({quiz: quiz});
    }

    removeQuestionHandler(question_index) {
        if(this.state.quiz.questions.length <= 5) {
            this.showAlertDialog('Минимальное количество вопросов - 5');
            return false;
        }

        let quiz = JSON.parse(JSON.stringify(this.state.quiz));

        quiz.questions.splice(question_index, 1);

        this.setState({quiz: quiz});
    }

    changeQuestionTextHandler(question_index, new_text) {
        let quiz = JSON.parse(JSON.stringify(this.state.quiz));

        quiz.questions[question_index].text = new_text;

        this.setState({quiz: quiz});
    }

    addNewAnswerHandler(question_index) {
        if(this.state.quiz.questions[question_index].answers.length >= 8) {
            this.showAlertDialog('Максимальное количество ответов - 8');
            return false;
        }

        let quiz = JSON.parse(JSON.stringify(this.state.quiz));

        quiz.questions[question_index].answers.push(JSON.parse(JSON.stringify(NewAnswerTemplate)));

        this.setState({quiz: quiz});
    }

    removeAnswerHandler(question_index, answer_index) {
        if(this.state.quiz.questions[question_index].answers.length <= 3) {
            this.showAlertDialog('Минимальное количество ответов - 3');
            return false;
        }

        let quiz = JSON.parse(JSON.stringify(this.state.quiz));
        
        quiz.questions[question_index].answers.splice(answer_index, 1);

        this.setState({quiz: quiz});
    }

    changeAnswerTextHandler(question_index, answer_index, new_text) {  
        let quiz = JSON.parse(JSON.stringify(this.state.quiz));  

        quiz.questions[question_index].answers[answer_index].text = new_text;
        var coord = window.pageYOffset;
        setTimeout(() => {
            window.scroll(0, coord);
        }, 40);

        this.setState({quiz: quiz});
    }

    changeAnswerRightHandler(question_index, answer_index, right) {
        let quiz = JSON.parse(JSON.stringify(this.state.quiz)); 

        quiz.questions[question_index].answers[answer_index].is_right = right == true ? 1 : 0;

        this.setState({quiz: quiz});
    }

    validateQuizQuestions() {
        if(this.state.quiz.questions.length > 25) {
            this.showAlertDialog('Максимальное количество вопросов - 25');
            return false;
        } else if(this.state.quiz.questions.length < 5) {
            this.showAlertDialog('Минимальное количество вопросов - 5');
            return false;
        }

        for(let i = 0; i < this.state.quiz.questions.length; i++) {
            if(this.state.quiz.questions[i].answers.length > 8) {
                this.showAlertDialog('Вопрос №' + (i + 1) + ' - максимальное количество ответов должно быть не более 8');
                return false;
            } else if(this.state.quiz.questions[i].answers.length < 3) {
                this.showAlertDialog('Вопрос №' + (i + 1) + ' - минимальное количество ответов должно быть не менее 3');
                return false;
            }

            let rightAnswCount = this.state.quiz.questions[i].answers.filter((answer) => {
                return answer.is_right;
            });

            if(rightAnswCount.length === 0) {
                this.showAlertDialog('Вопрос №' + (i + 1) + ' - не отмечено ни одного правильного ответа');
                return false;
            }
        }

        return true;
    }

    secondStepSubmit(e) {
        e.preventDefault();        
        
        if(!this.validateQuizQuestions()) {
            return false;
        }

        if(this.state.quiz.category_id === null){
            this.showAlertDialog('Необходимо выбрать категорию!');
            return false;
        }        
        
        const token = localStorage.getItem('token');
        this.setState({isLoaded: false});

        let cat = this.state.categories.filter((cat) => {
            return cat.id === this.state.quiz.category_id;
        });

        if(cat.length === 0){
            this.showAlertDialog('Необходимо выбрать категорию!');
            return false;
        }  

        axios.post(this.props.finishRoute, { 
            'token': token,
            'quiz': this.state.quiz,
            'cat_obj': cat[0]
        })
        .then((response) => {
            this.setState({isLoaded: true});
          if(response.data.success) {
            this.props.history.push('/quizzes/' + response.data.slug);
          } else {            
            this.showAlertDialog(response.data.error);
          }          
        })
        .catch((error) => {
            this.setState({isLoaded: true});
            this.showAlertDialog(error.message);
        });    
    }

    /* second step end */    

    handleNext() {
        this.setState({
          stepIndex: this.state.stepIndex + 1
        });
    };

    handlePrev() {
        if (this.state.stepIndex > 0) {
          this.setState({stepIndex: this.state.stepIndex - 1});
        }
    };

    getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0: 
                return this.firstStepContent();
            case 1: 
                return this.secondStepContent();
            default: 
                return <p>Ничего не найдено</p>
        }
    }

    closeAlertDialog() {
        this.setState({
          alertDialogOpen: false
        });
    }

    showAlertDialog(message) {
        this.setState({
          alertDialogOpen: true,
          alertDialogMessage: message
        });
    }

    dialogs() {  
        const alertDialogButton = <FlatButton label="Ok" primary={ false } onClick={ this.closeAlertDialog.bind(this) } />;
  
        return (
          <div>
            <Dialog title="Внимание" actions={ alertDialogButton } modal={ false } 
              open={ this.state.alertDialogOpen } onRequestClose={ this.closeAlertDialog.bind(this) }
            >
              { this.state.alertDialogMessage }
            </Dialog> 
          </div>  
        );
    }

    drawQuizStepper() {
    
        return (
          <div className="EditQuizStepper" >
            { this.dialogs() }
            <Stepper activeStep={this.state.stepIndex}>              
              {this.firstStep()}
              {this.secondStep()}
            </Stepper> 
            { this.getStepContent(this.state.stepIndex) }           
          </div>
        );
    };

    render() {
      return this.state.isLoaded ? this.drawQuizStepper() : showCircullarProgress();
    }
  }
  
export default withRouter(EditQuiz);