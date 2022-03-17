import { Button, Grid, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(() => ({
  buttonRoot: {
    minWidth: '180px',
    fontSize: '1rem',
    minHeight: '50px',
  },
}));

export default function SaveButtonSection({
  onSave = () => {},
  onCancel = () => {},
  cancelText = '취소',
  saveText = '',
}) {
  const classes = useStyles({});
  return (
    <Grid container spacing={2} justify="flex-end">
      <Grid item>
        <Button
          variant="outlined"
          onClick={onCancel}
          disableElevation={true}
          className={classes.buttonRoot}
        >
          {cancelText}
        </Button>
      </Grid>
      { saveText && 
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={onSave}
          disableElevation={true}
          className={classes.buttonRoot}
        >
          {saveText}
        </Button>
      </Grid>
      }
    </Grid>
  );
}
