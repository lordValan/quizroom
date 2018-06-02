import React, { Component } from 'react';
import { AppMainMenu } from '../../../utils/AppSettings';
import { Route, Switch } from 'react-router-dom';
import NoMatch from '../AppContent/NoMatch';

class ContentBlock extends Component {     
    render() {
      return (
        <section className={ this.props.className ? this.props.className : "ContentBlock" }>
            <Switch>
                {/* app main menu routes output */}
                {AppMainMenu.map((elem) => {
                    return <Route key={ elem.Id } exact={true} path={ elem.Route } component={ elem.Component } />
                })}  
                <Route key='no_match_item' path='**' component={ NoMatch } />                
            </Switch>
        </section>
      );
    }
  }
  
export default ContentBlock;