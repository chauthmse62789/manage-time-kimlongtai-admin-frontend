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
import {  Grid, Container } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import lockFill from '@iconify/icons-eva/lock-fill';
import * as Config from './../../../constants/config';
// ----------------------------------------------------------------------


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  formControl: {
    
    minWidth: 240,
    marginTop:10
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
    store:'',
    dob:'',
    password:'',
    rePassword:'',

    
    
    role: '' });
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
    CallAPI(`/users/${id}`, 'DELETE', null, localStorage.getItem('jwt')).then(res => {
      console.log(res.data)
      if (res.status === 200) {
        toast.success('🦄 Xóa nhân viên thành công', {
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
        toast.error('Lỗi! Thất bại', {
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
      "password":user.password
    }



    , localStorage.getItem('jwt')).then(res => {
      if (res.status === 200) {
        toast.success('🦄Đổi mật khẩu thành công', {
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
        toast.error('Lỗi! Đổi mật khẩu thất bại!', {
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


  }else{


    setAlertValidate('\nMật khẩu không trùng khớp!Mời nhập lại.')

  }

 


}














  const onSubmitEdit = (e) => {
    e.preventDefault();
    handleCloseEdit();
    CallAPI(`/users/${props.idEmployee}`, 'PUT',
      {
        "username":user.username,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "dob":user.dob,
        "phone": user.phone,
        "cmndcccd":user.cmndcccd,
        "email":user.email,
        "address":user.address,
        "store":chooseStore
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






  function getUserbyId(id) {
    setOpenEdit(true);
    CallAPI(`/users/${id}`, 'GET', null, localStorage.getItem('jwt')).then(res => {
      setUser({
        username: res.data.username,
        phone: res.data.phone,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        dob:res.data.dob,
        id: res.data.id,
        cmndcccd:res.data.cmndcccd,
        email: res.data.email,
        role: res.data.role.name,
        address:res.data.address,
        store:res.data.store
        
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



  const [stores,setStores] = useState([]);

  function getStores(){
    axios.get(`${Config.API_URL}/stores`,{
      'headers': {'Authorization': 'Bearer ' + localStorage.getItem('jwt')}

    }).then(res=>{
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
          <ListItemText primary="Đổi mật khẩu" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <Dialog
          open={openChangePassword}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseChangePassword}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{"Bạn có chắc chắn thay đổi mật khẩu nhân viên này ?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Hành động này sẽ đổi mật khẩu cho nhân viên
            </DialogContentText>
            <br></br>

            <span style={{ color: 'red' }}>{alertValidate}</span>


            <Container maxWidth="lg">
            <br></br>
            <FormControl>
                <Grid container spacing={3}>
                <TextField required type="password" name="password" margin="normal" id="standard-basic" fullWidth label="Mật khẩu" value={user.password} onChange={onChange} />
                <TextField required name="rePassword" type="password" margin="normal" id="standard-basic" fullWidth label="Nhập lại mật khẩu" value={user.rePassword} onChange={onChange} />
               

                 

                 
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
              Hủy bỏ
            </Button>
            <Button onClick={onChangePassword} color="primary">
              Đổi mật khẩu
            </Button>
          </DialogActions>
        </Dialog>












        <MenuItem onClick={() => handleClickOpenEdit(props.idEmployee)} component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
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
          <DialogTitle id="alert-dialog-slide-title">{"Sửa thông tin nhân viên"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Hành động này sẽ cật nhật lại thông tin nhân viên
            </DialogContentText>
            <Container maxWidth="lg">
            <br></br>
            <FormControl>
                <Grid container spacing={3}>


                 

                    <TextField name="username" margin="normal" id="standard-basic" fullWidth label="Username" value={user.username} onChange={onChange} />
                    <TextField name="role" margin="normal" id="standard-basic" fullWidth label="Quyền" value={user.role} onChange={onChange} disabled />
                  
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

                      />
                    <TextField name="email" margin="normal" id="standard-basic" fullWidth label="Email" value={user.email} onChange={onChange} />
                
                    <TextField name="cmndcccd" type="number" margin="normal" id="standard-basic" fullWidth label="CMND/CCCD" value={user.cmndcccd} onChange={onChange} />
                    <TextField name="address" margin="normal" id="standard-basic" fullWidth label="Địa chỉ" value={user.address} onChange={onChange} />
                    <TextField name="phone" type="number" margin="normal" id="standard-basic" fullWidth label="Phone" value={user.phone} onChange={onChange} />
                    
                    <h4>Cửa hàng làm việc(*)</h4>
                  <br></br>
                  <br></br>
                    </Grid>
                    <Grid container spacing={3}>
                   
                    <Select  className={classes.formControl}
                    displayEmpty
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              value={chooseStore}
                              onChange={handleChooseStore}
                              defaultValue='Geasoas'
                            >
                                {stores.map( (e) => {
                                    if(e.nameStore!=='VIP'){
                                      return <MenuItem key={e.id} value={e.id}>{e.nameStore + ' ' + e.addressStore}</MenuItem>


                                    }
                                    else{

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

             </FormControl>
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


        <MenuItem onClick={handleClickOpen} sx={{ color: 'text.secondary' }}>
          <ListItemIcon>
            <Icon icon={trash2Outline} width={24} height={24} />
          </ListItemIcon>
          <ListItemText primary="Xóa" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseDelete}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{"Bạn có chắc chắn xóa nhân viên này ?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Hành động này sẽ xóa nhân viên ra khỏi hệ thống.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete} color="primary">
              Hủy bỏ
            </Button>
            <Button onClick={() => deleteEmployeeById(props.idEmployee)} color="primary">
              Xóa
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