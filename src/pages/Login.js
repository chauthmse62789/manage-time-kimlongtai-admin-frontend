import { experimentalStyled as styled } from '@material-ui/core/styles';
import {  Stack, Container, Typography } from '@material-ui/core';
// components
import Page from '../components/Page';
import { LoginForm } from '../components/authentication/login';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

// const SectionStyle = styled(Card)(({ theme }) => ({
//   width: '100%',
//   maxWidth: 464,
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'center',
//   margin: theme.spacing(2, 0, 2, 2)
// }));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <RootStyle title="Đăng Nhập | Kim Long Tài">
      {/* <AuthLayout>
        Don’t have an account? &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to="/register">
          Get started
        </Link>
      </AuthLayout> */}
{/* 
      <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Hi, Welcome Back
          </Typography>
          <img src="/static/illustrations/illustration_login.png" alt="login" />
        </SectionStyle>
      </MHidden> */}

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Đăng nhập
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>vào hệ thống quản lý thời gian</Typography>
          </Stack>
          {/* <AuthSocial /> */}

          <LoginForm />
{/* 
          <MHidden width="smUp">
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
              Don’t have an account?&nbsp;
              <Link variant="subtitle2" component={RouterLink} to="register">
                Get started
              </Link>
            </Typography>
          </MHidden> */}
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
