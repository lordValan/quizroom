import React, { Component } from 'react';
import MainContentInfoBlock from './MainContentInfoBlock';
import ChartActivities from './MainContent/ChartActivities';
import { showCircullarProgress } from '../../../utils/AppHelper';
import LastResults from './MainContent/LastResults';
import MainActivityInfo from './MainContent/MainActivityInfo';
import TableRaiting from './MainContent/TableRaiting';
import UserInfo from './MainContent/UserInfo';
import axios from 'axios';
import faker from 'faker/locale/ru';

class MainContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            IsLoaded: false,
            UserData: []
        }; 
    }

    componentDidMount() {
        let token = localStorage.getItem('token');
        
        axios.get('/api/user', {
          params: {
            'token': token
          }
        })
        .then((response) => {
          this.setState( { IsLoaded: true, UserData: response.data } );
        })
        .catch((error) => {
            
        });
    } 

    drawComponent() {
        return (
            <div className={ this.props.className ? this.props.className : "MainContent" }>
                <MainContentInfoBlock Title="Информация" Content={<UserInfo 
                                        UserInfo={this.state.UserData.info}
                                        email={this.state.UserData.email}
                                        days_at_site={this.state.UserData.days_at_site}
                                        groups={this.state.UserData.groups} 
                                        register_date={this.state.UserData.register_date} 
                                        isAdmin={this.state.UserData.admin} />}                                         
                                        BgColor="#f9ffdb" /> 
                <MainContentInfoBlock Title="Статистика" Content={<MainActivityInfo 
                                        tests_count={this.state.UserData.passed_tests_count}
                                        aver_score={this.state.UserData.all_time_average_score}
                                        aver_mark={this.state.UserData.all_time_average_mark}
                                        score_sum={this.state.UserData.all_time_sum}
                                        aver_time={this.state.UserData.all_time_average_pass_time}
                                        pos_raiting={this.state.UserData.table_position} 
                                        all_users_amount={this.state.UserData.all_users_amount} />} BgColor="#F4F3F2" />  
                <MainContentInfoBlock Title="Последние результаты" 
                                        Content={<LastResults last_results={this.state.UserData.last_five_results} />} 
                                        BgColor="#E1F1ED" /> 
                <MainContentInfoBlock Title="Активность" 
                                        Content={<ChartActivities 
                                            tests_count={this.state.UserData.passed_tests_count}
                                            category_data={this.state.UserData.passed_count_and_average_by_category}
                                            month_data={this.state.UserData.average_and_passed_by_last_five_months} />} 
                                        BgColor="#fff6db" /> 
                <MainContentInfoBlock Title="Рейтинг" Content={<TableRaiting 
                                            table_raiting={this.state.UserData.table_raiting}/>} BgColor="#dbf0ff" />              
            </div>
        );   
    }

    render() {
           return this.state.IsLoaded ? this.drawComponent() : showCircullarProgress(); 
    }
}

export default MainContent;