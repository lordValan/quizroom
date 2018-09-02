import React, { Component } from 'react';
import { showCircullarProgress } from '../../../../../utils/AppHelper';
import axios from 'axios';
import QuizBlock from './QuizBlock';
import QuizFilter from './QuizFilter';
import Pagination from "react-js-pagination";

class Quizzes extends Component {
    constructor(props) {
      super(props);
      this.token = localStorage.getItem('token');
      this.state = { IsLoaded: false, chosenFilterCategories: [], chosenSortItem: '', IsQuizzesLoading: false, s: null };
    }

    componentDidMount() {
      axios.get(this.props.route, {
        params: {
          'token': this.token,
          'page': 1,
          's': this.state.s
        }
      })
      .then((response) => {
        this.setState( { IsLoaded: true, quizzes: response.data.quizzes, activePage: 1, totalQuizzes: response.data.totalQuizzes, page_limit: response.data.page_limit } );        
      })
      .catch((error) => {
        console.log(error);
      });
    } 

    filterCategoryChoseHandler(event, index, values) {
      this.setState({chosenFilterCategories: values});
    }

    sortItemChoseHandler(event, index, value) {
      this.setState({chosenSortItem: value});
    }

    filterSubmit() {
      this.setState({ IsQuizzesLoading: true });

      axios.get(this.props.route, {
        params: {
          'token': this.token,
          'filterCats': this.state.chosenFilterCategories,
          'sortItem': this.state.chosenSortItem,
          's': this.state.s,
          'page': 1
        }
      })
      .then((response) => {
        this.setState({ IsQuizzesLoading: false, quizzes: response.data.quizzes, activePage: 1, totalQuizzes: response.data.totalQuizzes, page_limit: response.data.page_limit });      
      })
      .catch((error) => {
        console.log(error);
      });
    }

    drawQuizzes() {
      return this.state.quizzes.map((quiz, index) => {
        return <QuizBlock key={quiz.id} quiz={quiz} />
      });  
    }

    handlePageChange(page) {
      axios.get(this.props.route, {
        params: {
          'token': this.token,
          'filterCats': this.state.chosenFilterCategories,
          'sortItem': this.state.chosenSortItem,
          's': this.state.s,
          'page': page
        }
      })
      .then((response) => {
        this.setState({ quizzes: response.data.quizzes, activePage: page, totalQuizzes: response.data.totalQuizzes, page_limit: response.data.page_limit });      
      })
      .catch((error) => {
        console.log(error);
      });
    }

    quizzesPart() {
      return (
          <div className="Quizzes">      
              { this.state.IsQuizzesLoading ? showCircullarProgress() : this.drawQuizzes() }
              <Pagination className="Pagination" activePage={this.state.activePage} itemsCountPerPage={this.state.page_limit}
                totalItemsCount={this.state.totalQuizzes} pageRangeDisplayed={5} onChange={this.handlePageChange.bind(this)}
              />
          </div>
      );
    }

    searchFieldBlurHandler(e) {
      const val = e.target.value;

      this.setState({
        s: val.length > 0 ? val : null
      });
    }

    drawComponent() {
      return ( <div>
          <QuizFilter chosenFilterCategories={this.state.chosenFilterCategories} 
                      choseFilterCategoryHandler={this.filterCategoryChoseHandler.bind(this)}
                      choseSortItemHandler={this.sortItemChoseHandler.bind(this)}
                      chosenSortItem={this.state.chosenSortItem} 
                      filterSubmit={this.filterSubmit.bind(this)}
                      s={this.state.s}
                      searchFieldBlurHandler={this.searchFieldBlurHandler.bind(this)} />
          { this.state.totalQuizzes > 0 ? this.quizzesPart() : <p>{this.props.emptyMessage}</p> }
        </div>   
      );
    }

    render() {
      return !this.state.IsLoaded ? showCircullarProgress() : this.drawComponent();
    }
  }
  
export default Quizzes;