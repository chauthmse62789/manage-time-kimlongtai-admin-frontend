// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
import axios from 'axios';
// components
import Page from '../components/Page';
import {
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppWeeklySales,
  AppCurrentVisits,
  AppWebsiteVisits,
} from '../components/_dashboard/app';
import { useState, useEffect } from 'react';
import * as Config from '../constants/config'
// ----------------------------------------------------------------------

export default function DashboardApp() {



  const [countTimecard, setCountTimecard] = useState([]);
  const [countStore, setCountStore] = useState([]);
  const [countNotes, setCountNotes] = useState([]);



  function getCountTimecards() {
    axios.get(`${Config.API_URL}/time-cards/count`, {
      'headers': { 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') }

    }).then(res => {
      setCountTimecard(res.data)
      
    })


  }


  
  function getCountStore() {
    axios.get(`${Config.API_URL}/stores/count`, {
      'headers': { 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') }

    }).then(res => {
      setCountStore(res.data)
      
    })


  }





    
  function getCountNotes() {
    axios.get(`${Config.API_URL}/notes/count`, {
      'headers': { 'Authorization': 'Bearer ' + sessionStorage.getItem('jwt') }

    }).then(res => {
      setCountNotes(res.data)
      
    })


  }


  useEffect(() => {
    getCountStore();
    getCountTimecards();
    getCountNotes();

  }, []);








  return (
    <Page title="Dashboard | Kim Long Tài">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4">Xin Chào!   </Typography>
         
        </Box>
        
       
        <Grid container spacing={3}>



        
          <Grid item xs={12} sm={6} md={3}>
            <AppWeeklySales amountStore={countStore} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppNewUsers />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppItemOrders amountTimecards={countTimecard} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBugReports  amountNotes={countNotes}/>
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks />
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
