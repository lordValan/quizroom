import React, { Component } from 'react';
import { showCircullarProgress } from '../../../../../utils/AppHelper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, 
          Dialog, IconButton, FlatButton, TextField } from 'material-ui';
import axios from 'axios';
import Pagination from "react-js-pagination";
import { imagesUrl } from '../../../../../utils/AppHelper';
import { Link } from 'react-router-dom'
import Moment from 'react-moment';
import { Lock as LockIcon, LockOpen as LockOpenIcon, Edit as EditIcon, 
          Close as CloseIcon, Add as AddIcon, Search as SearchIcon } from 'material-ui-icons';

class Management extends Component {
    constructor(props) {
      super(props);
      this.token = localStorage.getItem('token');
      this.state = { 
        IsLoaded: false,
        alertDialogOpen: false, 
        alertDialogMessage: '',
        removeQuizDialogOpen: false,
        removeQuizDialogMessage: '',
        removeQuizId: -1
      };  
      
      this.page_num = React.createRef();
    }

    componentDidMount() {
      axios.get('api/admin/quizzes', {
        params: {
          'token': this.token,
        }
      })
      .then((response) => {
        if(response.data.access) {
          this.setState( { 
            Access: true,
            IsLoaded: true,
            quizzesData: response.data.data, 
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
      axios.get('api/admin/quizzes', {
        params: {
          'token': this.token,
          'page': page
        }
      })
      .then((response) => {
        if(response.data.access) {
          this.setState( { 
            Access: true,
            IsLoaded: true,
            quizzesData: response.data.data, 
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

    removeQuizHandler(id) {
      axios.post('api/admin/quizzes', { 
          '_method': 'DELETE',
          'token': this.token,
          'page': this.state.activePage,
          'quiz_id': id
      })
      .then((response) => {
        if(response.data.access) {
          if(response.data.success) {
            this.setState( { 
              Access: true,
              quizzesData: response.data.data
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
        removeQuizDialogOpen: true,
        removeQuizDialogMessage: 'Вы уверены, что хотите удалить тест "' + name + '"?',
        removeQuizId: id
      });
    }

    closeRemoveQuizDialog() {
      this.setState({
        removeQuizDialogOpen: false
      });
    }

    closeAlertDialog() {
      this.setState({
        alertDialogOpen: false
      });
    }

    showAlertDialog(message) {
      this.setState({
        removeQuizDialogOpen: false,
        alertDialogOpen: true,
        alertDialogMessage: message
      });
    }

    drawQuizzesTable() {
      return (
        <Table selectable={false} className="TableQuizzesManagemet">
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn width="10%">Id</TableHeaderColumn>
              <TableHeaderColumn width="20%">Название</TableHeaderColumn>
              <TableHeaderColumn width="15%">Автор</TableHeaderColumn>
              <TableHeaderColumn width="10%">Статус</TableHeaderColumn>
              <TableHeaderColumn width="20%">Дата создания</TableHeaderColumn>
              <TableHeaderColumn width="10%">Пройден</TableHeaderColumn>
              <TableHeaderColumn width="15%"></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.state.quizzesData.quizzes.map((quiz) => {
              return (
                <TableRow key={quiz.id} className="TableQuiz" >
                  <TableRowColumn width="10%">{quiz.id}</TableRowColumn>
                  <TableRowColumn width="20%"><Link to={'/quizzes/' + quiz.slug}>{quiz.name}</Link></TableRowColumn>
                  <TableRowColumn width="15%">{quiz.author}</TableRowColumn>
                  <TableRowColumn width="10%">{!quiz.private ? <LockOpenIcon /> : <LockIcon />}</TableRowColumn>
                  <TableRowColumn width="20%"><Moment format="DD MMMM YYYY" locale="ru" date={new Date(quiz.created_at)} /></TableRowColumn>
                  <TableRowColumn width="10%">{quiz.passed}</TableRowColumn>
                  <TableRowColumn width="15%">
                    <Link to={'/management/edit/' + quiz.slug}>
                      <IconButton><EditIcon /></IconButton>
                    </Link>
                    <IconButton onClick={() => this.removeButtonClick(quiz.id, quiz.name)}><CloseIcon /></IconButton>
                  </TableRowColumn>
                </TableRow>                
              )
            })}
          </TableBody>
        </Table>
      );
    }

    dialogs() {
      const removeQuizDialogActions = (id) => {
        return [
          <FlatButton label="Да" primary={ false } onClick={ () => this.removeQuizHandler(id) } />,
          <FlatButton label="Нет" primary={ true } keyboardFocused={ true } 
                onClick={ this.closeRemoveQuizDialog.bind(this) } />      
        ]
      };

      const alertDialogButton = <FlatButton label="Ok" primary={ false } onClick={ this.closeAlertDialog.bind(this) } />;

      return (
        <div>
          <Dialog title="Вы уверены?" actions={ removeQuizDialogActions(this.state.removeQuizId) } modal={ false } 
            open={ this.state.removeQuizDialogOpen } onRequestClose={ this.closeRemoveQuizDialog.bind(this) }
          >
            { this.state.removeQuizDialogMessage }
          </Dialog>
          <Dialog title="Результат" actions={ alertDialogButton } modal={ false } 
            open={ this.state.alertDialogOpen } onRequestClose={ this.closeAlertDialog.bind(this) }
          >
            { this.state.alertDialogMessage }
          </Dialog> 
        </div>  
      );
    }

    searchPageHandler() {
      this.handlePageChange(this.page_num.current.input.value);
      console.log(this.state.activePage);
    }

    quizzesHead() {
      return (
        <div className="AdminQuizzesHead">
          <div className="PagePicker">
            <span className="Page">Страница </span>
            <TextField type="number" name="page_num" min="1" max="1000" defaultValue="1" underlineFocusStyle={{ borderColor: '#0098d4' }} 
                      floatingLabelFocusStyle={{ color: '#0098d4' }} className="PageNumTF" 
                      ref={this.page_num} />
            <IconButton tooltip="Перейти" onClick={this.searchPageHandler.bind(this)} ><SearchIcon/></IconButton>
          </div>
          <Link to="management/create">
            <IconButton tooltip="Создать новый тест"><AddIcon /></IconButton>
          </Link>
        </div>
      );
    }

    quizzes() {
      return (
        <div className="AdminQuizzes">          
          {this.dialogs()}
          {this.quizzesHead()}
          {this.drawQuizzesTable()}
          <Pagination className="Pagination" activePage={this.state.activePage} itemsCountPerPage={this.state.quizzesData.page_limit}
            totalItemsCount={this.state.quizzesData.totalQuizzes} pageRangeDisplayed={5} onChange={this.handlePageChange.bind(this)} />
        </div>
      )
    }

    drawComponent() {
      return this.state.Access ? this.quizzes() : this.accessDenied();
    }

    render() {
      return !this.state.IsLoaded ? showCircullarProgress() : this.drawComponent();
    }
  }
  
export default Management;