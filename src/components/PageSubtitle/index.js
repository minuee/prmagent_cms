import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  titleContainer: {
    marginBottom: theme.spacing(2.25),
  },
  SubtitleText: {
    fontWeight: 'bold',
  },
}));

export default function PageSubtitle({
  textContent = '',
  renderEndSection = () => <span />,
}) {
  const classes = useStyles();

  return (
    <Grid
      container
      classes={{ root: classes.titleContainer }}
      justify="space-between"
      alignItems="center"
    >
      <Grid item>
        <Typography
          variant="h5"
          classes={{ root: classes.SubtitleText }}
          display="inline"
        >
          {textContent}
        </Typography>
      </Grid>
      <Grid item style={{ display: 'flex' }}>
        {renderEndSection()}
      </Grid>
    </Grid>
  );
}
