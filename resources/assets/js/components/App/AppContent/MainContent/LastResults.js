import React, { Component } from 'react';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui';
import { Link } from 'react-router-dom';
import { SecsToTime } from '../../../../utils/AppHelper';
 
export default class LastResults extends Component {  
    drawTable() {
      return (
        <Table selectable={false} className="LastResultsTable">
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Тест</TableHeaderColumn>
              <TableHeaderColumn>Категория</TableHeaderColumn>
              <TableHeaderColumn>Дата</TableHeaderColumn>
              <TableHeaderColumn>Время</TableHeaderColumn>
              <TableHeaderColumn>Оценка</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.props.last_results.map((result) => {
              return (
                <TableRow key={Math.random()}>
                  <TableRowColumn><Link to={'/quizzes/' + result.quiz.slug}>{result.quiz.name}</Link></TableRowColumn>
                  <TableRowColumn>{result.quiz.category.name}</TableRowColumn>
                  <TableRowColumn>{result.pass_date}</TableRowColumn>
                  <TableRowColumn>{SecsToTime(result.time_to_pass)}</TableRowColumn>
                  <TableRowColumn>{result.score} ({result.mark})</TableRowColumn>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      );
    }

    drawEmpty() {
      return <p>Вы не прошли ни одного теста :(</p>
    }

    render() {        
      return this.props.last_results.length > 0 ? this.drawTable() : this.drawEmpty();
    }
}