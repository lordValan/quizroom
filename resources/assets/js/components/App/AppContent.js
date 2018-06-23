import React, { Component } from 'react';
import ContentBlock from './AppContent/ContentBlock';

class AppContent extends Component {     
    render() {
      return (
        <main className={ this.props.className ? this.props.className : "AppContent" }>
            <ContentBlock />
        </main>
      );
    }
  }
  
export default AppContent;