import React, { Component } from 'react';
import { showCircullarProgress } from '../../../../../utils/AppHelper';
import axios from 'axios';
import { FlatButton, TextField } from 'material-ui';
import { imagesUrl } from '../../../../../utils/AppHelper';

class Profile extends Component {
    constructor(props) {
      super(props);
      this.token = localStorage.getItem('token');
      this.state = { IsLoaded: false };

      /* name inputs */
      this.fname_input = React.createRef();
      this.lname_input = React.createRef();
    }

    componentDidMount() {
      axios.get('api/user/profile', {
        params: {
          'token': this.token,
        }
      })
      .then((response) => {
        this.setState( { IsLoaded: true,  
          chosen_first_name: response.data.user_info.first_name,
          chosen_last_name: response.data.user_info.last_name,
          chosen_avatar: response.data.user_info.avatar.id,
          avatars: response.data.avatars
        });        
      })
      .catch((error) => {
        console.log(error);
      });
    } 

    avatars() {
      return (
        <div className="Avatars">
          {this.state.avatars.map((avatar, index) => {
            return <div key={avatar.id} className={avatar.id === this.state.chosen_avatar ? 'avatar chosen-avatar' : 'avatar'} 
                        onClick={() => this.setState({chosen_avatar: avatar.id}) }>
              <img src={imagesUrl + avatar.path} alt={avatar.path} />
            </div>;
          })}
        </div>
      );
    }

    editFormSubmitHandler(e) {
      e.preventDefault();
      this.setState({ IsLoaded: false, chosen_first_name: this.fname_input.current.input.value, chosen_last_name: this.lname_input.current.input.value });
  
      axios.post('api/user/profile', {
          'token': this.token,
          'first_name': this.fname_input.current.input.value,
          'last_name': this.lname_input.current.input.value,
          'avatar_id': this.state.chosen_avatar
      })
        .then((response) => {
          if(response.data.success) {
            this.setState({ IsLoaded: true });
          } else {
            this.setState({ IsLoaded: true });
          }          
        })
        .catch((error) => {
          this.setState({ IsLoaded: true });
        });
    }
    
    drawProfileEditor() {
      return (
        <form onSubmit={ this.editFormSubmitHandler.bind(this) } className="ProfileEditorForm" >
          <TextField ref={this.fname_input} hintText="Имя" floatingLabelText="Имя" 
                      type="text" required={true} underlineFocusStyle={{ borderColor: '#0098d4' }} 
                      floatingLabelFocusStyle={{ color: '#0098d4' }}
                      defaultValue={this.state.chosen_first_name} />
          <TextField ref={this.lname_input} hintText="Фамилия" floatingLabelText="Фамилия" 
                      type="text" required={true} underlineFocusStyle={{ borderColor: '#0098d4' }} 
                      floatingLabelFocusStyle={{ color: '#0098d4' }}
                      defaultValue={this.state.chosen_last_name} />
          {this.avatars()}
          <FlatButton label="Сохранить" type="submit" disabled={this.state.chosen_avatar ? false : true} />
        </form>
      );  
    }

    drawComponent() {
      return (  
        <div>          
          <div className="Profile">      
              { this.drawProfileEditor() }              
          </div>   
        </div>   
      );
    }

    render() {
      return !this.state.IsLoaded ? showCircullarProgress() : this.drawComponent();
    }
  }
  
export default Profile;