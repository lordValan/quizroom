import React, { Component } from 'react';

class NoMatch extends Component {
    render() {
        return <p>Nothing was found on route <code>{window.location.pathname}</code></p>
    }
}

export default NoMatch;