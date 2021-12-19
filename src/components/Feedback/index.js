import { Button, makeStyles, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useEffect } from 'react';
import { useQueryClient } from 'react-query';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));
export default function Feedback({
  severity = 'success',
  open = false,
  setOpen = () => {},
}) {
  const classes = useStyles();
  const queryClient = useQueryClient();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    // queryClient.setQueryData(['feedback-severity'], '');
  };
  useEffect(() => {
    if (!open) {
      queryClient.setQueryData(['feedback-msg'], '');
    }

    return () => {};
  }, [open]);

  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity={queryClient.getQueryData(['feedback-severity'])}
        >
          {queryClient.getQueryData(['feedback-msg'])}
        </Alert>
      </Snackbar>
      {/* <Alert elevation={6} variant="filled" severity="warning">
        This is a warning message!
      </Alert>
      <Alert elevation={6} variant="filled" severity="info">
        This is an information message!
      </Alert> */}
    </div>
  );
}
