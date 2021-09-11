import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@material-ui/core';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import NoteListHead from 'src/components/_dashboard/note/NoteListHead';
import NoteListToolbar from 'src/components/_dashboard/note/NoteListToolbar';
import NoteMoreMenu from 'src/components/_dashboard/note/NoteMoreMenu';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { Grid } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import React from 'react';
import CallAPI from './../services/CallAPI';
import { ToastContainer, toast } from 'react-toastify';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import * as Config from '../constants/config'


const TABLE_HEAD = [
  { id: 'stt', label: 'STT', alignRight: false },
  { id: 'username', label: 'Username', alignRight: false },
  { id: 'name', label: 'Tên nhân viên', alignRight: false },
  { id: 'description', label: 'Ghi chú', alignRight: false },
  { id: 'dateTime', label: 'Ngày', alignRight: false }

];
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.users_permissions_user.username.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Note() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);




  const [notesInput, setNotesInput] = useState({
    id: '',
    description: '',
    users_permissions_user: '',




  });


  const onChange = (e) => {
    setNotesInput(
      { ...notesInput, [e.target.name]: e.target.value });
  }




 
  const [openSignUp, setOpenSignUp] = React.useState(false);

  const handleClickOpenSignUp = () => {
    
    setOpenSignUp(true);
    getEmployees();
  };




  const handleCloseSignUp = () => {

    setOpenSignUp(false);



  };


  const onSubmitSignUp = (e) => {
    e.preventDefault();

    handleCloseSignUp();

    CallAPI('/notes', 'POST',
    {
      "description": notesInput.description,
      "date": chooseDatetime,
      "users_permissions_user":chooseEmployee
    }




    , localStorage.getItem('jwt')).then(res => {
      if (res.status === 200) {
        toast.success('🦄 Tạo ghi chú thành công!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setTimeout(() => {
          getNotes()
        }, 1000)
      }





    }).catch(err => {
      console.log('inside catch block.');
      if (err.response) {

        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        console.log(err.response.data.m);
      } else if (err.request) {
        console.log(err.request);
      } else {


        toast.error('Tạo ghi chú thất bại!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      console.log(JSON.stringify(err));
    });





  }


  const [notes, setNotes] = useState([]);

  function getNotes() {
    axios.get(`${Config.API_URL}/notes?&_sort=date:DESC`, {
      'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }

    }).then(res => {
      setNotes(res.data)
    })


  }

  useEffect(() => {
    getNotes();

  }, []);




  const [employees,setEmployees] = useState([]);

  function getEmployees(){
    axios.get(`${Config.API_URL}/users`,{
      'headers': {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}

    }).then(res=>{
      setEmployees(res.data)
    })


  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = notes.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // const handleClick = (event, name) => {
  //   const selectedIndex = selected.indexOf(name);
  //   let newSelected = [];
  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, name);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1)
  //     );
  //   }
  //   setSelected(newSelected);
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - notes.length) : 0;

  const filteredUsers = applySortFilter(notes, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;


  const converDateTimeFormat = (dateTime) => {
    var d = new Date(dateTime);
    var date = d.toLocaleDateString();
    var time = d.toLocaleTimeString();

    return date + ' ' + time




  }



  

  const [chooseEmployee, setChooseEmployee] = React.useState('');
  const handleChooseEmployee = (event) => {
    setChooseEmployee(event.target.value);
  };

  const [chooseDatetime, setChooseDatetime] = React.useState('');
  const handleChooseDatetime = (event) => {
    setChooseDatetime(event.target.value);
  };
  return (
    <Page title="Ghi Chú |  Kim Long Tài">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh Sách Ghi Chú
          </Typography>
          <Button onClick={handleClickOpenSignUp}
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
          >
            Tạo ghi chú
          </Button>
          <Dialog
            open={openSignUp}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseSignUp}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">{"Tạo thông tin ghi chú"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Hành động này sẽ khởi tạo một ghi chú kèm với một nhân viên
              </DialogContentText>
              <Container maxWidth="xl">
              <form>
                <Grid container spacing={3}>


                    <Grid item xs={12} md={12} lg={12}>
                    <h4>Nhân viên cần ghi chú(*)</h4>
                    <Select fullWidth
                              displayEmpty
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={chooseEmployee}
                              onChange={handleChooseEmployee}
                              defaultValue='Geasoas'
                            >
                                {employees.map( (e) => {
                                    if(e.nameStore!=='VIP'){
                                      return <MenuItem key={e.id} value={e.id}>{e.username + ' ' + e.firstName}</MenuItem>


                                    }
                                        return null;
                                })}

                             
                         
                            </Select>
                      <TextField name="description" margin="normal" id="standard-basic" fullWidth label="Ghi chú" value={notesInput.description} onChange={onChange} />


                    </Grid>
                    
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12}>
                                  <br></br>
                    <TextField
                    fullWidth
                      id="datetime-local"
                      label="Chọn Ngày/Thời gian"
                      type="datetime-local"
                      value={chooseDatetime}
                      onChange={handleChooseDatetime}
                      
                      InputLabelProps={{
                        shrink: true,
                      }}
                     
                    />
                  </Grid>

                </form>
              </Container>



            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSignUp} color="primary">
                Hủy bỏ
              </Button>
              <Button onClick={onSubmitSignUp} color="primary">
                Tạo ghi chú
              </Button>
            </DialogActions>
          </Dialog>








        </Stack>

        <Card>
          <NoteListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <NoteListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={notes.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row,stt=0) => {
                      const { id, description, date, users_permissions_user } = row;
                      const isItemSelected = selected.indexOf(id) !== -1;

                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          {/* <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, id)}
                            />
                          </TableCell> */}
                          <TableCell align="left">{++stt}</TableCell>
                          <TableCell align="left">{users_permissions_user.username}</TableCell>
                          <TableCell align="left">{users_permissions_user.firstName + ' ' + users_permissions_user.lastName}</TableCell>
                          <TableCell align="left">{description}</TableCell>

                          <TableCell align="left">{converDateTimeFormat(date)}</TableCell>


                          <TableCell align="right">
                            <NoteMoreMenu updateNotes={() => getNotes()} idNotes={id} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={notes.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Page>
  );
}
