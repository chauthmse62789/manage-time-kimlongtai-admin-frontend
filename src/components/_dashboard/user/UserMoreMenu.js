import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import axios from 'axios';
// material
import { Menu, IconButton, ListItemIcon, ListItemText } from '@material-ui/core';
import CallAPI from './../../../services/CallAPI';
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
import lockFill from '@iconify/icons-eva/lock-fill';
import * as Config from './../../../constants/config';

import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import viLocale from 'date-fns/locale/vi';
import { MobileDatePicker } from '@material-ui/lab';
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

const UserMoreMenu = (props) => {

  const classes = useStyles();
  const [user, setUser] = useState({
    id: '',
    email: '',
    username: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    cmndcccd: '',
    store: '',
    dob: '',
    password: '',
    rePassword: '',



    role: ''
  });
  const navigate = useNavigate();
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);


  const [chooseStore, setChooseStore] = React.useState(props.idStore);
  const handleChooseStore = (event) => {
    setChooseStore(event.target.value);
  };

  const [alertValidate, setAlertValidate] = useState('');

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

    getUserbyId(id);
    getStores();
  };




  const handleCloseEdit = () => {

    setOpenEdit(false);



  };


  //Change Password
  const [openChangePassword, setOpenChangePassword] = React.useState(false);

  const handleOpenChangePassword = (id) => {

    setOpenChangePassword(true)

  };




  const handleCloseChangePassword = () => {

    setOpenChangePassword(false);



  };





  const onChange = (e) => {
    setUser(
      { ...user, [e.target.name]: e.target.value });
  }



  function deleteEmployeeById(id) {
    handleCloseDelete();
    CallAPI(`/users/${id}`, 'DELETE', null, sessionStorage.getItem('jwt')).then(res => {
 
      if (res.status === 200) {
        toast.success('???? X??a nh??n vi??n th??nh c??ng', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        props.updateEmployee({})
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
        toast.error('L???i! Th???t b???i', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate('/dashboard/user', { replace: true });
      }
      console.log(JSON.stringify(err));
    });






  }








  const onChangePassword = (e) => {
    e.preventDefault();

    if (user.password === user.rePassword) {
      handleCloseChangePassword();
      CallAPI(`/users/${props.idEmployee}`, 'PUT',
        {
          "password": user.password
        }



        , sessionStorage.getItem('jwt')).then(res => {
          if (res.status === 200) {
            toast.success('?????????i m???t kh???u th??nh c??ng', {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });


          }
          props.updateEmployee({})





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
            toast.error('L???i! ?????i m???t kh???u th???t b???i!', {
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


    } else {


      setAlertValidate('\nM???t kh???u kh??ng tr??ng kh???p!M???i nh???p l???i.')

    }




  }














  const onSubmitEdit = (e) => {
    e.preventDefault();
    handleCloseEdit();
    CallAPI(`/users/${props.idEmployee}`, 'PUT',
      {
        "username": user.username,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "dob": user.dob,
        "phone": user.phone,
        "cmndcccd": user.cmndcccd,
        "email": user.email,
        "address": user.address,
        "store": chooseStore
      }



      , sessionStorage.getItem('jwt')).then(res => {
        if (res.status === 200) {
          toast.success('???? C???t nh???t th??nh c??ng', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });


        }
        props.updateEmployee({})





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
          toast.error('L???i! C???t nh???t th???t b???i!', {
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






  function getUserbyId(id) {
    setOpenEdit(true);
    CallAPI(`/users/${id}`, 'GET', null, sessionStorage.getItem('jwt')).then(res => {
      setUser({
        username: res.data.username,
        phone: res.data.phone,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        dob: res.data.dob,
        id: res.data.id,
        cmndcccd: res.data.cmndcccd,
        email: res.data.email,
        role: res.data.role.name,
        address: res.data.address,
        store: res.data.store

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



  const [stores, setStores] = useState([]);

  function getStores() {
    axios.get(`${Config.API_URL}/stores`, {
      'headers': { 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') }

    }).then(res => {
      setStores(res.data);
    })


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







        <MenuItem onClick={handleOpenChangePassword} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={lockFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="?????i m???t kh???u" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <Dialog
          open={openChangePassword}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseChangePassword}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{"B???n c?? ch???c ch???n thay ?????i m???t kh???u nh??n vi??n n??y ?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              H??nh ?????ng n??y s??? ?????i m???t kh???u cho nh??n vi??n
            </DialogContentText>
            <br></br>

            <span style={{ color: 'red' }}>{alertValidate}</span>


            <Container maxWidth="lg">
              <br></br>
              <FormControl>
                <Grid container spacing={3}>
                  <TextField required type="password" name="password" margin="normal" id="standard-basic" fullWidth label="M???t kh???u" value={user.password} onChange={onChange} />
                  <TextField required name="rePassword" type="password" margin="normal" id="standard-basic" fullWidth label="Nh???p l???i m???t kh???u" value={user.rePassword} onChange={onChange} />





                </Grid>





                <Grid item xs={12} sm={6} lg={4}>

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
                </Grid>

              </FormControl>
            </Container>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseChangePassword} color="primary">
              H???y b???
            </Button>
            <Button onClick={onChangePassword} color="primary">
              ?????i m???t kh???u
            </Button>
          </DialogActions>
        </Dialog>












        <MenuItem onClick={() => handleClickOpenEdit(props.idEmployee)} component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={editFill} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="S???a" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <Dialog
          open={openEdit}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseEdit}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{"S???a th??ng tin nh??n vi??n"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              H??nh ?????ng n??y s??? c???t nh???t l???i th??ng tin nh??n vi??n
            </DialogContentText>
            <Container maxWidth="lg">
              <br></br>
              <FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={viLocale}>
                  <Grid container spacing={3}>




                    <TextField name="username" margin="normal" id="standard-basic" fullWidth label="Username" value={user.username} onChange={onChange} />
                    <TextField name="role" margin="normal" id="standard-basic" fullWidth label="Quy???n" value={user.role} onChange={onChange} disabled />

                    <TextField name="lastName" margin="normal" id="standard-basic" fullWidth label="H???" value={user.lastName} onChange={onChange} />

                    <TextField name="firstName" margin="normal" id="standard-basic" fullWidth label="T??n" value={user.firstName} onChange={onChange} />
                   
                   
                    <MobileDatePicker
                        label='Ng??y sinh(*)'
                        value={user.dob}
                        onChange={(newValue) => {
                          setUser({ ...user, dob: newValue });
                        }}
                        renderInput={(params) => <TextField fullWidth  {...params} />}
                      />



                    <TextField name="email" margin="normal" id="standard-basic" fullWidth label="Email" value={user.email} onChange={onChange} />

                    <TextField name="cmndcccd" type="number" margin="normal" id="standard-basic" fullWidth label="CMND/CCCD" value={user.cmndcccd} onChange={onChange} />
                    <TextField name="address" margin="normal" id="standard-basic" fullWidth label="?????a ch???" value={user.address} onChange={onChange} />
                    <TextField name="phone" type="number" margin="normal" id="standard-basic" fullWidth label="Phone" value={user.phone} onChange={onChange} />

                    <h4>C???a h??ng l??m vi???c(*)</h4>
                    <br></br>
                    <br></br>
                  </Grid>
                  <Grid container spacing={3}>

                    <Select className={classes.formControl}
                    fullWidth
                      displayEmpty
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={chooseStore}
                      onChange={handleChooseStore}
                      defaultValue='Geasoas'
                    >
                      {stores.map((e) => {
                        if (e.nameStore !== 'VIP') {
                          return <MenuItem key={e.id} value={e.id}>{e.nameStore + ' ' + e.addressStore}</MenuItem>


                        }
                        else {

                          return <MenuItem key={e.id} value={e.id}>{e.nameStore + ' ' + e.addressStore}</MenuItem>
                        }


                      }

                      )}



                    </Select>

                  </Grid>




                  <Grid item xs={12} sm={6} lg={4}>

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
                  </Grid>
                </LocalizationProvider>
              </FormControl>
            </Container>



          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit} color="primary">
              H???y b???
            </Button>
            <Button onClick={onSubmitEdit} color="primary">
              C???t nh???t
            </Button>
          </DialogActions>
        </Dialog>


        <MenuItem onClick={handleClickOpen} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="X??a" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{"B???n c?? ch???c ch???n x??a nh??n vi??n n??y ?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              H??nh ?????ng n??y s??? x??a nh??n vi??n ra kh???i h??? th???ng.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete} color="primary">
              H???y b???
            </Button>
            <Button onClick={() => deleteEmployeeById(props.idEmployee)} color="primary">
              X??a
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
export default UserMoreMenu;