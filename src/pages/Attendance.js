import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import TableHead from '@material-ui/core/TableHead';
import Chip from '@material-ui/core/Chip';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Grid, TablePagination } from '@material-ui/core';
import { TextField } from '@material-ui/core';
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
  TableContainer
} from '@material-ui/core';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import axios from 'axios';
import React from 'react';
import CallAPI from './../services/CallAPI';
import { ToastContainer, toast } from 'react-toastify';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Slide from '@material-ui/core/Slide';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';

import { useTime } from 'react-timer-hook';
// import { filter } from 'lodash';
// import SearchNotFound from './../components/SearchNotFound';

import * as Config from '../constants/config'


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});


// ----------------------------------------------------------------------


const Row = (props,ref)=> {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const classes = useRowStyles();



  const formatDateFrame = (date) => {
    var d = new Date(date);
    var n = d.toLocaleDateString();

    return n
  }






  const RenderRowAttendance = (props) => {

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
      store: '',
      storeName: '',



      role: ''
    });

    const handleClickStatusChangeFalse = (id) => {
      CallAPI(`/attendances/${id}`, 'PUT',
        {
          "checkAttendance": false,
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
            window.location.reload();

          }, 3000)





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


    const handleClickStatusChangeTrue = (id) => {


      CallAPI(`/attendances/${id}`, 'PUT',
        {
          "checkAttendance": true,
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
            window.location.reload();

          }, 3000)





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

    function getUserById() {
      axios.get(`${Config.API_URL}/users/${props.users_permissions_user}`, {
        'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
      }).then(res => {
        setUser({
          username: res.data.username,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          phone: res.data.phone,
          store: res.data.store.nameStore,
          role: res.data.role
        })



      })


    }


    

    getUserById();



    return (<TableRow key={props.id}>

      <TableCell component="th" scope="row">
        {user.username}
      </TableCell>
      <TableCell component="th" scope="row">
        {user.lastName + ' '+ user.firstName}
      </TableCell>
    
      <TableCell component="th" scope="row">
        {user.store}
      </TableCell>
      <TableCell component="th" scope="row">
        {user.phone}
      </TableCell>

      <TableCell component="th" scope="row">
        {user.role.id === 3 ? <Chip label="Quản lý" /> : <Chip color="secondary" variant="outlined" label="Nhân Viên" />}
      </TableCell>
      <TableCell>{props.checkAttendance === true ? <Chip color="secondary" label="Đã điểm danh" onClick={() => handleClickStatusChangeFalse(props.id)} /> : <Chip color="primary" label="Chưa điểm danh" onClick={() => handleClickStatusChangeTrue(props.id)} />}</TableCell>
     
      
    </TableRow>)


  }



  function deleteDateAttendance(id){
    CallAPI(`/date-attendances/${id}`, 'DELETE', null, localStorage.getItem('jwt')).then(res => {
      console.log(res.data)
      if (res.status === 200) {
        toast.success('🦄 Xóa điểm danh theo ngày thành công! ', {
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
        window.location.reload();

      }, 2000)


      
    
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
        toast.error('Lỗi! Thất bại', {
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


  return (

    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {formatDateFrame(row.date)}
        </TableCell>

        <TableCell component="th" scope="row">
        <Button onClick={()=>deleteDateAttendance(row.id)}
            variant="outlined"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={trash2Fill} />}
            color='primary'
          >
           Xóa danh sách điểm danh theo ngày
          </Button>
        </TableCell>

      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Danh sách điểm danh
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Mã NV</TableCell>
                    <TableCell>Họ Tên</TableCell>
                  
                    <TableCell>Cửa hàng</TableCell>
                    <TableCell>Điện thoại</TableCell>
                    <TableCell>Chức vụ</TableCell>
                    <TableCell>Trạng thái</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>

                  {row.attendances.map((attendance) => RenderRowAttendance(attendance))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}




// function descendingComparator(a, b, orderBy) {
//   if (b[orderBy] < a[orderBy]) {
//     return -1;
//   }
//   if (b[orderBy] > a[orderBy]) {
//     return 1;
//   }
//   return 0;
// }

// function getComparator(order, orderBy) {
//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function applySortFilter(array, comparator, query) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   if (query) {
//     return filter(array, (_user) => _user.username.toLowerCase().indexOf(query.toLowerCase()) !== -1);
//   }
//   return stabilizedThis.map((el) => el[0]);
// }


export default function Attendance() {
  
  const DateTimer=(props)=> {
    const {
      seconds,
      minutes,
      hours,
      ampm,
    } = useTime({ format: '24-hour'});
  


    return (
      <div style={{textAlign: 'left',display:'none'}}>
        <div style={{fontSize: '17px'}}>
      Giờ Hệ Thống: <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span><span>{ampm}</span>
      {(hours===4 && minutes===0)?createDateAttendanceAuto():''}
        </div>
      </div>
    );
  }



  const [page, setPage] = useState(0);
  // const [order, setOrder] = useState('asc');

  // const [orderBy, setOrderBy] = useState('name');
  // const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);


  



  const [rows, setRows] = useState([]);
  const [openCreateDateAttendance, setOpenCreateDateAttendance] = React.useState(false);
  const [chooseDatetime, setChooseDatetime] = React.useState('');

  function getDateFrame() {
    axios.get(`${Config.API_URL}/date-attendances?_sort=date:DESC`, {
      'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }

    }).then(res => {

      setRows(res.data)

    })


  }

  const [employees, setEmployees] = useState([]);



  var listArray = [];
  var listIdArrayAttendance = [];


  function getEmployee() {
    axios.get(`${Config.API_URL}/users`, {
      'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }

    }).then(res => {

      setEmployees(res.data);
    })
  }


  employees.map(item => {
    if (item.blocked === false) {
      listArray.push(item.id)
    }
    return 0;









  })







  useEffect(() => {
    getDateFrame();
    getEmployee();


  }, []);




  const handleChooseDatetime = (event) => {
    setChooseDatetime(event.target.value);
  };





  const handleClickOpenCreate = () => {

    setOpenCreateDateAttendance(true);

  };

  const handleCloseCreate = () => {

    setOpenCreateDateAttendance(false);



  };





  

  const createDateAttendanceDialog = (e) => {
    e.preventDefault();
    
    handleCloseCreate();
    createAttendance();

setTimeout(()=>{
  CallAPI('/date-attendances', 'POST',
  {
    "date": chooseDatetime,
    "attendances": listIdArrayAttendance
  }




  , localStorage.getItem('jwt')).then(res => {
    if (res.status === 200) {
      toast.success('🦄 Tạo danh sách điểm danh ngày thành công!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

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


      toast.error('Tạo danh sách điểm danh thất bại!', {
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
 window.location.reload();

},3000)

 







  }


  const createAttendanceForUser=(id,data)=>{

    CallAPI(`/users/${id}`, 'PUT',
    {
      "attendances": data
    }
    , localStorage.getItem('jwt')).then(res => {
 }).catch(err => {
      
    })

  }








  const createAttendance = () => {

    listArray.map((item) => {

      return  (CallAPI('/attendances', 'POST',
      {
        "users_permissions_user": item,
        "checkAttendance": false,
      }
  
  
        , localStorage.getItem('jwt')).then(res => {
          
         if(res.status===200){
          listIdArrayAttendance.push(res.data.id)
          createAttendanceForUser(item,res.data.id)


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
  
  
            toast.error('Tạo danh sách điểm danh thất bại!', {
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
        }))


    })
    

  







  }







  const createDateAttendanceAuto = () => {

      var date = new Date();
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
     


      if(day.toString().length===1){
        day='0'+day.toString();

      }

      if(month.toString().length===1){
        month='0'+month.toString();

      }

      var result = year+'-'+month+'-'+day;

console.log(day.toString().length)
console.log(result)
createAttendance();
      
 

    setTimeout(()=>{
      CallAPI('/date-attendances', 'POST',
      {
        "date": result,
        "attendances": listIdArrayAttendance
      }
      , localStorage.getItem('jwt')).then(res => {
        if (res.status === 200) {
          toast.success('🦄 Tạo danh sách điểm danh ngày thành công!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
    
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
    
        
          toast.error('Tạo danh sách điểm danh thất bại!', {
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
     
    window.location.reload()
    },3000)












}







 









 


  localStorage.setItem('date', listArray)




  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - employees.length) : 0;

  const filteredUsers = rows;

  const isUserNotFound = filteredUsers.length === 0;


  return (
    <Page title="Danh Sách Theo Dõi Điểm Danh Hằng Ngày | Kim Long Tài">

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <DateTimer />
          <Typography variant="h4" gutterBottom>
            Danh Sách Theo Dõi Điểm Danh Hằng Ngày
          </Typography>
          <Button onClick={handleClickOpenCreate}
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
          >
            Tạo Ngày Điểm Danh
          </Button>
          <Dialog
            open={openCreateDateAttendance}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseCreate}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogContent>

              <DialogContentText id="alert-dialog-slide-description">
                <br></br><br></br>
              </DialogContentText>

              <Container maxWidth="xl">
                <form>
                  <Grid container spacing={3}>
                    <TextField
                      fullWidth
                      id="date-local"
                      label="Chọn Ngày Tạo Danh Sách Điểm Danh"
                      type="date"
                      value={chooseDatetime}
                      onChange={handleChooseDatetime}

                      InputLabelProps={{
                        shrink: true,
                      }}

                    />

                    <Grid item xs={12} md={6} lg={6}>



                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>

                    </Grid>
                  </Grid>



                </form>
              </Container>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCreate} color="primary">
                Hủy bỏ
              </Button>
              <Button onClick={createDateAttendanceDialog} color="primary">
                Tạo ngày điểm danh
              </Button>
            </DialogActions>
          </Dialog>











        </Stack>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Ngày</TableCell>
                    <TableCell>
                     Hàng động
                    </TableCell>







                  </TableRow>
                </TableHead>
                <TableBody>
                {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <Row key={row.id} row={row} />
                    ))}

{/* 
                  {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <Row key={row.id} row={row} />
                  ))} */}


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
            count={rows.length}
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
