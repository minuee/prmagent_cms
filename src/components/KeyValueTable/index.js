import React from 'react';

import { Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    borderTop: '1px solid #dddddd',
  },
  rowContainer: (props) => ({
    borderBottom: '1px solid #dddddd',
    flexBasis: props.basis,
  }),
  rootContainer: (props) => ({
    paddingTop: props.disableGutter ? 0 : theme.spacing(2.25),
    paddingLeft: theme.spacing(2.5),
    paddingBottom: props.disableGutter ? 0 : theme.spacing(2),
    fontWeight: 500,
    display: props.disableGutter ? 'flex' : 'block',
  }),
  keyContainer: {
    flexBasis: '140px',
    backgroundColor: '#f1f2ea',
  },
  valueContainer: { flex: 1 },
}));

export function KeyValuePair({
  keyText = '',
  valText = '',
  isHalf = true,
  disableGutter = false,
}) {
  const classes = useStyles({
    basis: isHalf ? '50%' : '100%',
    disableGutter,
  });
  return (
    <Grid container item classes={{ root: classes.rowContainer }} wrap="nowrap">
      <Grid
        classes={{ root: classes.rootContainer, item: classes.keyContainer }}
        item
        alignItems="center"
        container
      >
        {keyText}
      </Grid>
      <Grid
        classes={{ root: classes.rootContainer, item: classes.valueContainer }}
        item
      >
        {typeof valText === 'function' ? valText() : valText}
      </Grid>
    </Grid>
  );
}

export default function KeyValueTable({ dataSource = [] }) {
  const classes = useStyles({});
  return (
    <Grid container wrap={'wrap'} className={classes.tableContainer}>
      {dataSource.map((d) => (
        <KeyValuePair
          key={d.keyText}
          isHalf={d.isHalf}
          keyText={d.keyText}
          valText={d.valText}
          disableGutter={d.disableGutter}
        />
      ))}
    </Grid>
  );
}
