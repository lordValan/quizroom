import React, { Component } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui';

export default class TableRaiting extends Component {  
    drawCurrentUser(current_user) {
      return (
        <TableRow key={Math.random()} className="CurrentUser" >
          <TableRowColumn>{current_user.pos}</TableRowColumn>
          <TableRowColumn>{current_user.name}</TableRowColumn>
          <TableRowColumn>{current_user.passed}</TableRowColumn>
          <TableRowColumn>{current_user.aver_score_mark}</TableRowColumn>
          <TableRowColumn>{current_user.all_time_sum}</TableRowColumn>
        </TableRow>                
      )
    }

    drawTable() {
      return (
        <Table selectable={false} className="TableRaiting">
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn width="10%">Позиция</TableHeaderColumn>
              <TableHeaderColumn width="30%">Имя</TableHeaderColumn>
              <TableHeaderColumn width="20%">Пройдено</TableHeaderColumn>
              <TableHeaderColumn width="20%">Средняя</TableHeaderColumn>
              <TableHeaderColumn width="20%">Сумма</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.props.table_raiting.first_five.map((result) => {
              return (
                <TableRow key={Math.random()} className={result.is_current_user ? 'CurrentUser' : 'AnotherUser'}>
                  <TableRowColumn width="10%">{result.pos}</TableRowColumn>
                  <TableRowColumn width="30%">{result.name}</TableRowColumn>
                  <TableRowColumn width="20%">{result.passed}</TableRowColumn>
                  <TableRowColumn width="20%">{result.aver_score_mark}</TableRowColumn>
                  <TableRowColumn width="20%">{result.all_time_sum}</TableRowColumn>
                </TableRow>                
              )
            })}
            {this.props.table_raiting.current_user ? this.drawCurrentUser(this.props.table_raiting.current_user) : ''}
          </TableBody>
        </Table>
      );
    }

    render() {        
      return this.drawTable();
    }
}