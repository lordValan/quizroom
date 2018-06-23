import React, { Component } from 'react';
import { showCircullarProgress } from '../../../../../utils/AppHelper';
import { SortItems } from '../../../../../utils/AppSettings';
import axios from 'axios';
import { SelectField, MenuItem, IconButton }  from 'material-ui';
import { Search as SearchIcon } from 'material-ui-icons';


class QuizFilter extends Component {
    constructor(props) {
      super(props);

      this.state = { IsLoaded: false };
    }

    componentDidMount() {
        let token = localStorage.getItem('token');
  
        axios.get('api/categories', {
          params: {
            'token': token
          }
        })
        .then((response) => {
          this.setState( { IsLoaded: true, categories: response.data } );          
        })
        .catch((error) => {
          console.log(error);
        });
    } 

    categoryItems(values) {
        return this.state.categories.map((category) => (
          <MenuItem
            key={category.id}
            insetChildren={true}
            checked={values && values.indexOf(category.id) > -1}
            value={category.id}
            primaryText={category.name}
          />
        ));
    }   

    sortItems() {
        return SortItems.map((item) => (
          <MenuItem
            key={item.Id}            
            value={item.Id}
            primaryText={item.Value}
          />
        ));
    }   

    renderComponent() {
        return (
            <div className="QuizFilter">
                <SelectField multiple={true} hintText="Выберите категорию" value={this.props.chosenFilterCategories} 
                            onChange={this.props.choseFilterCategoryHandler} autoWidth={true} className="FilterSelect"
                            selectedMenuItemStyle={{color: '#0098d4'}} maxHeight={200}>
                    {this.categoryItems(this.props.chosenFilterCategories)}
                </SelectField>
                <SelectField hintText="Сортировать" value={this.props.chosenSortItem} 
                            onChange={this.props.choseSortItemHandler} autoWidth={true} className="FilterSelect"
                            selectedMenuItemStyle={{color: '#0098d4'}}>
                    {this.sortItems()}
                </SelectField>
                <IconButton tooltip="Искать" onClick={this.props.filterSubmit} ><SearchIcon/></IconButton>
            </div>
        );
    }

    drawQuizFilter() {
        return this.state.IsLoaded ? this.renderComponent() : showCircullarProgress();
    }

    render() {
      return this.drawQuizFilter();
    }
  }
  
export default QuizFilter;