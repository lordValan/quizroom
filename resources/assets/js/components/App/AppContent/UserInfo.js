import React, { Component } from 'react';

class UserInfo extends Component {     
    render() {
      return (
        <section className={ this.props.className ? this.props.className : "UserInfo" }>
            <div className="InfoContainer">
              <img src={ this.props.UserInfo.Photo } alt="avatar" className="Avatar" />
              <h2 className="FullName">{ this.props.UserInfo.FullName }</h2>
            </div>
            <div className="ProgressContainer">

            </div>
        </section>
      );
    }
  }
  
export default UserInfo;