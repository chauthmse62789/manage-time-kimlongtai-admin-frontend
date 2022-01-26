import PropTypes from 'prop-types';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Link, Drawer, Typography, Avatar } from '@material-ui/core';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
import { MHidden } from '../../components/@material-extend';
import React from 'react';
import sidebarConfig from './SidebarConfig';
import account from '../../_mocks_/account';
import CallAPI from './../../services/CallAPI';
import { useState, useEffect } from 'react';
// ----------------------------------------------------------------------
import { useTime } from 'react-timer-hook';
const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200]
}));



const TimeSystemStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop:'10px',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200],
  color:'black'
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();
  const [user, setUser] = useState({
    username: '',
    role: ''
  });


  const DateTimer=()=> {
    const {
      seconds,
      minutes,
      hours,
      ampm,
    } = useTime({ format: '24-hour'});
  


    function alertTIME(){
              if(minutes===11 && seconds===30){
              return  console.log('access')
              }

    }
    return (
      <div style={{textAlign: 'left'}}>
        <div style={{fontSize: '17px'}}>
      Giờ Hệ Thống: <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span><span>{ampm}</span>
      {alertTIME()}
        </div>
      </div>
    );
  }

  function getInfo(){
    CallAPI('/users/me', 'GET', null, sessionStorage.getItem('jwt')).then(res => {
                
      setUser({
        username:  res.data.username,
        role:res.data.role.name
      
      
      })
  }).catch(err=>{
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
  useEffect(() => {
    getInfo();
  }, []);

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
      }}
    >
      <Box sx={{ px: 2.5, py: 3 }}>
        <Box component={RouterLink} to="/" sx={{ display: 'inline-flex' }}>
          <Logo />
        </Box>
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="#">
          <AccountStyle>
            <Avatar src={account.photoURL} alt="photoURL" />
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {user.username}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {user.role}
              </Typography>
            </Box>
          </AccountStyle>
          <Box sx={{ pb: 0 }}>
          <TimeSystemStyle>
                 <DateTimer  />
          </TimeSystemStyle>

          </Box>
          

        
        </Link>
      </Box>

      <NavSection navConfig={sidebarConfig} />

      <Box sx={{ flexGrow: 1 }} />

     
    </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default'
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
