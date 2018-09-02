import React, { Component } from 'react';
import { AppName, AppMainMenu, ApiURL } from '../utils/AppSettings'
import { HashRouter as Router, Link } from 'react-router-dom'
import { AppBar, Drawer, MuiThemeProvider, IconButton, FlatButton, Dialog, TextField, DatePicker, RadioButton, RadioButtonGroup } from 'material-ui';
import { MainMenu } from './App/MainMenu';
import AppContent from './App/AppContent';
import { ExitToApp as ExitToAppIcon } from 'material-ui-icons';
import { showCircullarProgress, DefaultBirthDate } from '../utils/AppHelper';
import axios from 'axios';
import areIntlLocalesSupported from 'intl-locales-supported';

class App extends Component {
    constructor(props) {
      super(props);      

      this.statuses = [
        {id: 'user', name: 'Пользователь'},
        {id: 'creator', name: 'Создатель'}
      ];

      this.state = { 
        drawerOpen: false, 
        logOutDialogOpen: false, 
        IsAuth: false, 
        IsLoaded: false,
        loginError: '',
        registerError: '',
        selectedRegDateBirth: DefaultBirthDate,
        selectedStatus: this.statuses[0].id
      };
      
      /* login inputs */
      this.login_email_input = React.createRef();
      this.login_pass_input = React.createRef();

      /* register inputs */
      this.reg_fname_input = React.createRef();
      this.reg_lname_input = React.createRef();
      this.reg_email_input = React.createRef();
      this.reg_pass_input = React.createRef();

      if (areIntlLocalesSupported(['ru', 'ru-RU'])) {
        this.DateTimeFormat = global.Intl.DateTimeFormat;
      } else {
        const IntlPolyfill = require('intl');
        this.DateTimeFormat = IntlPolyfill.DateTimeFormat;
        require('intl/locale-data/jsonp/ru');
        require('intl/locale-data/jsonp/ru-RU');
      }
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
  
      axios.get('api/logout', {
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
        axios.get('api/auth', {
          params: {
            'token': token
          }
        })
          .then((response) => {
            if(response.data.success) {
              localStorage.setItem('token', response.data.token);
              this.setState({ IsAuth: true, IsLoaded: true, LoginRegForm: true });
            } else {
              this.setState({ IsAuth: false, IsLoaded: true, LoginRegForm: true });
            }              
          })
          .catch((error) => {
            this.setState({ IsAuth: false, IsLoaded: true, LoginRegForm: true });
          });
      } else {
        this.setState({ IsAuth: false, IsLoaded: true, LoginRegForm: true });
      }  
      
      axios.get('api/genders')
        .then((response) => {
          this.setState({Genders: response.data, SelectedRegGender: response.data[0].id });           
      })
    }
  
    drawAuthApp() {
      const logOutDialogActions = [
        <FlatButton
          label="Да"
          primary={ false }
          onClick={ this.logOutHandler.bind(this) }
        />,
        <FlatButton
          label="Нет"
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
            title="Вы уверены?"
            actions={ logOutDialogActions }
            modal={ false }
            open={ this.state.logOutDialogOpen }
            onRequestClose={ this.closeLogOutDialog.bind(this) }
          >
            Вы уверены, что хотите покинуть приложение?
          </Dialog>
          {/* AppContent */}
          <AppContent />
        </div>
      )
    }
  
    drawUnAuthApp() {      
      return <div className="UnAuthContainer">
        <div>
          <h1>Добро пожаловать в QuizRoom!</h1>
          { this.state.LoginRegForm ? this.drawLoginForm() : this.drawRegistrationForm() }          
        </div>
      </div>
    }

    changeLoginRegFormHandler() {
      this.setState({LoginRegForm: !this.state.LoginRegForm });
    }
  
    drawApp() {
      return this.state.IsAuth ? this.drawAuthApp() : this.drawUnAuthApp();
    }

    /* 
    * login functions 
    */
  
    loginFormSubmitHandler(e) {
      e.preventDefault();
      this.setState({ IsLoaded: false });
  
      axios.post('api/login', {
        email: this.login_email_input.current.input.value,
        password: this.login_pass_input.current.input.value
      })
        .then((response) => {
          if(response.data.success) {
            localStorage.setItem('token', response.data.data.token);
            this.setState({ IsLoaded: true, IsAuth: true });
          } else {
            this.setState({ IsLoaded: true, IsAuth: false, loginError: response.data.error });
          }          
        })
        .catch((error) => {
          this.setState({ IsLoaded: true, loginError: 'Что-то пошло не так :(' });
        });
    }
  
    drawLoginForm() {
      return (
        <div>
          <p className="LoginRegError">{this.state.loginError}</p>
          <form onSubmit={ this.loginFormSubmitHandler.bind(this) }>
            <TextField ref={this.login_email_input} hintText="E-Mail" floatingLabelText="E-Mail" 
                      type="email" required={true} underlineFocusStyle={{ borderColor: '#0098d4' }} 
                      floatingLabelFocusStyle={{ color: '#0098d4' }}/>
            <TextField ref={this.login_pass_input} hintText="Пароль" floatingLabelText="Пароль" 
                      type="password" required={true} underlineFocusStyle={{ borderColor: '#0098d4' }} 
                      floatingLabelFocusStyle={{ color: '#0098d4' }}/>
            <FlatButton label="Войти" type="submit" />
            <FlatButton label="Регистрация" type="button" className="loginRegSwitchButton"
                      onClick={this.changeLoginRegFormHandler.bind(this)} />
          </form>
        </div>
      )
    }

    /* 
    * ----------------------------------------------------------------------
    */

    /* 
    * registration functions 
    */
  
   registrationFormSubmitHandler(e) {
    e.preventDefault();
    this.setState({ IsLoaded: false });

    axios.post('api/register', {
      email: this.reg_email_input.current.input.value,
      password: this.reg_pass_input.current.input.value,
      first_name: this.reg_fname_input.current.input.value,
      last_name: this.reg_lname_input.current.input.value,
      date_of_birth: this.state.selectedRegDateBirth,
      gender: this.state.SelectedRegGender,
      status: this.state.selectedStatus
    })
      .then((response) => {
        if(response.data.success) {
          localStorage.setItem('token', response.data.data.token);
          this.setState({ IsLoaded: true, IsAuth: true });
        } else {
          this.setState({ IsLoaded: true, IsAuth: false, loginError: response.data.error });
        }       
      })
      .catch((error) => {
        this.setState({ IsLoaded: true, loginError: 'Что-то пошло не так :(' });
      });
  }

  drawRegistrationForm() {
    return (
      <div>
        <p className="LoginRegError">{this.state.registerError}</p>
        <form onSubmit={ this.registrationFormSubmitHandler.bind(this) } autoComplete="off">
          <input type="email" style={{opacity: '0', position: 'absolute'}} />
          <input type="password" style={{opacity: '0', position: 'absolute'}} />
          <div className="namesRow">
            <TextField ref={this.reg_fname_input} hintText="Имя" floatingLabelText="Имя" 
                      type="text" required={true} underlineFocusStyle={{ borderColor: '#0098d4' }} 
                      floatingLabelFocusStyle={{ color: '#0098d4' }} name="reg_first_name" autoComplete="off" />
            <TextField ref={this.reg_lname_input} hintText="Фамилия" floatingLabelText="Фамилия" 
                      type="text" required={true} underlineFocusStyle={{ borderColor: '#0098d4' }} 
                      floatingLabelFocusStyle={{ color: '#0098d4' }} name="reg_last_name" autoComplete="off"/>
          </div>
          <TextField ref={this.reg_email_input} hintText="E-Mail" floatingLabelText="E-Mail" 
                    type="email" required={true} underlineFocusStyle={{ borderColor: '#0098d4' }} 
                    floatingLabelFocusStyle={{ color: '#0098d4' }} name="reg_email" autoComplete="off"/>
          <TextField ref={this.reg_pass_input} hintText="Пароль (6 или более символов)" floatingLabelText="Пароль (6 или более символов)" 
                    type="password" required={true} underlineFocusStyle={{ borderColor: '#0098d4' }} 
                    floatingLabelFocusStyle={{ color: '#0098d4' }} minLength="6" maxLength="32" name="reg_pass" autoComplete="new-password"/>
          <div className={ this.props.className ? this.props.className : "RegGendersBirthDate" }>
              <RadioButtonGroup name="RegGendersButtons" defaultSelected={this.state.Genders[0].id} 
                                onChange={ (obj, val) => this.setState({SelectedRegGender: val}) } >
                {this.state.Genders.map((a) => {
                    return <RadioButton key={a.id} value={a.id} label={a.name} className="RegGenderButton" />
                })}
              </RadioButtonGroup>
              <RadioButtonGroup name="RegStatusButtons" defaultSelected={this.state.selectedStatus} 
                                onChange={ (obj, val) => this.setState({selectedStatus: val}) } >
                {this.statuses.map((s) => {
                    return <RadioButton key={s.id} value={s.id} label={s.name} className="RegStatusButton" />
                })}
              </RadioButtonGroup>                                           
          </div>
          <div className="statusRow"> 
              <DatePicker hintText="Дата рождения" okLabel="OK" cancelLabel="Отмена" 
                          DateTimeFormat={this.DateTimeFormat} locale="ru" className="BirthDatePicker"
                          maxDate={ DefaultBirthDate } defaultDate={ DefaultBirthDate }
                          onChange={ (obj, date) => this.setState({selectedRegDateBirth: date}) } />
          </div>
          <FlatButton label="Зарегистрироваться" type="submit" />
          <FlatButton label="Я уже зарегистрирован" type="button" className="loginRegSwitchButton"
                    onClick={this.changeLoginRegFormHandler.bind(this)} />
        </form>
      </div>
    )
  }

  /* 
  * ----------------------------------------------------------------------
  */
  
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