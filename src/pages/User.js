import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
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
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
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
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/styles';
import * as Config from '../constants/config'



const TABLE_HEAD = [
  { id: 'stt', label: 'STT', alignRight: false },
  { id: 'username', label: 'Username', alignRight: false },
  { id: 'firstName&lastName', label: 'Họ Tên', alignRight: false },
  { id: 'dob', label: 'Ngày Sinh', alignRight: false },
  { id: 'phone', label: 'Điện thoại', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'store', label: 'Cửa hàng', alignRight: false },
  { id: 'statusCodeEmployee', label: 'Trình trạng', alignRight: false },
  { id: 'role', label: 'Vai trò', alignRight: false },

];
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  formControl: {
    
    minWidth: 240,
    marginTop:10
  },
}));
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
    return filter(array, (_user) => _user.username.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function User() {
 
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [alertValidate, setAlertValidate] = useState('');




  const [user, setUser] = useState({
    id: '',
    email: '',
    username: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    cmndcccd: '',
    password: '',
    rePassword: '',
    statusCodeEmployee: '',
    dob:'',



    role: ''
  });
  const onChange = (e) => {
    setUser(
      { ...user, [e.target.name]: e.target.value });
  }

  const [chooseStore, setChooseStore] = React.useState('');
  const handleChooseStore = (event) => {
    setChooseStore(event.target.value);
  };


  //Edit employee
  const [openSignUp, setOpenSignUp] = React.useState(false);

  const handleClickOpenSignUp = () => {

    setOpenSignUp(true);
    getStores()
  };




  const handleCloseSignUp = () => {

    setOpenSignUp(false);



  };


  const onSubmitSignUp = (e) => {
    e.preventDefault();
    if (user.password === user.rePassword) {
      handleCloseSignUp();
      CallAPI('/auth/local/register', 'POST',
        {
          "username": user.username,
          "firstName": user.firstName,
          "lastName": user.lastName,
          "dob":user.dob,
          "phone": user.phone,
          "cmndcccd": user.cmndcccd,
          "email": user.email,
          "address": user.address,
          "password": user.password,
          "store":chooseStore
        }



        , localStorage.getItem('jwt')).then(res => {
          if (res.status === 200) {
            toast.success('🦄 Tạo nhân viên thành công!', {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

            setTimeout(() => {
              getEmployee()
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


            toast.error('Tạo nhân viên thất bại! Kiểm tra lại!', {
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
    else {

      setAlertValidate('Kiểm tra lại mật khẩu!')


    }
  }
  const [stores, setStores] = useState([]);

  const [employees, setEmployees] = useState([]);

  function getEmployee() {
    axios.get(`${Config.API_URL}/users`, {
      'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }

    }).then(res => {
      setEmployees(res.data);
    })


  }


  function getStores() {
    axios.get(`${Config.API_URL}/stores`, {
      'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }

    }).then(res => {
      setStores(res.data)
    })


  }

  useEffect(() => {
    getEmployee();

  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = employees.map((n) => n.name);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employees.length) : 0;

  const filteredUsers = applySortFilter(employees, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;


  const formatDateFrame = (date) => {
    var d = new Date(date);
    var n = d.toLocaleDateString();

    return n
  }
  const handleClickStatusChangeFalse = (id) => {
    CallAPI(`/users/${id}`, 'PUT',
      {
        "blocked": true,
      }



      , localStorage.getItem('jwt')).then(res => {
        if (res.status === 200) {
          toast.success('🦄 Cật nhật thành công', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });


        }
        setTimeout(() => {

          getEmployee();
        }, 1000)





      }).catch(err => {
        console.log('inside catch block.');
        if (err.response) {

          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else if (err.request) {
          console.log(err.request);
        } else {

          console.log('Error', err.message);
          toast.error('Lỗi! Cật nhật thất bại!', {
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


  };
  const classes = useStyles();

  const handleClickStatusChangeTrue = (id) => {


    CallAPI(`/users/${id}`, 'PUT',
      {
        "blocked": false,
      }



      , localStorage.getItem('jwt')).then(res => {
        if (res.status === 200) {
          toast.success('🦄 Cật nhật thành công', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });


        }
        setTimeout(() => {

          getEmployee();
        }, 1000)





      }).catch(err => {
        console.log('inside catch block.');
        if (err.response) {

          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else if (err.request) {
          console.log(err.request);
        } else {

          console.log('Error', err.message);
          toast.error('Lỗi! Cật nhật thất bại!', {
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




  };

  return (
    <Page title="User |  Kim Long Tài">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh Sách Nhân Viên
          </Typography>
          <Button onClick={handleClickOpenSignUp}
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
          >
            Tạo thông tin nhân viên
          </Button>
          <Dialog
            open={openSignUp}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseSignUp}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">{"Đăng ký thông tin nhân viên      "}<span style={{ color: 'red' }}>    {alertValidate}</span></DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Hành động này sẽ khởi tạo một nhân viên mới
              </DialogContentText>
              <Container maxWidth="lg">
                <br></br>
                <form>
                  <Grid container spacing={3}>

                  <TextField required name="username" margin="normal" id="standard-basic" fullWidth label="Username" value={user.username} onChange={onChange} />
                  <TextField name="lastName" margin="normal" id="standard-basic" fullWidth label="Họ" value={user.lastName} onChange={onChange} />
                
                  <TextField name="firstName" margin="normal" id="standard-basic" fullWidth label="Tên" value={user.firstName} onChange={onChange} />
                  <TextField
                        fullWidth
                        name="dob"
                        id="date"
                        label="Ngày sinh"
                        type="date"
                        value={user.dob}
                        onChange={onChange}

                        InputLabelProps={{
                          shrink: true,
                        }}

                      />  <TextField required name="email" margin="normal" id="standard-basic" fullWidth label="Email" value={user.email} onChange={onChange} />
                  <TextField name="cmndcccd" type="number" margin="normal" id="standard-basic" fullWidth label="CMND/CCCD" value={user.cmndcccd} onChange={onChange} />
                  <TextField name="address" margin="normal" id="standard-basic" fullWidth label="Địa chỉ" value={user.address} onChange={onChange} />

                  <TextField name="phone" type="number" margin="normal" id="standard-basic" fullWidth label="Phone" value={user.phone} onChange={onChange} />
                  <TextField required type="password" name="password" margin="normal" id="standard-basic" fullWidth label="Mật khẩu" value={user.password} onChange={onChange} />
                  <TextField required name="rePassword" type="password" margin="normal" id="standard-basic" fullWidth label="Nhập lại mật khẩu" value={user.rePassword} onChange={onChange} />
               
                  <h4>Cửa hàng làm việc(*)</h4>
                  <br></br>
                  <br></br>
                  </Grid>
                 
                  <Grid container spacing={3}>
                  <br></br>  <br></br>
                    <Select  className={classes.formControl}
                    displayEmpty
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={chooseStore}
                              onChange={handleChooseStore}
                              defaultValue='Geasoas'
                            >
                                {stores.map((e) => {
                                    if(e.nameStore!=='VIP'){
                                      return (<MenuItem key={e.id} value={e.id}>{e.nameStore + ' ' + e.addressStore}</MenuItem>)


                                    }
                                    return null;
                                        
                                })}

                             
                         
                            </Select>

                  </Grid>

                </form>
              </Container>



            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSignUp} color="primary">
                Hủy bỏ
              </Button>
              <Button onClick={onSubmitSignUp} color="primary">
                Tạo mới
              </Button>
            </DialogActions>
          </Dialog>








        </Stack>

        <Card>
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={employees.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row,stt=0) => {
                      const { id, username, firstName, lastName, role, email, phone, blocked, store,dob } = row;
                      const isItemSelected = selected.indexOf(username) !== -1;

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
                              onChange={(event) => handleClick(event, username)}
                            />
                          </TableCell> */}
                          <TableCell align="left">{++stt}</TableCell>
                          <TableCell align="left">{username}</TableCell>
                          <TableCell align="left">{lastName + ' '+firstName}</TableCell>
                          <TableCell align="left">{formatDateFrame(dob)}</TableCell>
                          <TableCell align="left">{phone}</TableCell>
                          <TableCell align="left">{email}</TableCell>
                          <TableCell align="left">{store.nameStore}</TableCell>
                          <TableCell align="left">{blocked === false ? <Chip color="primary" label="Còn hiệu lực" onClick={() => handleClickStatusChangeFalse(id)} /> : <Chip color="secondary" label="Tạm khóa" onClick={() => handleClickStatusChangeTrue(id)} />}</TableCell>
                         
                          <TableCell align="left">{role.name}</TableCell>



                          <TableCell align="right">
                            <UserMoreMenu updateEmployee={() => getEmployee()} idEmployee={id} idStore={store.id} />
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
            count={employees.length}
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
