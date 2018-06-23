import React, { Component } from 'react';

export default class MainActivityInfo extends React.Component {  
    render() {        
      return (
        <div className="MainActivityInfo">
          <div className="InfoItem">
            <h3>{this.props.tests_count}</h3>
            <p>Тестов пройдено</p>
          </div>
          <div className="InfoItem">
            <h3>{this.props.aver_score}/100</h3>
            <p>Средний бал</p>
          </div>
          <div className="InfoItem">
            <h3>{this.props.aver_mark}</h3>
            <p>Средняя оценка</p>
          </div>
          <div className="InfoItem">
            <h3>{this.props.score_sum}</h3>
            <p>Сумма баллов</p>
          </div>
          <div className="InfoItem">
            <h3>{this.props.aver_time}</h3>
            <p>Среднее время</p>
          </div>
          <div className="InfoItem">
            <h3>{this.props.pos_raiting}/{this.props.all_users_amount}</h3>
            <p>Позиция в рейтинге</p>
          </div>
        </div>
      )
    }
}