import React, { Component } from 'react';
import { showCircullarProgress } from '../../../../../utils/AppHelper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, 
          Dialog, IconButton, FlatButton, TextField } from 'material-ui';
import axios from 'axios';
import Pagination from "react-js-pagination";
import { Link } from 'react-router-dom'
import Moment from 'react-moment';
import { Lock as LockIcon, LockOpen as LockOpenIcon, Edit as EditIcon, 
          Close as CloseIcon, Add as AddIcon, Search as SearchIcon } from 'material-ui-icons';

class Groups extends Component {
    constructor(props) {
      super(props);
      this.token = localStorage.getItem('token');
      this.state = { 
        IsLoaded: false,
        alertDialogOpen: false, 
        alertDialogMessage: '',
        removeGroupDialogOpen: false,
        removeGroupDialogMessage: '',
        removeGroupId: -1,
        s: null
      };  
    }

    componentDidMount() {
      axios.get('api/admin/groups', {
        params: {
          'token': this.token,
          's': this.state.s
        }
      })
      .then((response) => {
        if(response.data.access) {
          this.setState( { 
            Access: true,
            IsLoaded: true,
            groupsData: response.data.groupsData, 
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
      axios.get('api/admin/groups', {
        params: {
          'token': this.token,
          'page': page,
          's': this.state.s
        }
      })
      .then((response) => {
        if(response.data.access) {
          this.setState( { 
            Access: true,
            IsLoaded: true,
            groupsData: response.data.groupsData, 
            activePage: parseInt(page)
          } )
        } else {
          this.setState( { 
            Access: false
          } )
        }             
      })
      .catch((error) => {
        this.setState( { 
          Access: false
        } )
      });      
    }

    accessDenied() {
      return <p className="AdminDenied">Просмотр этой страницы запрещен!</p>
    }

    removeGroupHandler(id) {      
      this.setState({
        activePage: 1
      });

      axios.post('api/admin/groups', { 
          '_method': 'DELETE',
          'token': this.token,
          'page': 1,
          'group_id': id,
          's': this.state.s
      })
      .then((response) => {
        if(response.data.access) {
          if(response.data.success) {
            this.setState( { 
              Access: true,
              groupsData: response.data.groupsData,
            } )
            this.showAlertDialog(response.data.message);
          } else {
            this.showAlertDialog(response.data.message);
          }          
        } else {
          this.setState( { 
            Access: false
          } );
          this.showAlertDialog(response.data.message);
        }          
      })
      .catch((error) => {
        this.showAlertDialog(error.message);
      });      
    }

    removeButtonClick(id, name) {
      this.setState({
        removeGroupDialogOpen: true,
        removeGroupDialogMessage: 'Вы уверены, что хотите удалить группу "' + name + '"?',
        removeGroupId: id
      });
    }

    closeRemoveGroupDialog() {
      this.setState({
        removeGroupDialogOpen: false
      });
    }

    closeAlertDialog() {
      this.setState({
        alertDialogOpen: false
      });
    }

    showAlertDialog(message) {
      this.setState({
        removeGroupDialogOpen: false,
        alertDialogOpen: true,
        alertDialogMessage: message
      });
    }

    drawGroupsTable() {
      return (
        <Table selectable={false} className="TableGroupsManagemet">
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn width="10%">Id</TableHeaderColumn>
              <TableHeaderColumn width="20%">Название</TableHeaderColumn>
              <TableHeaderColumn width="20%">Создатель</TableHeaderColumn>
              <TableHeaderColumn width="20%">Дата создания</TableHeaderColumn>
              <TableHeaderColumn width="10%">Участники</TableHeaderColumn>
              <TableHeaderColumn width="20%"></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.groupsData.groups.map((group) => {
              return (
                <TableRow key={group.id} className="TableGroup" >
                  <TableRowColumn width="10%">{group.id}</TableRowColumn>
                  <TableRowColumn width="20%">{group.name}</TableRowColumn>
                  <TableRowColumn width="20%">{group.creator}</TableRowColumn>
                  <TableRowColumn width="20%"><Moment format="DD MMMM YYYY" locale="ru" date={new Date(group.created_at)} /></TableRowColumn>
                  <TableRowColumn width="10%">{group.users.length}</TableRowColumn>
                  <TableRowColumn width="20%">
                    <Link to={'/management/groups/edit/' + group.id}>
                      <IconButton><EditIcon /></IconButton>
                    </Link>
                    <IconButton onClick={() => this.removeButtonClick(group.id, group.name)}><CloseIcon /></IconButton>
                  </TableRowColumn>
                </TableRow>                
              )
            })}
          </TableBody>
        </Table>
      );
    }

    dialogs() {
      const removeGroupDialogActions = (id) => {
        return [
          <FlatButton label="Да" primary={ false } onClick={ () => this.removeGroupHandler(id) } />,
          <FlatButton label="Нет" primary={ true } keyboardFocused={ true } 
                onClick={ this.closeRemoveGroupDialog.bind(this) } />      
        ]
      };

      const alertDialogButton = <FlatButton label="Ok" primary={ false } onClick={ this.closeAlertDialog.bind(this) } />;

      return (
        <div>
          <Dialog title="Вы уверены?" actions={ removeGroupDialogActions(this.state.removeGroupId) } modal={ false } 
            open={ this.state.removeGroupDialogOpen } onRequestClose={ this.closeRemoveGroupDialog.bind(this) }
          >
            { this.state.removeGroupDialogMessage }
          </Dialog>
          <Dialog title="Результат" actions={ alertDialogButton } modal={ false } 
            open={ this.state.alertDialogOpen } onRequestClose={ this.closeAlertDialog.bind(this) }
          >
            { this.state.alertDialogMessage }
          </Dialog> 
        </div>  
      );
    }

    searchHandler() {
      this.setState({
        IsLoaded: false        
      });

      axios.get('api/admin/groups', {
        params: {
          'token': this.token,
          's': this.state.s
        }
      })
      .then((response) => {
        if(response.data.access) {
          this.setState( { 
            Access: true,
            IsLoaded: true,
            groupsData: response.data.groupsData, 
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

    searchFieldBlurHandler(e) {
      const val = e.target.value;

      this.setState({
        s: val.length > 0 ? val : null
      });
    }

    groupsHead() {
      return (
        <div className="AdminGroupsHead">
          <div className="PagePicker">
            <TextField type="text" name="search" placeholder="Название" underlineFocusStyle={{ borderColor: '#0098d4' }} 
                      className="SearchGroupTF" defaultValue={this.state.s ? this.state.s : ''}
                      onBlur={this.searchFieldBlurHandler.bind(this)} />
            <IconButton tooltip="Найти" onClick={this.searchHandler.bind(this)} ><SearchIcon/></IconButton>
          </div>
          <Link to="/management/groups/create">
            <IconButton tooltip="Создать новую группу"><AddIcon /></IconButton>
          </Link>
        </div>
      );
    }

    groupsBody() {
      return (
        <div>
          {this.drawGroupsTable()}
          <Pagination className="Pagination" activePage={this.state.activePage} itemsCountPerPage={this.state.groupsData.page_limit}
            totalItemsCount={this.state.groupsData.totalGroups} pageRangeDisplayed={5} onChange={this.handlePageChange.bind(this)} />
        </div>
      );
    }

    groupsEmpty() {
      return <p>Ничего не найдено!</p>
    }

    groups() {
      return (
        <div className="AdminGroups">          
          {this.dialogs()}
          {this.groupsHead()}
          {this.state.groupsData.groups.length > 0 ? this.groupsBody() : this.groupsEmpty()}
        </div>
      )
    }

    drawComponent() {
      return this.state.Access ? this.groups() : this.accessDenied();
    }

    render() {
      return !this.state.IsLoaded ? showCircullarProgress() : this.drawComponent();
    }
  }
  
export default Groups;