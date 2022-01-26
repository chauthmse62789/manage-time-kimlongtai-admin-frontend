import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Box, Button, Typography, Container } from '@material-ui/core';
// components
import { MotionContainer, varBounceIn } from '../components/animate';
import Page from '../components/Page';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <RootStyle title="404 Trang Không Tìm Thấy |  Kim Long Tài">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                Xin lỗi, trang không tìm thấy!
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }}>
            Xin lỗi, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Có lẽ bạn đã nhập sai URL?
              Hãy chắc chắn để kiểm tra chính tả.
            </Typography>

            <motion.div variants={varBounceIn}>
              <Box
                component="img"
                src="https://bizflyportal.mediacdn.vn/bizflyportal/459/347/2020/06/02/17/37/70515910726734841.jpg"
                sx={{ height: 260, mx: 'auto', my: { xs: 5, sm: 10 } }}
              />
            </motion.div>

            <Button to="/" size="large" variant="contained" component={RouterLink}>
              Về Trang Chủ
            </Button>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}
