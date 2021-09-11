import React from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '40ch',
      float: 'left'
    },
  },
}));

export default function ProfileForm() {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField fullWidth  id="standard-basic" label="First Name" />
      <TextField id="standard-basic" label="Last Name " />
      <TextField  id="standard-basic" label="Email" />
      <TextField id="standard-basic" label="Phone" />
    </form>
  );
}