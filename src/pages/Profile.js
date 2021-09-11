import React, { useState, useEffect } from 'react';
import { Box, Grid, Container, Typography } from '@material-ui/core';
import Page from '../components/Page';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import account from '../_mocks_/account';
import CallAPI from './../services/CallAPI';

// ----------------------------------




function Profile() {



  const [user, setUser] = useState({ id: '', username: '', phone: '', email: '', firstName: '', lastName: '', role: '' });
  useEffect(() => {
    async function getUser() {
      CallAPI('/users/me', 'GET', null, localStorage.getItem('jwt')).then(res => {
        setUser({
          username: res.data.username,
          phone: res.data.phone,
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          id: res.data.id,
          email: res.data.email,
          role: res.data.role.name
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
    getUser();






  }, []);
  const onChange = (e) => {
    setUser(
      { ...user, [e.target.name]: e.target.value });
  }

  const onSubmit = (e) => {
    e.preventDefault();

    CallAPI(`/users/${account.id}`, 'PUT',
      {
        "firstName": user.firstName,
        "lastName": user.lastName,
        "phone": user.phone,
      }



      , localStorage.getItem('jwt')).then(res => {
        if(res.status===200){
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

  return (

    <Page title="Profile |  Kim Long Tài">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Hồ Sơ</Typography>
        </Box>

        <form>
          <Grid container spacing={3}>


            <Grid item xs={12} md={6} lg={4}>

              <TextField name="username" margin="normal" id="standard-basic" fullWidth label="Username" value={user.username} onChange={onChange} disabled />
              <TextField name="firstName" margin="normal" id="standard-basic" fullWidth label="Tên" value={user.firstName} onChange={onChange} />
              <TextField name="email" margin="normal" id="standard-basic" fullWidth label="Email" value={user.email} onChange={onChange} disabled />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <TextField name="role" margin="normal" id="standard-basic" fullWidth label="Quyền" value={user.role} onChange={onChange} disabled />
              <TextField name="lastName" margin="normal" id="standard-basic" fullWidth label="Họ" value={user.lastName} onChange={onChange} />
              <TextField name="phone" margin="normal" id="standard-basic" fullWidth label="Phone" value={user.phone} onChange={onChange} />
            </Grid>
          </Grid>

          <Grid item xs={12} sm={6} lg={4}>
            <Button onClick={onSubmit} style={{ borderRadius: '100px', backgroundColor: '#FEDA6A', color: '#211C0E', width: '200px', height: '50px' }} variant="contained" disableElevation>
              LƯU
            </Button>
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

        </form>


      </Container>
    </Page>
  );
}


export default Profile;
