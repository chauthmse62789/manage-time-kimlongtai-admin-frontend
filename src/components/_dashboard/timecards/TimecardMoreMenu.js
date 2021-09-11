import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
// material
import { Menu, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
import CallAPI from '../../../services/CallAPI';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Grid, Container } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import * as Config from './../../../constants/config';



// ----------------------------------------------------------------------


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const useStyles = makeStyles((theme) => ({
  formControl: {

    minWidth: 240,
    marginTop: 10
  },
}));
const TimecardMoreMenu = (props) => {
  const classes = useStyles();

  const [IdStatusWork, setIdStatusWork] = React.useState(props.idStatusWork);
  const [numberOfBreaks, setNumberOfBreaks] = React.useState(props.Nob);

  const handleIdStatusWork = (event) => {
    setIdStatusWork(event.target.value);
  };
  const handleNumberOfBreaks = (event) => {
    setNumberOfBreaks(event.target.value);
  };

  const [statusWork, setStatusWork] = useState([]);


  const [timecard, setTimecard] = useState({
    status_work: '',
    beginTime: '',
    breaktime: '',
    doneBreaktime: '',
    breaktime2: '',
    doneBreaktime2: '',
    breaktime3: '',
    doneBreaktime3: '',
    breaktime4: '',
    doneBreaktime4: '',
    endTime: '',
    numberOfBreaks: '',
    date: '',
  });


  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);


  function getStatusWork() {
    axios.get(`${Config.API_URL}/status-works`, {
      'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }

    }).then(res => {
      setStatusWork(res.data)
    })


  }



  //Delete employee
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseDelete = () => {
    setOpen(false);
  };




  //Edit employee
  const [openEdit, setOpenEdit] = React.useState(false);

  const handleClickOpenEdit = (id) => {
    getTimecardById(id);
    getStatusWork();
  };






  const handleCloseEdit = () => {

    setOpenEdit(false);



  };
  const onChange = (e) => {
    setTimecard(
      { ...timecard, [e.target.name]: e.target.value });
  }



  function deleteTimecardById(id) {
    handleCloseDelete();
    CallAPI(`/time-cards/${id}`, 'DELETE', null, localStorage.getItem('jwt')).then(res => {
      if (res.status === 200) {
        toast.success('🦄 Xóa thẻ thời gian thành công!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        props.updateTimecards({})
      }
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
        toast.error('Lỗi! Xóa thẻ thời gian thất bại!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        props.updateTimecards({});
      }
      console.log(JSON.stringify(err));
    });






  }











  const onSubmitEdit = (e) => {
    e.preventDefault();
    handleCloseEdit();

    CallAPI(`/time-cards/${props.idTimecard}`, 'PUT',
      {
        "status_work": IdStatusWork,
        "beginTime": timecard.beginTime + ":00",
        "breaktime": timecard.breaktime + ":00",
        "doneBreaktime": timecard.doneBreaktime + ":00",

        "breaktime2": timecard.breaktime2 + ":00",
        "doneBreaktime2": timecard.doneBreaktime2 + ":00",

        "breaktime3": timecard.breaktime3 + ":00",
        "doneBreaktime3": timecard.doneBreaktime3 + ":00",

        "breaktime4": timecard.breaktime4 + ":00",
        "doneBreaktime4": timecard.doneBreaktime4 + ":00",
        "numberOfBreaks": numberOfBreaks,
        "endTime": timecard.endTime + ":00",
        "date": timecard.date,
        "users_permissions_user": props.idUser,
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
        props.updateTimecards({})





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


  }






  function getTimecardById(id) {
    setOpenEdit(true);
    CallAPI(`/time-cards/${id}`, 'GET', null, localStorage.getItem('jwt')).then(res => {
      setTimecard({
        beginTime: res.data.beginTime.slice(0, 5),
        breaktime: res.data.breaktime.slice(0, 5),
        doneBreaktime: res.data.doneBreaktime.slice(0, 5),
        breaktime2: res.data.breaktime2.slice(0, 5),
        doneBreaktime2: res.data.doneBreaktime2.slice(0, 5),
        breaktime3: res.data.breaktime3.slice(0, 5),
        doneBreaktime3: res.data.doneBreaktime3.slice(0, 5),
        breaktime4: res.data.breaktime4.slice(0, 5),
        doneBreaktime4: res.data.doneBreaktime4.slice(0, 5),
        numberOfBreaks: res.data.numberOfBreaks,
        endTime: res.data.endTime.slice(0, 5),
        date: res.data.date
      })




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

      }
      console.log(JSON.stringify(err));
    });


  }








  return (
    <>
      <IconButton ref={ref} onClick={() => setIsOpen(true)}>
        <Icon icon={moreVerticalFill} width={20} height={20} />
      </IconButton>







      <Menu
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: 200, maxWidth: '100%' }
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >

        <MenuItem onClick={handleClickOpen} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{"Bạn có chắc chắn xóa thẻ thời gian này ?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Hành động này sẽ xóa thẻ thời gian của nhân viên.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete} color="primary">
              Hủy bỏ
            </Button>
            <Button onClick={() => deleteTimecardById(props.idTimecard)} color="primary">
              Xóa
            </Button>
          </DialogActions>
        </Dialog>












        <MenuItem onClick={() => handleClickOpenEdit(props.idTimecard)} component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Sửa" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <Dialog
          open={openEdit}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseEdit}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{"Sửa thông tin thẻ thời gian"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Hành động này sẽ cật nhật lại thẻ thời gian
            </DialogContentText>
            <Container maxWidth="xl">
              <form>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12} lg={12}>
                    <br></br>
                    <TextField
                      fullWidth
                      id="date"
                      label="Ngày"
                      type="date"
                      name="date"
                      value={timecard.date}
                      onChange={onChange}

                      InputLabelProps={{
                        shrink: true,
                      }}

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
                    name="beginTime"
                    value={timecard.beginTime}
                    onChange={onChange}

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
                    name="breaktime"
                    value={timecard.breaktime}
                    onChange={onChange}

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
                    name="doneBreaktime"
                    type="time"
                    value={timecard.doneBreaktime}
                    onChange={onChange}

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
                    name="breaktime2"
                    value={timecard.breaktime2}
                    onChange={onChange}

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
                    name="doneBreaktime2"
                    type="time"
                    value={timecard.doneBreaktime2}
                    onChange={onChange}

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
                    name="breaktime3"
                    value={timecard.breaktime3}
                    onChange={onChange}

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
                    name="doneBreaktime3"
                    type="time"
                    value={timecard.doneBreaktime3}
                    onChange={onChange}

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
                    name="breaktime4"
                    value={timecard.breaktime4}
                    onChange={onChange}

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
                    name="doneBreaktime4"
                    type="time"
                    value={timecard.doneBreaktime4}
                    onChange={onChange}

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
                    label="Kết ca(*)"
                    name="endTime"
                    type="time"
                    value={timecard.endTime}
                    onChange={onChange}

                    InputLabelProps={{
                      shrink: true,
                    }}

                  />
                </Grid>

                <Grid item xs={12} sm={12} lg={12}>
                <h4>Số lần nghỉ(*)</h4>
                  <Select
                    native
                    value={numberOfBreaks}
                    name="numberOfBreaks"
                    onChange={handleNumberOfBreaks}
                    inputProps={{
                      name: 'age',
                      id: 'filled-age-native-simple',
                    }}
                  >
                   
                    <option value={1}>1 lần</option>
                    <option value={2}>2 lần</option>
                    <option value={3}>3 lần</option>
                    <option value={4}>4 lần</option>
                  </Select>


                </Grid>






                <Grid item xs={12} md={12} lg={12}>
                  <h4>Trạng thái(*)</h4>
                  <Select className={classes.formControl}
                    displayEmpty
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={IdStatusWork}
                    onChange={handleIdStatusWork}
                    defaultValue='Geasoas'
                  >
                    {statusWork.map((e) => {

                      return <MenuItem key={e.id} value={e.id}>{e.nameStatusWork}</MenuItem>




                    })}



                  </Select>


                </Grid>


              </form>
            </Container>



          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit} color="primary">
              Hủy bỏ
            </Button>
            <Button onClick={onSubmitEdit} color="primary">
              Cật nhật
            </Button>
          </DialogActions>
        </Dialog>










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

      </Menu>



    </>
  );
}
export default TimecardMoreMenu;