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
  TablePagination,
  InputLabel,
  FormControl
} from '@material-ui/core';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import TimecardListHead from 'src/components/_dashboard/timecards/TimecardListHead';
import TimecardMoreMenu from 'src/components/_dashboard/timecards/TimecardMoreMenu';
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
import eyeOutline from '@iconify/icons-eva/eye-outline';
import * as Config from '../constants/config'
import { MobileDateTimePicker } from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import viLocale from 'date-fns/locale/vi';
import { MobileDatePicker } from '@material-ui/lab';
import refreshFill from '@iconify/icons-eva/refresh-fill';
import searchFill from '@iconify/icons-eva/search-fill';
// import TimecardListToolbar from 'src/components/_dashboard/timecards/TimecardListToolbar';
const TABLE_HEAD = [
  { id: 'STT', label: 'STT', alignRight: false },
  { id: 'ID', label: 'ID', alignRight: false },
  { id: 'Ngày', label: 'Ngày', alignRight: false },
  { id: 'Username', label: 'Mã NV', alignRight: false },
  { id: 'begin', label: 'Vào ca', alignRight: false },

  { id: 'endtime', label: 'Kết Ca', alignRight: false },
  { id: 'Status', label: 'Trạng thái', alignRight: false },
  { id: 'numOfBreaks', label: 'Số lần nghỉ trong ngày', alignRight: false },
  { id: 'Sum', label: 'Tổng thời gian làm việc', alignRight: false }


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

export default function Timecard() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);


  const [breaktimeTemp, setBreaktimeTemp] = React.useState('00:00:00');
  const [doneBreaktimeTemp, setDoneBreaktimeTemp] = React.useState('00:00:00');


  const [breaktime2Temp, setBreaktime2Temp] = React.useState('00:00:00');
  const [doneBreaktime2Temp, setDoneBreaktime2Temp] = React.useState('00:00:00');

  const [breaktime3Temp, setBreaktime3Temp] = React.useState('00:00:00');
  const [doneBreaktime3Temp, setDoneBreaktime3Temp] = React.useState('00:00:00');

  const [breaktime4Temp, setBreaktime4Temp] = React.useState('00:00:00');
  const [doneBreaktime4Temp, setDoneBreaktime4Temp] = React.useState('00:00:00');

  const [openNumberOfBreaks, setOpenNumberOfBreaks] = React.useState(false);

  const handleClickOpenNumberOfBreaks = (breaktime, doneBreaktime, breaktime2, doneBreaktime2, breaktime3, doneBreaktime3, breaktime4, doneBreaktime4) => {



    setBreaktimeTemp(breaktime);
    setDoneBreaktimeTemp(doneBreaktime);

    setBreaktime2Temp(breaktime2);
    setDoneBreaktime2Temp(doneBreaktime2);

    setBreaktime3Temp(breaktime3);
    setDoneBreaktime3Temp(doneBreaktime3);

    setBreaktime4Temp(breaktime4);
    setDoneBreaktime4Temp(doneBreaktime4);


    setOpenNumberOfBreaks(true);


  };

  const handleCloseNumberOfBreaks = () => {
    setOpenNumberOfBreaks(false);
  };





  var dateNow = new Date();
  var firstDay = new Date(dateNow.getFullYear(), dateNow.getMonth(), 2);
  const [chooseFromDate, setChooseFromDate] = React.useState(firstDay-1);

  const [chooseToDate, setChooseToDate] = React.useState(new Date());


  const [chooseUsernameFilter, setChooseUsernameFilter] = React.useState('');

  const [chooseStatusWorkFilter, setChooseStatusWorkFilter] = React.useState('');

  const [chooseStatusSumAll, setChooseStatusSumAll] = React.useState('');
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

    CallAPI('/time-cards', 'POST',
      {
        "status_work": chooseStatusWork,
        "beginTime": beginTime + ":00",
        "breaktime": breaktime + ":00",
        "doneBreaktime": doneBreaktime + ":00",
        "breaktime2": breaktime2 + ":00",
        "doneBreaktime2": doneBreaktime2 + ":00",
        "breaktime3": breaktime3 + ":00",
        "doneBreaktime3": doneBreaktime3 + ":00",
        "breaktime4": breaktime4 + ":00",
        "doneBreaktime4": doneBreaktime4 + ":00",
        "numberOfBreaks": chooseNumberOfBreaks,
        "endTime": endTime,
        "date": chooseDate,
        "users_permissions_user": chooseEmployee,
      }




      , sessionStorage.getItem('jwt')).then(res => {
        if (res.status === 200) {
          toast.success('🦄 Tạo thẻ thời gian thành công!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setTimeout(() => {
            getTimecards()
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


          toast.error('Tạo thẻ thời gian thất bại!', {
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


  const [timecards, setTimecards] = useState([]);








  function getTimecards() {
    axios.get(`${Config.API_URL}/time-cards?&_sort=date:DESC`, {
      'headers': { 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') }

    }).then(res => {
      setTimecards(res.data)

    })


  }


  function getTimecardsByClick(toDate, fromDate, username, statusWork,statusSumWork) {
    axios.get(`${Config.API_URL}/time-cards?_sort=date:DESC&_where[0][date_gte]=${fromDate}&_where[1][date_lte]=${toDate}&_where[2][users_permissions_user.username_contains]=${username}&_where[3][status_work.nameStatusWork_contains]=${statusWork}&_where[4][status_work.nameStatusWork_ne]=${statusSumWork}`, {
      'headers': { 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') }

    }).then(res => {
      setTimecards(res.data)
    })


  }

  useEffect(() => {
    getTimecards();

  }, []);




  const calculateSumWorkingTime = (date, begin, breaktime, doneBreaktime, breaktime2, doneBreaktime2, breaktime3, doneBreaktime3, breaktime4, doneBreaktime4, endtime) => {

    //Date in TimeCard

    var justDateInTimecard = new Date(date);



    //BeginTime

    var hoursBegin = parseInt(begin.slice(0, 2));
    var minsBegin = parseInt(begin.slice(3, 5));
    var convertBeginAllMins = hoursBegin * 60 + minsBegin;




    // Breaktime - DoneBreaktime
    var hoursBreaktime = parseInt(breaktime.slice(0, 2));
    var minsBreaktime = parseInt(breaktime.slice(3, 5));
    var convertBreaktimeAllMins = hoursBreaktime * 60 + minsBreaktime;







    var hoursDoneBreaktime = parseInt(doneBreaktime.slice(0, 2));
    var minsDoneBreaktime = parseInt(doneBreaktime.slice(3, 5));
    var convertDoneBreaktime = hoursDoneBreaktime * 60 + minsDoneBreaktime;




    // Breaktime2 - DoneBreaktime2


    var hoursBreaktime2 = parseInt(breaktime2.slice(0, 2));
    var minsBreaktime2 = parseInt(breaktime2.slice(3, 5));
    var convertBreaktime2AllMins = hoursBreaktime2 * 60 + minsBreaktime2;




    var hoursDoneBreaktime2 = parseInt(doneBreaktime2.slice(0, 2));
    var minsDoneBreaktime2 = parseInt(doneBreaktime2.slice(3, 5));
    var convertDoneBreaktime2 = hoursDoneBreaktime2 * 60 + minsDoneBreaktime2;


    // Breaktime3 - DoneBreaktime3


    var hoursBreaktime3 = parseInt(breaktime3.slice(0, 2));
    var minsBreaktime3 = parseInt(breaktime3.slice(3, 5));
    var convertBreaktime3AllMins = hoursBreaktime3 * 60 + minsBreaktime3;




    var hoursDoneBreaktime3 = parseInt(doneBreaktime3.slice(0, 2));
    var minsDoneBreaktime3 = parseInt(doneBreaktime3.slice(3, 5));
    var convertDoneBreaktime3 = hoursDoneBreaktime3 * 60 + minsDoneBreaktime3;



    // Breaktime4 - DoneBreaktime4


    var hoursBreaktime4 = parseInt(breaktime4.slice(0, 2));
    var minsBreaktime4 = parseInt(breaktime4.slice(3, 5));
    var convertBreaktime4AllMins = hoursBreaktime4 * 60 + minsBreaktime4;




    var hoursDoneBreaktime4 = parseInt(doneBreaktime4.slice(0, 2));
    var minsDoneBreaktime4 = parseInt(doneBreaktime4.slice(3, 5));
    var convertDoneBreaktime4 = hoursDoneBreaktime4 * 60 + minsDoneBreaktime4;





    // Endtime
    var dateEndTime = new Date(endtime);
    var justDateInEndTimecard = dateEndTime;

    var timeEndTime = dateEndTime.toLocaleTimeString('vi-VN');

    var hoursEndtime = parseInt(timeEndTime.slice(0, 2));
    var minsEndtime = parseInt(timeEndTime.slice(3, 5));
    var convertEndtimeAllMins = null




    
    var justEndDate =  new Date(justDateInEndTimecard);
    var justDate =  new Date(justDateInTimecard);

    
   
   
    
if(parseInt(justDate.getDate())!==parseInt(justEndDate.getDate())){

  convertEndtimeAllMins = hoursEndtime * 60 + minsEndtime + 1 * 24 * 60;

}
else{
  convertEndtimeAllMins = hoursEndtime * 60 + minsEndtime;
}

    



    var sumAllMins = (convertEndtimeAllMins - convertBeginAllMins) - (convertDoneBreaktime - convertBreaktimeAllMins) - (convertDoneBreaktime2 - convertBreaktime2AllMins) - (convertDoneBreaktime3 - convertBreaktime3AllMins) - (convertDoneBreaktime4 - convertBreaktime4AllMins);

    var customHours = Math.floor(sumAllMins / 60);
    var customMins = sumAllMins % 60

    var result = customHours + ' tiếng ' + customMins + ' phút '

    return result;


  }




  const [employees, setEmployees] = useState([]);

  function getEmployees() {
    axios.get(`${Config.API_URL}/users`, {
      'headers': { 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') }

    }).then(res => {
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
      const newSelecteds = timecards.map((n) => n.name);
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



  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - timecards.length) : 0;

  const filteredUsers = applySortFilter(timecards, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;


  const converDateTimeFormat = (dateTime) => {
    var d = new Date(dateTime);
    var date = d.toLocaleDateString("vi-VN");


    return date




  }



  const [chooseDate, setChooseDate] = React.useState(new Date());


  const [chooseEmployee, setChooseEmployee] = React.useState('');
  const handleChooseEmployee = (event) => {
    setChooseEmployee(event.target.value);
  };


  const [chooseNumberOfBreaks, setChooseNumberOfBreaks] = React.useState(0);
  const handleChooseNumberOfBreaks = (event) => {
    setChooseNumberOfBreaks(event.target.value);
  };


  const [chooseStatusWork, setStatusWork] = React.useState(1);
  const handleStatusWork = (event) => {
    setStatusWork(event.target.value);
  };

  const [beginTime, setBeginTime] = React.useState('00:00:00');
  const handleBeginTime = (event) => {
    setBeginTime(event.target.value);
  };


  const [breaktime, setBreaktime] = React.useState('00:00:00');
  const handleBreakTime = (event) => {
    setBreaktime(event.target.value);
  };

  const [doneBreaktime, setDoneBreaktime] = React.useState('00:00:00');
  const handleDoneBreaktime = (event) => {
    setDoneBreaktime(event.target.value);
  };






  const [breaktime2, setBreaktime2] = React.useState('00:00:00');
  const handleBreakTime2 = (event) => {
    setBreaktime2(event.target.value);
  };

  const [doneBreaktime2, setDoneBreaktime2] = React.useState('00:00:00');
  const handleDoneBreaktime2 = (event) => {
    setDoneBreaktime2(event.target.value);
  };



  const [breaktime3, setBreaktime3] = React.useState('00:00:00');
  const handleBreakTime3 = (event) => {
    setBreaktime3(event.target.value);
  };

  const [doneBreaktime3, setDoneBreaktime3] = React.useState('00:00:00');
  const handleDoneBreaktime3 = (event) => {
    setDoneBreaktime3(event.target.value);
  };




  const [breaktime4, setBreaktime4] = React.useState('00:00:00');
  const handleBreakTime4 = (event) => {
    setBreaktime4(event.target.value);
  };

  const [doneBreaktime4, setDoneBreaktime4] = React.useState('00:00:00');
  const handleDoneBreaktime4 = (event) => {
    setDoneBreaktime4(event.target.value);
  };


  const handleRefresuReport = () => {
    setChooseToDate(new Date());
    setChooseFromDate('1970-1-1');
    setChooseUsernameFilter('');
    setChooseStatusWorkFilter('');
    setChooseStatusSumAll('');
  };



  const [endTime, setEndTime] = React.useState(null);


  const handleChangeChoooseUsername = (event) => {
    setChooseUsernameFilter(event.target.value);
  };
  const handleChangeChoooseStatusWorkFilter = (event) => {
    setChooseStatusWorkFilter(event.target.value);
  };



  const handleChangeChoooseStatusSumAll = (event) => {
    setChooseStatusSumAll(event.target.value);
  };


  return (
    <Page title="Thẻ Thời Gian |  Kim Long Tài">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Danh Sách Thẻ Thời Gian
          </Typography>
          <Button onClick={handleClickOpenSignUp}
            variant="contained"
            component={RouterLink}
            to="#"
            startIcon={<Icon icon={plusFill} />}
          >
            Tạo thẻ thời gian
          </Button>





          <Dialog
            open={openSignUp}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseSignUp}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle id="alert-dialog-slide-title">{"Tạo thông tin thẻ thời gian"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Hành động này sẽ khởi tạo một thẻ thời gian cho nhân viên
              </DialogContentText>
              <Container maxWidth="xl">
                <form>
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={12} lg={12}>
                        <h4>Nhân viên(*)</h4>
                        <Select fullWidth
                          displayEmpty
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={chooseEmployee}
                          onChange={handleChooseEmployee}
                          defaultValue='Geasoas'
                        >
                          {employees.map((e) => {
                            if (e.nameStore !== 'VIP') {
                              return <MenuItem key={e.id} value={e.id}>{e.username + ' ' + e.firstName}</MenuItem>


                            }
                            return null;
                          })}



                        </Select>


                      </Grid>
                      <Grid item xs={12} sm={12} lg={12}>

                        <MobileDatePicker
                          fullWidth
                          label='Ngày(*)'
                          value={chooseDate}
                          onChange={(newValue) => {
                            setChooseDate(newValue);
                          }}
                          renderInput={(params) => <TextField fullWidth name="endTime" {...params} />}
                        />


                      </Grid>



                    </Grid>
                    <Grid item xs={12} sm={12} lg={12}>
                      <br></br>
                      <TextField
                        fullWidth
                        id="datetime-local"
                        label="Vào ca(*)"
                        type="time"
                        value={beginTime}
                        onChange={handleBeginTime}

                        InputLabelProps={{
                          shrink: true,
                        }}

                      />
                    </Grid>
                    <Grid item xs={12} sm={12} lg={12}>
                      <br></br>
                      <TextField
                        fullWidth
                        id="datetime-local"
                        label="Nghỉ giữa giờ(*)"
                        type="time"
                        value={breaktime}
                        onChange={handleBreakTime}

                        InputLabelProps={{
                          shrink: true,
                        }}

                      />
                    </Grid>
                    <Grid item xs={12} sm={12} lg={12}>
                      <br></br>
                      <TextField
                        fullWidth
                        id="datetime-local"
                        label="Nghỉ xong(*)"
                        type="time"
                        value={doneBreaktime}
                        onChange={handleDoneBreaktime}

                        InputLabelProps={{
                          shrink: true,
                        }}

                      />
                    </Grid>








                    <Grid item xs={12} sm={12} lg={12}>
                      <br></br>
                      <TextField
                        fullWidth
                        id="datetime-local"
                        label="Nghỉ giữa giờ lần 2(*)"
                        type="time"
                        value={breaktime2}
                        onChange={handleBreakTime2}

                        InputLabelProps={{
                          shrink: true,
                        }}

                      />
                    </Grid>
                    <Grid item xs={12} sm={12} lg={12}>
                      <br></br>
                      <TextField
                        fullWidth
                        id="datetime-local"
                        label="Nghỉ xong lần 2(*)"
                        type="time"
                        value={doneBreaktime2}
                        onChange={handleDoneBreaktime2}

                        InputLabelProps={{
                          shrink: true,
                        }}

                      />
                    </Grid>







                    <Grid item xs={12} sm={12} lg={12}>
                      <br></br>
                      <TextField
                        fullWidth
                        id="datetime-local"
                        label="Nghỉ giữa giờ lần 3(*)"
                        type="time"
                        value={breaktime3}
                        onChange={handleBreakTime3}

                        InputLabelProps={{
                          shrink: true,
                        }}

                      />
                    </Grid>
                    <Grid item xs={12} sm={12} lg={12}>
                      <br></br>
                      <TextField
                        fullWidth
                        id="datetime-local"
                        label="Nghỉ xong lần 3(*)"
                        type="time"
                        value={doneBreaktime3}
                        onChange={handleDoneBreaktime3}

                        InputLabelProps={{
                          shrink: true,
                        }}

                      />
                    </Grid>



                    <Grid item xs={12} sm={12} lg={12}>
                      <br></br>
                      <TextField
                        fullWidth
                        id="datetime-local"
                        label="Nghỉ giữa giờ lần 4(*)"
                        type="time"
                        value={breaktime4}
                        onChange={handleBreakTime4}

                        InputLabelProps={{
                          shrink: true,
                        }}

                      />
                    </Grid>
                    <Grid item xs={12} sm={12} lg={12}>
                      <br></br>
                      <TextField
                        fullWidth
                        id="datetime-local"
                        label="Nghỉ xong lần 4(*)"
                        type="time"
                        value={doneBreaktime4}
                        onChange={handleDoneBreaktime4}

                        InputLabelProps={{
                          shrink: true,
                        }}

                      />
                    </Grid>











                    <Grid item xs={12} sm={12} lg={12}>
                      <br></br>


                      <MobileDateTimePicker
                        label='Ngày giờ kết ca(*)'
                        value={endTime}
                        onChange={(newValue) => {
                          setEndTime(newValue);
                        }}
                        renderInput={(params) => <TextField fullWidth name="endTime" {...params} />}
                      />

                    </Grid>


                    <Grid item xs={12} md={12} lg={12}>
                      <h4>Số lần nghỉ trong ngày(*)</h4>
                      <Select fullWidth
                        displayEmpty
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                  
                        value={chooseNumberOfBreaks}
                        onChange={handleChooseNumberOfBreaks}
                        defaultValue='Geasoas'
                      >
                        <MenuItem value={0}>Chưa nghỉ</MenuItem>
                        <MenuItem value={1}>Nghỉ 1 lần</MenuItem>
                        <MenuItem value={2}>Nghỉ 2 lần</MenuItem>
                        <MenuItem value={3}>Nghỉ 3 lần</MenuItem>
                        <MenuItem value={4}>Nghỉ 4 lần</MenuItem>



                      </Select>


                    </Grid>




                    <Grid item xs={12} md={12} lg={12}>
                      <h4>Trạng thái(*)</h4>
                      <Select fullWidth
                        displayEmpty
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={chooseStatusWork}
                        onChange={handleStatusWork}
                        defaultValue='Geasoas'
                      >
                        <MenuItem value={1}>Vào Ca</MenuItem>
                        <MenuItem value={2}>Nghỉ Giữa Giờ</MenuItem>
                        <MenuItem value={3}>Nghỉ Xong</MenuItem>
                        <MenuItem value={4}>Kết Ca</MenuItem>



                      </Select>


                    </Grid>

                  </LocalizationProvider>
                </form>
              </Container>



            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseSignUp} color="primary">
                Hủy bỏ
              </Button>
              <Button onClick={onSubmitSignUp} color="primary">
                Tạo thẻ thời gian
              </Button>
            </DialogActions>
          </Dialog>








        </Stack>

        <Card>
          {/* <TimecardListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          /> */}

          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} mt={5} ml={2} mr={2}>

            <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>
              <MobileDatePicker
              
                label="Từ Ngày"
                value={chooseFromDate}
                onChange={(newValue) => {
                  setChooseFromDate(newValue);
                }}
                renderInput={(params) => <TextField fullWidth style={{ margin: '5px' }}  {...params} />}
              />


              <MobileDatePicker

                label="Đến Ngày"
                value={chooseToDate}
                onChange={(newValue) => {
                  setChooseToDate(newValue);
                }}
                renderInput={(params) => <TextField fullWidth style={{ margin: '5px' }}  {...params} />}
              />

            </LocalizationProvider>




            <TextField fullWidth style={{ margin: '5px' }} id="outlined-basic" label="Mã nhân viên" variant="outlined" value={chooseUsernameFilter} onChange={handleChangeChoooseUsername} />


            <FormControl style={{ margin: '5px' }} fullWidth>


              <InputLabel id="demo-simple-select-label">Trạng Thái</InputLabel>
              <Select
              
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={chooseStatusWorkFilter}
                label="Trạng Thái"
                onChange={handleChangeChoooseStatusWorkFilter}
              >
                <MenuItem defaultValue key='0' value=''>Tất cả</MenuItem>
                <MenuItem key='1' value='Vào Ca'>Vào Ca</MenuItem>
                <MenuItem key='2' value='Nghỉ Giữa Giờ'>Nghỉ Giữa Giờ</MenuItem>
                <MenuItem key='3' value='Lý Do Nghỉ Giữa Giờ'>Lý Do Nghỉ Giữa Giờ</MenuItem>
                <MenuItem key='4' value='Nghỉ Xong'>Nghỉ Xong</MenuItem>
                <MenuItem key='5' value='Kết Ca'>Kết Ca</MenuItem>

              </Select>

            </FormControl>


            <FormControl fullWidth>


<InputLabel id="demo-simple-select-label">Tổng thời gian làm việc</InputLabel>
<Select
  labelId="demo-simple-select-label"
  id="demo-simple-select"
  value={chooseStatusSumAll}
  label="Tổng thời gian làm việc"
  onChange={handleChangeChoooseStatusSumAll}
>
  <MenuItem defaultValue key='0' value=''>Tất cả</MenuItem>
  <MenuItem key='1' value='Kết Ca'>đang làm việc</MenuItem>
  

</Select>

</FormControl>


           



            <Button onClick={() => getTimecardsByClick(new Date(chooseToDate).toISOString().slice(0, 10), new Date(chooseFromDate).toISOString().slice(0, 10), chooseUsernameFilter, chooseStatusWorkFilter,chooseStatusSumAll)}
              style={{ height: 55, margin: '5px' }}
              variant="contained"
              component={RouterLink}
              to="#"
              startIcon={<Icon icon={searchFill} />}
            >
              Tìm
            </Button>

            <Button onClick={handleRefresuReport}
              style={{ height: 55, margin: '5px' }}
              variant="contained"
              component={RouterLink}
              to="#"
              startIcon={<Icon icon={refreshFill} />}
            >

            </Button>








          </Stack>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <TimecardListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={timecards.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, stt = 0) => {
                      const { id, date, users_permissions_user, beginTime, breaktime, doneBreaktime, status_work, numberOfBreaks, breaktime2, doneBreaktime2, breaktime3, doneBreaktime3, breaktime4, doneBreaktime4, endTime } = row;
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
                          <TableCell align="left">{id}</TableCell>
                          <TableCell align="left">{converDateTimeFormat(date)}</TableCell>
                          <TableCell align="left">{users_permissions_user.username}</TableCell>
                          <TableCell align="left">{beginTime.slice(0, 8)}</TableCell>


                          <TableCell align="left">{status_work.id === 4 ? new Date(endTime).toLocaleDateString('vi-VN') + ' ' + new Date(endTime).toLocaleTimeString('vi-VN') : 'đang làm việc'}</TableCell>
                          <TableCell align="left">{status_work.nameStatusWork}</TableCell>
                          <TableCell align="left">
                            <Button variant="outlined" color="primary" onClick={() => handleClickOpenNumberOfBreaks(breaktime, doneBreaktime, breaktime2, doneBreaktime2, breaktime3, doneBreaktime3, breaktime4, doneBreaktime4)}>
                              <Icon style={{ fontSize: '25px' }} icon={eyeOutline} /> {numberOfBreaks}
                            </Button>




                          </TableCell>
                          <TableCell align="left">{status_work.id === 4 ? calculateSumWorkingTime(date, beginTime, breaktime, doneBreaktime, breaktime2, doneBreaktime2, breaktime3, doneBreaktime3, breaktime4, doneBreaktime4, endTime) : 'đang làm việc'}</TableCell>





                          <TableCell align="right">
                            <TimecardMoreMenu updateTimecards={() => getTimecards()} idTimecard={id} idStatusWork={status_work.id} idUser={users_permissions_user.id} Nob={numberOfBreaks} />
                          </TableCell>
                        </TableRow>
                      );
                    })}




                  <Dialog
                    open={openNumberOfBreaks}


                    onClose={handleCloseNumberOfBreaks}

                  >
                    <DialogTitle id="alert-dialog-slide-title">{"Mốc Thời Gian Nghỉ Trong Ngày"}</DialogTitle>
                    <DialogContent>



                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell align="left">NGHỈ LẦN 1</TableCell>
                            <TableCell align="left">{breaktimeTemp.slice(0, 8) === '00:00:00' ? '' : breaktimeTemp.slice(0, 8)}</TableCell>
                            <TableCell align="left">{doneBreaktimeTemp.slice(0, 8) === '00:00:00' ? '' : doneBreaktimeTemp.slice(0, 8)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="left">NGHỈ LẦN 2</TableCell>
                            <TableCell align="left">{breaktime2Temp.slice(0, 8) === '00:00:00' ? '' : breaktime2Temp.slice(0, 8)}</TableCell>
                            <TableCell align="left">{doneBreaktime2Temp.slice(0, 8) === '00:00:00' ? '' : doneBreaktime2Temp.slice(0, 8)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="left">NGHỈ LẦN 3</TableCell>
                            <TableCell align="left">{breaktime3Temp.slice(0, 8) === '00:00:00' ? '' : breaktime3Temp.slice(0, 8)}</TableCell>
                            <TableCell align="left">{doneBreaktime3Temp.slice(0, 8) === '00:00:00' ? '' : doneBreaktime3Temp.slice(0, 8)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell align="left">NGHỈ LẦN 4</TableCell>
                            <TableCell align="left">{breaktime4Temp.slice(0, 8) === '00:00:00' ? '' : breaktime4Temp.slice(0, 8)}</TableCell>
                            <TableCell align="left">{doneBreaktime4Temp.slice(0, 8) === '00:00:00' ? '' : doneBreaktime4Temp.slice(0, 8)}</TableCell>

                          </TableRow>



                        </TableBody>
                      </Table>







                    </DialogContent>
                    <DialogActions>

                      <Button onClick={handleCloseNumberOfBreaks} color="primary">
                        Tắt
                      </Button>
                    </DialogActions>
                  </Dialog>
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
            count={timecards.length}
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
