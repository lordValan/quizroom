import React, { Component } from 'react';
import { AppMainMenu } from '../../../utils/AppSettings';
import { Route, Switch } from 'react-router-dom';
import NoMatch from '../AppContent/NoMatch';
import QuizComponent from './QuizComponent';
import EditQuizComponent from './EditQuizComponent';
import CreateQuizComponent from './CreateQuizComponent';
import QuizResultsComponent from './QuizResultsComponent';
import GroupsManagementComponent from './GroupsManagementComponent';
import EditGroupComponent from './EditGroupComponent';
import AddGroupComponent from './AddGroupComponent';

class ContentBlock extends Component {     
    render() {
      return (
        <section className={ this.props.className ? this.props.className : "ContentBlock" }>
            <Switch>
                {/* app main menu routes output */}
                {AppMainMenu.map((elem) => {
                    return <Route key={ elem.Id } exact={true} path={ elem.Route } component={ elem.Component } />
                })}                 
                <Route key='chosen_quiz' exact={true} path='/quizzes/:quiz' component={ QuizComponent } />
                <Route key='edit_chosen_quiz' exact={true} path='/management/edit/:quiz' component={ EditQuizComponent } />
                <Route key='create_new_quiz' exact={true} path='/management/create' component={ CreateQuizComponent } />
                <Route key='quiz_results' exact={true} path='/management/results/:quiz' component={ QuizResultsComponent } />
                <Route key='groups' exact={true} path='/management/groups' component={ GroupsManagementComponent } />
                <Route key='groups_edit' exact={true} path='/management/groups/edit/:group' component={ EditGroupComponent } />
                <Route key='groups_create' exact={true} path='/management/groups/create' component={ AddGroupComponent } />
                <Route key='no_match_item' path='**' component={ NoMatch } />                
            </Switch>
        </section>
      );
    }
  }
  
export default ContentBlock;