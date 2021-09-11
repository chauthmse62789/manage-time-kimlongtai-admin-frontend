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
import RegularMessageListHead from 'src/components/_dashboard/regular-messages/RegularMessageListHead';
import RegularMessageListToolbar from 'src/components/_dashboard/regular-messages/RegularMessageToolbar';
import RegularMessageMoreMenu from 'src/components/_dashboard/regular-messages/RegularMessageMoreMenu';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { Grid } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import React from 'react';
import CallAPI from './../services/CallAPI';
import { ToastContainer, toast } from 'react-toastify';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import * as Config from '../constants/config'

const TABLE_HEAD = [
    { id: 'stt', label: 'STT', alignRight: false },
    { id: 'contentMessage', label: 'Nội dung', alignRight: false },
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
        return filter(array, (_user) => _user.contentMessage.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

export default function RegularMessage() {
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);




    const [regularMessagesInput, setRegularMessagesInput] = useState({
        contentMessage: '',





    });


    const onChange = (e) => {
        setRegularMessagesInput(
            { ...regularMessagesInput, [e.target.name]: e.target.value });


    }





    const [openSignUp, setOpenSignUp] = React.useState(false);

    const handleClickOpenSignUp = () => {

        setOpenSignUp(true);

    };




    const handleCloseSignUp = () => {

        setOpenSignUp(false);



    };


    const onSubmitSignUp = (e) => {
        e.preventDefault();

        handleCloseSignUp();
        CallAPI('/regular-messages', 'POST',
            {
                "contentMessage": regularMessagesInput.contentMessage,
            }




            , localStorage.getItem('jwt')).then(res => {
                if (res.status === 200) {
                    toast.success('🦄 Tạo nội dung tin nhắn thành công!', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    setTimeout(() => {
                        getRegularMessages()
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


                    toast.error('Tạo nội dung tin nhắn thất bại!', {
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


    const [regularMessages, setRegularMessages] = useState([]);

    function getRegularMessages() {
        axios.get(`${Config.API_URL}/regular-messages`, {
            'headers': { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }

        }).then(res => {
            setRegularMessages(res.data)
        })


    }

    useEffect(() => {
        getRegularMessages();

    }, []);





    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = regularMessages.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    // const handleClick = (event, name) => {
    //     const selectedIndex = selected.indexOf(name);
    //     let newSelected = [];
    //     if (selectedIndex === -1) {
    //         newSelected = newSelected.concat(selected, name);
    //     } else if (selectedIndex === 0) {
    //         newSelected = newSelected.concat(selected.slice(1));
    //     } else if (selectedIndex === selected.length - 1) {
    //         newSelected = newSelected.concat(selected.slice(0, -1));
    //     } else if (selectedIndex > 0) {
    //         newSelected = newSelected.concat(
    //             selected.slice(0, selectedIndex),
    //             selected.slice(selectedIndex + 1)
    //         );
    //     }
    //     setSelected(newSelected);
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

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - regularMessages.length) : 0;

    const filteredUsers = applySortFilter(regularMessages, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredUsers.length === 0;








    return (
        <Page title="Tin Nhắn Thông Thường |  Kim Long Tài">
            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                    Thiết Lập Ghi Chú
                    </Typography>
                    <Button onClick={handleClickOpenSignUp}
                        variant="contained"
                        component={RouterLink}
                        to="#"
                        startIcon={<Icon icon={plusFill} />}
                    >
                        Tạo nội dung tin nhắn
                    </Button>
                    <Dialog
                        open={openSignUp}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleCloseSignUp}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title">{"Tạo nội dung tin nhắn"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                Hành động này sẽ khởi tạo một nội dung tin nhắn
                            </DialogContentText>
                            <Container maxWidth="xl">
                                <br></br>
                                <form>
                                    <Grid container spacing={3}>


                                        <TextField fullWidth name="contentMessage" margin="normal" id="standard-basic" label="Nội dung" value={regularMessagesInput.contentMessage} onChange={onChange} />


                                    </Grid>
                                </form>
                            </Container>



                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseSignUp} color="primary">
                                Hủy bỏ
                            </Button>
                            <Button onClick={onSubmitSignUp} color="primary">
                                Tạo nội dung
                            </Button>
                        </DialogActions>
                    </Dialog>








                </Stack>

                <Card>
                    <RegularMessageListToolbar
                        numSelected={selected.length}
                        filterName={filterName}
                        onFilterName={handleFilterByName}
                    />

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <RegularMessageListHead
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={TABLE_HEAD}
                                    rowCount={regularMessages.length}
                                    numSelected={selected.length}
                                    onRequestSort={handleRequestSort}
                                    onSelectAllClick={handleSelectAllClick}
                                />
                                <TableBody>
                                    {filteredUsers
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, stt = 0) => {
                                            const { id, contentMessage } = row;
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
                                                    <TableCell align="left">{contentMessage}</TableCell>


                                                    <TableCell align="right">
                                                        <RegularMessageMoreMenu updateRegularMessages={() => getRegularMessages()} idRegularMessage={id} />
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
                        count={regularMessages.length}
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
