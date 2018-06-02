import React, { Component } from 'react';
import { AppName, AppMainMenu, ApiURL } from '../utils/AppSettings'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import { AppBar, Drawer, MuiThemeProvider, IconButton, FlatButton, Dialog, TextField } from 'material-ui';
import { MainMenu } from './App/MainMenu';
import AppContent from './App/AppContent';
import { ExitToApp as ExitToAppIcon } from 'material-ui-icons';
import { showCircullarProgress } from '../utils/AppHelper';

class App extends Component {
    constructor(props) {
      super(props);
      this.state = { 
        drawerOpen: false, 
        logOutDialogOpen: false, 
        IsAuth: false, 
        IsLoaded: false
      };
      
      this.login_email_input = React.createRef();
      this.login_pass_input = React.createRef();
    }
  
    toggleDrawerHandler() {
        this.setState({ drawerOpen: !this.state.drawerOpen })
    };
    
    closeDrawerHandler() {
        this.setState({ drawerOpen: false })
    };

    openLogOutDialog() { 
        this.setState({logOutDialogOpen: true}); 
    };

    closeLogOutDialog() {
        this.setState({logOutDialogOpen: false}); 
    };
    
    logOutHandler () {
      this.setState({ IsLoaded: false });
      let token = localStorage.getItem('token');
  
      axios.get(ApiURL + '/logout', {
        params: {
          'token': token
        }
      })
        .then((response) => {
          localStorage.setItem('token', '');
          this.setState({ IsAuth: false, IsLoaded: true, logOutDialogOpen: false });
        });
    }
  
    componentDidMount() {
      document.title = AppName;
  
      let token = localStorage.getItem('token');
  
      if(token) {
        axios.get(ApiURL + '/hello', {
          params: {
            'token': token
          }
        })
          .then((response) => {
            this.setState({ IsAuth: true, IsLoaded: true, LoginRegForm: true });
          })
          .catch((error) => {
            this.setState({ IsAuth: false, IsLoaded: true, LoginRegForm: true });
          });
      } else {
        this.setState({ IsAuth: false, IsLoaded: true, LoginRegForm: true });
      }    
    }
  
    drawAuthApp() {
      const logOutDialogActions = [
        <FlatButton
          label="Yes"
          primary={ false }
          onClick={ this.logOutHandler.bind(this) }
        />,
        <FlatButton
          label="No"
          primary={ true }        
          keyboardFocused={ true }
          onClick={ this.closeLogOutDialog.bind(this) }
        />      
      ];
  
      return (
        <div className="App">
          {/* AppBar */}
          <AppBar title={ <Link to="/" >{ AppName }</Link> } className="AppBar" 
                  onLeftIconButtonClick={ this.toggleDrawerHandler.bind(this) } 
                  iconElementRight={ <IconButton><ExitToAppIcon /></IconButton> }
                  onRightIconButtonClick={ this.openLogOutDialog.bind(this) } />
          {/* AppDrawer */}
          <Drawer docked={false} width={250} open={ this.state.drawerOpen } 
                  onRequestChange={(drawerOpen) => this.setState({ drawerOpen })} >
          <MainMenu handleCloseItem={ this.closeDrawerHandler.bind(this) } menu={ AppMainMenu } />
          </Drawer>
          {/* AppLogOutDialog */}
          <Dialog
            title="Are you sure?"
            actions={ logOutDialogActions }
            modal={ false }
            open={ this.state.logOutDialogOpen }
            onRequestClose={ this.closeLogOutDialog.bind(this) }
          >
            Are you sure you want to Log Out?
          </Dialog>
          {/* AppContent */}
          <AppContent />
        </div>
      )
    }
  
    drawUnAuthApp() {
      return <div className="UnAuthContainer">
        <div>
          <h1>Welcome to QuizRoom!</h1>
          { this.state.LoginRegForm ? this.drawLoginForm() : 'Register' }
        </div>
      </div>
    }
  
    drawApp() {
      return /* this.state.IsAuth ? this.drawAuthApp() : this.drawUnAuthApp() */ this.drawAuthApp();
    }
  
    loginFormSubmitHandler(e) {
      e.preventDefault();
      this.setState({ IsLoaded: false });
  
      axios.post(ApiURL + '/login', {
        email: this.login_email_input.current.input.value,
        password: this.login_pass_input.current.input.value
      })
        .then((response) => {
          localStorage.setItem('token', response.data.data.token);
          this.setState({ IsLoaded: true, IsAuth: true });
        })
        .catch((error) => {
          console.log(error);
          this.setState({ IsLoaded: true });
        });
    }
  
    drawLoginForm() {
      return (
        <form onSubmit={ this.loginFormSubmitHandler.bind(this) }>
        <TextField ref={this.login_email_input} hintText="E-Mail" floatingLabelText="E-Mail" type="email" required={true} />
          <TextField ref={this.login_pass_input} hintText="Password" floatingLabelText="Password" type="password" required={true} />
          <FlatButton label="Signin" type="submit" />
        </form>
      )
    }
  
    render() {
      return (
        <Router>
          <MuiThemeProvider>
            { !this.state.IsLoaded ? showCircullarProgress() : this.drawApp() }
          </MuiThemeProvider>
        </Router>
      );
    }
  }
  
  export default App;