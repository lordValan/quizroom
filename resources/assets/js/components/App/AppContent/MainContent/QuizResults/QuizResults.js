import React, { Component } from 'react';
import { showCircullarProgress, SecsToTime } from '../../../../../utils/AppHelper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, 
          Dialog, IconButton, FlatButton } from 'material-ui';
import axios from 'axios';
import Pagination from "react-js-pagination";
import Moment from 'react-moment';

class QuizResults extends Component {
    constructor(props) {
      super(props);
      this.token = localStorage.getItem('token');
      this.state = { 
        IsLoaded: false,
        results: []
      };  
    }

    componentDidMount() {
      this.slug = this.props.parent_props.match.params.quiz;

      axios.get('api/quizzes/' + this.slug + '/results', {
        params: {
          'token': this.token,
        }
      })
      .then((response) => {
        if(response.data.access) {
          this.setState( { 
            Access: true,
            IsLoaded: true,
            results: response.data.quiz_results, 
            page_limit: response.data.page_limit,
            totalResults: response.data.totalResults,
            quiz_name: response.data.quiz_name,
            activePage: 1
          } )
        } else {
          this.setState( { 
            Access: false,
            IsLoaded: true
          } )
        }             
      })
      .catch((error) => {
        this.setState( { 
          Access: false,
          IsLoaded: true
        } )
      });
    } 

    handlePageChange(page) {      
      axios.get('api/quizzes/' + this.slug + '/results', {
        params: {
          'token': this.token,
          'curr_page': parseInt(page)
        }
      })
      .then((response) => {
        if(response.data.access) {
          this.setState( { 
            Access: true,
            IsLoaded: true,
            results: response.data.quiz_results, 
            page_limit: response.data.page_limit,
            totalResults: response.data.totalResults,
            quiz_name: response.data.quiz_name,
            activePage: parseInt(page)
          } )
        } else {
          this.setState( { 
            Access: false,
            IsLoaded: true
          } )
        }             
      })
      .catch((error) => {
        this.setState( { 
          Access: false,
          IsLoaded: true
        } )
      }); 
    }

    accessDenied() {
      return <p className="AdminDenied">Просмотр этой страницы запрещен!</p>
    }

    drawResultsTable() {
      return (
        <Table selectable={false} className="TableResultsManagemet">
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn width="35%">Имя</TableHeaderColumn>
              <TableHeaderColumn width="15%">Результат</TableHeaderColumn>
              <TableHeaderColumn width="25%">Время</TableHeaderColumn>
              <TableHeaderColumn width="25%">Дата прохождения</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.results.map((result) => {
              return (
                <TableRow key={Math.random()} className="TablResult" >
                  <TableRowColumn width="35%">{result.user.name}</TableRowColumn>  
                  <TableRowColumn width="15%">{result.score} ({result.mark})</TableRowColumn>    
                  <TableRowColumn width="25%">{SecsToTime(result.time_to_pass)}</TableRowColumn>             
                  <TableRowColumn width="25%"><Moment format="DD MMMM YYYY" locale="ru" date={new Date(result.pass_date)} /></TableRowColumn>
                </TableRow>                
              )
            })}
          </TableBody>
        </Table>
      );
    }  
    
    resultsBody() {
      return (
        <div>
          {this.drawResultsTable()}
          {<Pagination className="Pagination" activePage={this.state.activePage} itemsCountPerPage={this.state.page_limit}
            totalItemsCount={this.state.totalResults} pageRangeDisplayed={5} onChange={this.handlePageChange.bind(this)} />}
        </div>
      );
    }

    resultsEmpty() {
      return (
        <p>Тест еще не был пройден</p>
      );
    }

    results() {
      return (
        <div className="AdminResults"> 
          <h1>{this.state.quiz_name}</h1>
          {this.state.results.length > 0 ? this.resultsBody() : this.resultsEmpty()}
        </div>
      )
    }

    drawComponent() {
      return this.state.Access ? this.results() : this.accessDenied();
    }

    render() {
      return !this.state.IsLoaded ? showCircullarProgress() : this.drawComponent();
    }
  }
  
export default QuizResults;