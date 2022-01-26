import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  ButtonGroup,
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
import TimecardListHead from 'src/components/_dashboard/timecards/TimecardListHead';
import axios from 'axios';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { ExportCSV } from './../components/ExportCSV';
import { TextField } from '@material-ui/core';
import searchFill from '@iconify/icons-eva/search-fill';
import refreshFill from '@iconify/icons-eva/refresh-fill';
import * as Config from '../constants/config'
import Chip from '@material-ui/core/Chip';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import viLocale from 'date-fns/locale/vi';
import { MobileDatePicker } from '@material-ui/lab';

const TABLE_HEAD = [
  { id: 'STT', label: 'STT', alignRight: false },
  { id: 'date', label: 'Ngày', alignRight: false },
  { id: 'Username', label: 'Mã NV', alignRight: false },
  { id: 'HoTen', label: 'Họ Tên', alignRight: false },
  { id: 'statusNv', label: 'Trạng Thái NV', alignRight: false },
  { id: 'beginTime', label: 'Vào Ca', alignRight: false },
  { id: 'endtime', label: 'Kết Ca', alignRight: false },

  { id: 'numberOfBreaks', label: 'Số Lần Nghỉ', alignRight: false },
  { id: 'numberOfHoursBreaks', label: 'Tổng Số Giờ Nghỉ', alignRight: false },
  { id: 'Sum', label: 'Tổng Số Giờ Công', alignRight: false }


];



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

export default function Report() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);




  var dateNow = new Date();
  var firstDay = new Date(dateNow.getFullYear(), dateNow.getMonth(), 2);
  const [chooseFromDate, setChooseFromDate] = React.useState(firstDay-1);




  const [chooseToDate, setChooseToDate] = React.useState(new Date());








  const [chooseUsernameFilter, setChooseUsernameFilter] = React.useState('');

  const handleChangeChoooseUsername = (event) => {
    setChooseUsernameFilter(event.target.value);
  };








  const [timecards, setTimecards] = useState([]);






  function getTimecardsByClick(toDate, fromDate, username) {
    axios.get(`${Config.API_URL}/time-cards?_sort=date:DESC&_where[0][date_gte]=${fromDate}&_where[1][date_lte]=${toDate}&_where[2][users_permissions_user.username_contains]=${username}`, {
      'headers': { 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') }

    }).then(res => {
      setTimecards(res.data)
    })


  }






  function getTimecards() {
    axios.get(`${Config.API_URL}/time-cards?_sort=date:DESC`, {
      'headers': { 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') }

    }).then(res => {
      setTimecards(res.data)
      setFilterName('')
    })


  }

  useEffect(() => {
    getTimecards();

  }, []);



  const calculateSumBreakingTime = (breaktime, doneBreaktime, breaktime2, doneBreaktime2, breaktime3, doneBreaktime3, breaktime4, doneBreaktime4) => {






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








    var sumAllMins = (convertDoneBreaktime - convertBreaktimeAllMins) + (convertDoneBreaktime2 - convertBreaktime2AllMins) + (convertDoneBreaktime3 - convertBreaktime3AllMins) + (convertDoneBreaktime4 - convertBreaktime4AllMins);

    var customHours = Math.floor(sumAllMins / 60);
    var customMins = sumAllMins % 60
    var converMinsToHours = customMins / 60


    var result = customHours + converMinsToHours

    return result;




  }



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



    var justEndDate = new Date(justDateInEndTimecard);
    var justDate = new Date(justDateInTimecard);





    if (parseInt(justDate.getDate()) !== parseInt(justEndDate.getDate())) {

      convertEndtimeAllMins = hoursEndtime * 60 + minsEndtime + 1 * 24 * 60;

    }
    else {
      convertEndtimeAllMins = hoursEndtime * 60 + minsEndtime;
    }



    var sumAllMins = (convertEndtimeAllMins - convertBeginAllMins) - (convertDoneBreaktime - convertBreaktimeAllMins) - (convertDoneBreaktime2 - convertBreaktime2AllMins) - (convertDoneBreaktime3 - convertBreaktime3AllMins) - (convertDoneBreaktime4 - convertBreaktime4AllMins);

    var customHours = Math.floor(sumAllMins / 60);
    var customMins = sumAllMins % 60
    var converMinsToHours = customMins / 60

    var result = customHours + converMinsToHours

    return result;


  }




  // const [employees, setEmployees] = useState([]);

  // function getEmployees() {
  //   axios.get(`${Config.API_URL}/users`, {
  //     'headers': { 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') }

  //   }).then(res => {
  //     setEmployees(res.data)
  //   })


  // }

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



  // const [chooseEmployee, setChooseEmployee] = React.useState('');
  // const handleChooseEmployee = (event) => {
  //   setChooseEmployee(event.target.value);
  // };






















  const handleRefresuReport = () => {
    setChooseToDate(new Date());
    setChooseFromDate('1970-1-1');
    setChooseUsernameFilter('')
  };


  const transferReportByMonth = () => {
    navigate('/dashboard/reports/month', { replace: false });


  }

  const transferReportByEmployee = () => {
    navigate('/dashboard/reports/employee', { replace: false });


  }

  return (
    <Page title="Báo Cáo |  Kim Long Tài">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Báo Cáo Chấm Công Theo Nhân Viên
          </Typography>










        </Stack>
        <ButtonGroup aria-label="outlined primary button group">
          <Button variant="outlined" color="warning" onClick={transferReportByMonth}>THÁNG</Button>
          <Button variant="outlined" color="warning" onClick={transferReportByEmployee}> NHÂN VIÊN</Button>
        </ButtonGroup>
        <br></br>
        <Card>

          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} mt={5} ml={2} mr={2}>

            <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>



              <MobileDatePicker
                label="Từ Ngày"
                value={chooseFromDate}
                onChange={(newValue) => {
                  setChooseFromDate(newValue);
                }}
                renderInput={(params) => <TextField style={{ margin: '5px' }} fullWidth {...params} />}
              />



            </LocalizationProvider>







            <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>



              <MobileDatePicker
                label="Đến Ngày"
                value={chooseToDate}
                onChange={(newValue) => {
                  setChooseToDate(newValue);
                }}
                renderInput={(params) => <TextField style={{ margin: '5px' }} fullWidth {...params} />}
              />



            </LocalizationProvider>


            <TextField fullWidth style={{ margin: '5px' }} id="outlined-basic" label="Mã nhân viên" variant="outlined" value={chooseUsernameFilter} onChange={handleChangeChoooseUsername} />
            {/* <FormControl fullWidth>
            <InputLabel id="demo-customized-select">Nhân viên</InputLabel>
            <Select fullWidth

             
              value={chooseEmployee}
              onChange={handleChooseEmployee}
            >
              <MenuItem key='0' value=''>Tất cả</MenuItem>
              {employees.map((e) => {
                if (e.nameStore !== 'VIP') {
                  return <MenuItem key={e.id} value={e.username}>{e.username + ' ' + e.firstName}</MenuItem>


                }
                return null;
              })}



            </Select>
</FormControl> */}

            <Button onClick={() => getTimecardsByClick(new Date(chooseToDate).toISOString().slice(0, 10), new Date(chooseFromDate).toISOString().slice(0, 10), chooseUsernameFilter)}
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
            <ExportCSV csvData={timecards} fileName={'data'} />




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
                      const { id, date, users_permissions_user, status_work, beginTime, breaktime, doneBreaktime, endTime, breaktime2, doneBreaktime2, breaktime3, doneBreaktime3, breaktime4, doneBreaktime4, numberOfBreaks } = row;
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
                          <TableCell align="left">{converDateTimeFormat(date)}</TableCell>
                          <TableCell align="left">{users_permissions_user.username}</TableCell>
                          <TableCell align="left">{users_permissions_user.lastName + ' ' + users_permissions_user.firstName}</TableCell>
                          <TableCell align="left">{users_permissions_user.blocked === false ? <Chip size="small" color="primary" label="Còn Hiệu Lực" /> : <Chip color="secondary" size="small" label="Đã Khóa" />}</TableCell>

                          <TableCell align="left">{beginTime.slice(0, 8)}</TableCell>
                          <TableCell align="left">{status_work.id === 4 ? new Date(endTime).toLocaleDateString('vi-VN') + ' ' + new Date(endTime).toLocaleTimeString('vi-VN') : 'đang làm việc'}</TableCell>
                          <TableCell align="left">{numberOfBreaks}</TableCell>

                          <TableCell align="left">{status_work.id === 4 ? parseFloat(calculateSumBreakingTime(breaktime, doneBreaktime, breaktime2, doneBreaktime2, breaktime3, doneBreaktime3, breaktime4, doneBreaktime4)).toFixed(2) : 'đang làm việc'}</TableCell>


                          <TableCell align="left">{status_work.id === 4 ? parseFloat(calculateSumWorkingTime(date, beginTime, breaktime, doneBreaktime, breaktime2, doneBreaktime2, breaktime3, doneBreaktime3, breaktime4, doneBreaktime4, endTime)).toFixed(2) : 'đang làm việc'}</TableCell>





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
