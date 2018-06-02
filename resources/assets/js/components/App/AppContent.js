import React, { Component } from 'react';
import UserInfo from './AppContent/UserInfo';
import ContentBlock from './AppContent/ContentBlock';

class AppContent extends Component {     
    render() {
      return (
        <main className={ this.props.className ? this.props.className : "AppContent" }>
            <UserInfo UserInfo={{FullName: 'John Dow', Photo: 'http://www.newsshare.in/wp-content/uploads/2017/04/Miniclip-8-Ball-Pool-Avatar-11.png'}} />
            <ContentBlock />
        </main>
      );
    }
  }
  
export default AppContent;