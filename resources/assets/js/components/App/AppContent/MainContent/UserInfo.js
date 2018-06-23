import React, { Component } from 'react';
import { imagesUrl } from '../../../../utils/AppHelper';
import Moment from 'react-moment';

class UserInfo extends Component {   
    constructor(props) {
        super(props);
        let groups_names = props.groups.map((obj => {
            return obj.name;
        }));

        this.groups_str = groups_names.length > 0 ? groups_names.join() : 'Еще не приняли :(';
    }  

    render() {    
      return (
        <div className="UserInfo">
            <img src={ imagesUrl + this.props.UserInfo.avatar.path } alt="avatar" className="Avatar" />
            <div className="Info">
                <div className="InfoItem">
                    <span className="Key">Имя</span>
                    <span className="Value">{this.props.UserInfo.first_name + ' ' + this.props.UserInfo.last_name}</span>
                </div>   
                <div className="InfoItem">
                    <span className="Key">E-Mail</span>
                    <span className="Value">{this.props.email}</span>
                </div>
                <div className="InfoItem">
                    <span className="Key">Статус</span>
                    <span className="Value">{this.props.isAdmin === 1 ? 'Администратор' : 'Пользователь'}</span>
                </div>   
                <div className="InfoItem">
                    <span className="Key">Пол</span>
                    <span className="Value">{this.props.UserInfo.gender.name}</span>
                </div> 
                <div className="InfoItem">
                    <span className="Key">Возраст</span>
                    <span className="Value">{this.props.UserInfo.age} (<Moment format="DD MMMM YYYY" locale="ru" date={new Date(this.props.UserInfo.date_of_birth)} />)</span>
                </div>  
                <div className="InfoItem">
                    <span className="Key">Дней на сайте</span>
                    <span className="Value">{this.props.days_at_site} (c <Moment format="DD MMMM YYYY" locale="ru" date={new Date(this.props.register_date)} />)</span>
                </div>   
                <div className="InfoItem">
                    <span className="Key">Группы</span>
                    <span className="Value">{this.groups_str}</span>
                </div>         
            </div>
        </div>
      );
    }
  }
  
export default UserInfo;