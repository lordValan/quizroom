import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class MainContentInfoBlock extends Component {
    render() {
        return (
            <ReactCSSTransitionGroup
                className="container"
                transitionName="fade"
                transitionEnterTimeout={800}
                transitionLeaveTimeout={500}
                transitionAppear
                transitionAppearTimeout={500}
            >
            
            <div className={ this.props.className ? this.props.className : "MainContentInfoBlock" }>
                <div className="Title" style={{backgroundColor: this.props.BgColor}}>
                    <h1>{ this.props.Title }</h1>
                </div>
                <div className="Content">
                    { this.props.Content }
                </div>
            </div>

            </ReactCSSTransitionGroup>
        )        
    }
}

export default MainContentInfoBlock;