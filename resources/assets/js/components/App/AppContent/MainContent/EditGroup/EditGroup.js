import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn,
            Dialog, IconButton, TextField, RaisedButton, FlatButton } from 'material-ui';
import Pagination from 'react-js-pagination';
import { Search as SearchIcon, SentimentDissatisfied as SentimentDissatisfiedIcon, 
            SentimentSatisfied as SentimentSatisfiedIcon } from 'material-ui-icons';
import { showCircullarProgress } from '../../../../../utils/AppHelper';
import axios from 'axios';

class EditGroup extends Component {
    constructor(props) {
        super(props);
        this.token = localStorage.getItem('token');
        this.state = {
            'users': this.props.users,
            'group': this.props.group,
            'alertDialogOpen': false, 
            'alertDialogMessage': '',
            's': null,
            isLoaded: false
        };
    }

    componentDidMount() {
        axios.get('api/admin/users', {
            params: {
              'token': this.token
            }
          })
          .then((response) => {
            if(!response.data.access) {
                return;
            }

            this.setState( { 
                isLoaded: true, 
                users: response.data.users,
                page_limit: response.data.page_limit,
                totalUsers: response.data.totalUsers,
                totalAllUsers: response.data.totalAllUsers
            } );
        })
    }

    isSelected(index) {
        return this.state.group.users.indexOf(index) !== -1;
    };
    
    handleRowSelection(selectedRow) {
        let group = JSON.parse(JSON.stringify(this.state.group));

        if(this.isSelected(selectedRow)) {
            let index = this.state.group.users.indexOf(selectedRow);
            group.users.splice(index, 1);
        } else {
            group.users.push(selectedRow);
        }

        this.setState({
          'group': group
        });
    }; 
    
    drawTFEditor() {
        return (
            <div className="EditGroupTFEditor">
                <TextField hintText="Название" floatingLabelText="Название" 
                      type="text" required={true} underlineFocusStyle={{ borderColor: '#0098d4' }} 
                      floatingLabelFocusStyle={{ color: '#0098d4' }}
                      defaultValue={this.state.group.name}
                      onBlur={this.nameGroupBlurHandler.bind(this) } />
            </div>
        );
    }

    nameGroupBlurHandler(e) {
        let group = JSON.parse(JSON.stringify(this.state.group));
        group.name = e.target.value;

        this.setState({group: group});
    }

    drawTable() {
        return (
            <Table selectable={false} className="TableEditGroupManagemet">
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn width="10%">Id</TableHeaderColumn>
                  <TableHeaderColumn width="40%">Имя</TableHeaderColumn>
                  <TableHeaderColumn width="40%">Email</TableHeaderColumn>
                  <TableHeaderColumn width="10%">Выбран</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
              {this.state.users.map((user) => {
                  const IsSel = this.isSelected(user.id);
                  return (
                    <TableRow selectable={false} className={IsSel ? 'selected' : 'normal'} key={user.id}
                            onClick={() => { this.handleRowSelection(user.id) } } >
                        <TableRowColumn width="10%">{user.id}</TableRowColumn>
                        <TableRowColumn width="40%">{user.name}</TableRowColumn>
                        <TableRowColumn width="40%">{user.email}</TableRowColumn>
                        <TableRowColumn width="10%">
                            { IsSel ? <SentimentSatisfiedIcon /> : <SentimentDissatisfiedIcon /> }
                        </TableRowColumn>
                    </TableRow> 
                  );
              })}                               
              </TableBody>
            </Table>
        );
    }

    handlePageChange(page) {      
        axios.get('api/admin/users', {
          params: {
            'token': this.token,
            'page': page,
            's': this.state.s
          }
        })
        .then((response) => {
            this.setState( { 
                users: response.data.users, 
                activePage: parseInt(page)
            } )          
        })
        .catch((error) => {
          
        });      
    }

    searchHandler() {
        this.setState({
          IsLoaded: false        
        });
  
        axios.get('api/admin/users', {
            params: {
              'token': this.token,
              'page': 1,
              's': this.state.s
            }
          })
          .then((response) => {
              this.setState( { 
                  users: response.data.users, 
                  activePage: 1,
                  totalUsers: response.data.totalUsers
              } )          
          })
          .catch((error) => {
            
          });     
    }

    searchFieldBlurHandler(e) {
        const val = e.target.value;
  
        this.setState({
          s: val.length > 0 ? val : null
        });
    }

    drawHead() {
        return (
            <div className="AdminUsersHead">
                <p className="UsersChosenInfo">Выбрано {this.state.group.users.length}/{this.state.totalAllUsers}</p>
                <div className="UserPicker">
                    <TextField type="text" name="search" placeholder="Имя" underlineFocusStyle={{ borderColor: '#0098d4' }} 
                            className="SearchUserTF" defaultValue={this.state.s ? this.state.s : ''}
                            onBlur={this.searchFieldBlurHandler.bind(this)} />
                    <IconButton tooltip="Найти" onClick={this.searchHandler.bind(this)} ><SearchIcon/></IconButton>
                </div>
            </div>
        )
    }

    dialogs() {  
        const alertDialogButton = <FlatButton label="Ok" primary={ false } onClick={ this.closeAlertDialog.bind(this) } />;
  
        return (
          <div>
            <Dialog title="Результат" actions={ alertDialogButton } modal={ false } 
              open={ this.state.alertDialogOpen } onRequestClose={ this.closeAlertDialog.bind(this) }
            >
              { this.state.alertDialogMessage }
            </Dialog> 
          </div>  
        );
    }

    closeAlertDialog() {
        this.setState({
          alertDialogOpen: false
        });
    }
  
    showAlertDialog(message) {
        this.setState({
          alertDialogOpen: true,
          alertDialogMessage: message
        });
    }

    saveGroup() {
        if(this.state.group.name.trim().length <= 0) {
            this.showAlertDialog('Не выбрано имя!');
            return;
        }

        if(this.state.group.users.length <= 0) {
            this.showAlertDialog('Не выбрано ни одного пользователя!');
            return;
        }

        this.setState({isLoaded: false});

        axios.post(this.props.finishRoute, { 
            'token': this.token,
            'group': this.state.group
        })
        .then((response) => {
            this.setState({isLoaded: true});
          if(response.data.success) {
            this.props.history.push('/management/groups');            
          } else {            
            this.showAlertDialog(response.data.error);
          }          
        })
        .catch((error) => {
            this.setState({isLoaded: true});
            this.showAlertDialog(error.message);
        });    
    }
    
    drawComponent() {
        return (
            <div className="EditGroupAdmin">
                {this.dialogs()}
                {this.drawTFEditor()}
                {this.drawHead()}
                {this.drawTable()}
                <Pagination className="Pagination" activePage={this.state.activePage} itemsCountPerPage={this.state.page_limit}
                    totalItemsCount={this.state.totalUsers} pageRangeDisplayed={5} onChange={this.handlePageChange.bind(this)} />
                <div className="buttonContainer">
                    <RaisedButton label="Сохранить" className="BtSave" primary={true}
                        onClick={ this.saveGroup.bind(this) } />
                </div>
            </div>
        );
    }

    render() {
        return this.state.isLoaded ? this.drawComponent() : showCircullarProgress();   
    }
}

export default withRouter(EditGroup);