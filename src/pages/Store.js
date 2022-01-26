import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Button,
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
import StoreListHead from 'src/components/_dashboard/store/StoreListHead';
import StoreListToolbar from 'src/components/_dashboard/store/StoreListToolbar';
import StoreMoreMenu from 'src/components/_dashboard/store/StoreMoreMenu';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import {  Grid } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import React from 'react';
import CallAPI from './../services/CallAPI';
import { ToastContainer, toast } from 'react-toastify';
import * as Config from '../constants/config'

const TABLE_HEAD = [
  { id: 'STT', label: 'STT', alignRight: false },
  { id: 'nameStore', label: 'Tên Cửa Hàng', alignRight: false },
  { id: 'addressStore', label: 'Địa Chỉ', alignRight: false },
  { id: 'actionStore', label: 'Số lượng nhân viên', alignRight: false },
 
];
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


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
    return filter(array, (_user) => _user.nameStore.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Store() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('nameStore');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);




  const [storeInput, setStoreInput] = useState({ 
    nameStore: '',
    addressStore: '', 
 });

    const onChange = (e) => {
        setStoreInput(
        { ...storeInput, [e.target.name]: e.target.value });
    }




      //Edit employee
  const [openSignUp, setOpenSignUp] = React.useState(false);

  const handleClickOpenSignUp = () => {

    setOpenSignUp(true);

  };


 

  const handleCloseSignUp = () => {

    setOpenSignUp(false);



  };


  const onSubmitStore = (e) => {
    e.preventDefault();

      handleCloseSignUp();
      CallAPI('/stores', 'POST',
        {
          "nameStore":storeInput.nameStore,
          "addressStore": storeInput.addressStore,
         
        }
  
  
  
        , sessionStorage.getItem('jwt')).then(res => {
          if (res.status === 200) {
            toast.success('🦄 Tạo cửa hàng thành công!', {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
  
            setTimeout(() => {
             getStores()
            }, 1000)
          }
  
  
  
  
  
        }).catch(err => {
          console.log('inside catch block.');
          if (err.response) {
  
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
            console.log(err.response.data.m);
          } else if (err.request) {
            console.log(err.request);
          } else {
             
           
            toast.error('Tạo cửa hàng thất bại! ', {
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
  
 
  const [stores,setStores] = useState([]);

  function getStores(){
    axios.get(`${Config.API_URL}/stores`,{
      'headers': {'Authorization': 'Bearer ' + sessionStorage.getItem('jwt')}

    }).then(res=>{
        setStores(res.data)
    })


  }

  useEffect(() => {
    getStores();
    
  },[]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = stores.map((n) => n.name);
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

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - stores.length) : 0;

  const filteredUsers = applySortFilter(stores, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;
 





  const countAmountEmployeeActive = (data)=>{

    var count=0;
    data.map(
        (e) => {
            
        if(e.blocked===false){
          count=count + 1;

            
        }
        return 0
            
        


          
    });
    return count;


  }

  return (
    <Page title="Cửa Hàng | Kim Long Tài">
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
        Danh Sách Cửa Hàng
        </Typography>
        <Button onClick={handleClickOpenSignUp}
          variant="contained"
          component={RouterLink}
          to="#"
          startIcon={<Icon icon={plusFill} />}
        >
          Tạo thông tin cửa hàng
        </Button>
        <Dialog
          open={openSignUp}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleCloseSignUp}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">{"Tạo cửa hàng"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Hành động này sẽ khởi tạo một cửa hàng mới
            </DialogContentText>
            <Container maxWidth="xl">
              <form>
                <Grid container spacing={3}>


                  <Grid item xs={12} md={6} lg={6}>

                    <TextField required name="nameStore" margin="normal" id="standard-basic" fullWidth label="Tên cửa hàng" value={stores.username} onChange={onChange} />
                   

                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                  <TextField name="addressStore" margin="normal" id="standard-basic" fullWidth label="Địa chỉ" value={stores.email} onChange={onChange} />
              </Grid>
                </Grid>
                 <Grid item xs={12} sm={6} lg={4}>
                 
              
                </Grid>

              </form>
            </Container>



          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSignUp} color="primary">
              Hủy bỏ
            </Button>
            <Button onClick={onSubmitStore} color="primary">
              Tạo mới
            </Button>
          </DialogActions>
        </Dialog>



        




      </Stack>

      <Card>
        <StoreListToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <StoreListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={stores.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row,stt=0) => {
                    const { id,nameStore,addressStore,users_permissions_users } = row;
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
                        <TableCell align="left">{nameStore}</TableCell>
                        <TableCell align="left">{addressStore}</TableCell>
                        <TableCell align="left">{countAmountEmployeeActive(users_permissions_users)
                        
                    }</TableCell>
                       
                        <TableCell align="right">
                          <StoreMoreMenu updateStore={()=>getStores()} idStore={id} />
                        </TableCell>
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
          count={stores.length}
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
