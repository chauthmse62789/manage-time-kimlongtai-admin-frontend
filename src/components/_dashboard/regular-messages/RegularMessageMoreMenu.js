import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import editFill from '@iconify/icons-eva/edit-fill';
import { Link as RouterLink } from 'react-router-dom';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
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
import {  Grid, Container } from '@material-ui/core';
import { TextField } from '@material-ui/core';

// ----------------------------------------------------------------------


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



const RegularMessageMoreMenu = (props) => {


  

  const [regularMessage, setRegularMessage] = useState({
    contentMessage: ''



  });
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);





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


    
    getRegularMessageById(id);
    
  };




  

  const handleCloseEdit = () => {

    setOpenEdit(false);



  };
  const onChange = (e) => {
    setRegularMessage(
      { ...regularMessage, [e.target.name]: e.target.value });
  }



  function deleteRegularMessageById(id) {
    handleCloseDelete();
    CallAPI(`/regular-messages/${id}`, 'DELETE', null, sessionStorage.getItem('jwt')).then(res => {
      console.log(res.data)
      if (res.status === 200) {
        toast.success('???? X??a ghi ch?? th??nh c??ng!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        props.updateRegularMessages({})
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
        toast.error('L???i! X??a ghi ch?? th???t b???i!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        props.updateRegularMessages({});
      }
      console.log(JSON.stringify(err));
    });






  }











  const onSubmitEdit = (e) => {
    e.preventDefault();
    handleCloseEdit();

    CallAPI(`/regular-messages/${props.idRegularMessage}`, 'PUT',
      {
        "contentMessage": regularMessage.contentMessage
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
        props.updateRegularMessages({})





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






  function getRegularMessageById(id) {
    setOpenEdit(true);
    CallAPI(`/regular-messages/${id}`, 'GET', null, sessionStorage.getItem('jwt')).then(res => {
      setRegularMessage({
        contentMessage: res.data.contentMessage
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
          <DialogTitle id="alert-dialog-slide-title">{"B???n c?? ch???c ch???n x??a n???i dung tin nh???n n??y ?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              H??nh ?????ng n??y s??? x??a n???i dung tin nh???n.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete} color="primary">
              H???y b???
            </Button>
            <Button onClick={() => deleteRegularMessageById(props.idRegularMessage)} color="primary">
              X??a
            </Button>
          </DialogActions>
        </Dialog>












        <MenuItem onClick={() => handleClickOpenEdit(props.idRegularMessage)} component={RouterLink} to="#" sx={{ color: 'text.secondary' }}>
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
          <DialogTitle id="alert-dialog-slide-title">{"S???a n???i dung tin nh???n"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              H??nh ?????ng n??y s??? c???t nh???t l???i n???i dung tin nh???n
            </DialogContentText>
            <Container maxWidth="xl">
              <FormControl>
                <Grid container spacing={3}>


                  <Grid item xs={12} md={12} lg={12}>

                    <TextField style={{width: '300px' }} name="contentMessage" margin="normal" id="standard-basic" size='large' label="M?? t???" value={regularMessage.contentMessage} onChange={onChange} />

                  </Grid>

                



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
              H???y b???
            </Button>
            <Button onClick={onSubmitEdit} color="primary">
              C???t nh???t
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
export default RegularMessageMoreMenu;