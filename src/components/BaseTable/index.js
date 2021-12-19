import { Box, Button, IconButton, makeStyles } from '@material-ui/core';
import React from 'react';
import { usePagination, useTable } from 'react-table';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
const useStyles = makeStyles((theme) => ({
  tableRoot: {
    '& th': {
      minWidth: 100,
    },
  },
  rowRoot: {
    '&:hover td': {
      backgroundColor: '#efefef',
    },
  },
  paginationIconBtn: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    minWidth: theme.spacing(4),
    minHeight: theme.spacing(4),
    color: theme.palette.common.black,
  },
  pageBtn: {
    borderRadius: '4px',
    width: theme.spacing(4),
    height: theme.spacing(4),
    minWidth: theme.spacing(4),
    minHeight: theme.spacing(4),
  },
  selectedIndex: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.common.black,
    '&:hover': {
      backgroundColor: theme.palette.grey[400],
    },
  },
}));
export default function BaseTable({
  columns,
  data,
  fetchData = () => {},
  onRowclick = () => {},
  onRowHover = () => {},
  actualPage = 1,
  setPage = () => {},
  pageCount: controlledPageCount = 25,
  renderLeftTail = null,
  renderRightTail = null,
  hasPagination = true,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: controlledPageCount,
    },
    usePagination
  );
  const classes = useStyles();

  // Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  React.useEffect(() => {
    gotoPage(actualPage - 1);
  }, [actualPage]);

  // Render the UI for your table
  return (
    <Box position="relative">
      <table
        {...getTableProps()}
        style={{ border: 'none', borderCollapse: 'collapse', width: '100%' }}
        className={classes.tableRoot}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              key={headerGroup.getHeaderGroupProps().key}
              {...headerGroup.getHeaderGroupProps()}
            >
              {headerGroup.headers.map((column) => (
                <th
                  key={column.getHeaderProps().key}
                  {...column.getHeaderProps()}
                  style={{
                    background: '#f1f2ea',
                    border: 'none',
                    color: '#333333',
                    fontWeight: 'bold',
                    padding: '18px 8px',
                  }}
                >
                  {column.render('Header')}
                  {/* <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span> */}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                key={row.getRowProps().key}
                {...row.getRowProps()}
                style={{
                  borderBottom: 'solid 1px #dddddd',
                  cursor: 'pointer',
                }}
                className={classes.rowRoot}
                onClick={() => onRowclick(row.original, row)}
                onMouseEnter={() => onRowHover(row.original, row)}
              >
                {row.cells.map((cell) => {
                  return (
                    <td
                      key={cell.getCellProps().key}
                      {...cell.getCellProps()}
                      style={{
                        padding: '16px',
                        border: 'none',
                        textAlign: 'center',
                      }}
                    >
                      {cell.render('Cell')}
                      {/* {typeof cell.value === 'function'
                        ? cell.value()
                        : cell.render('Cell')} */}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {hasPagination && (
        <Box
          mt={2.5}
          display="flex"
          justifyContent="center"
          position="relative"
        >
          <IconButton
            onClick={() => {
              gotoPage(0);
              setPage(1);
            }}
            disabled={!canPreviousPage}
            aria-label="go to first page"
            className={classes.paginationIconBtn}
          >
            <FirstPageIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setPage(pageIndex + 1 - 1);
              previousPage();
            }}
            disabled={!canPreviousPage}
            aria-label="go to previous page"
            className={classes.paginationIconBtn}
          >
            <NavigateBeforeIcon />
          </IconButton>
          {pageOptions.length <= 10 ? (
            pageOptions.map((o) => (
              <Button
                size="small"
                key={o}
                classes={{ root: classes.pageBtn }}
                className={`${o === pageIndex ? classes.selectedIndex : ''}`}
                onClick={() => {
                  gotoPage(o);
                  setPage(o + 1);
                }}
              >
                {o + 1}
              </Button>
            ))
          ) : (
            <>
              {pageIndex >= 5 && (
                <IconButton
                  disabled={true}
                  aria-label="..."
                  className={classes.paginationIconBtn}
                >
                  <MoreHorizIcon />
                </IconButton>
              )}
              {pageOptions
                .filter((o) => o >= pageIndex - 4 && o <= pageIndex + 4)
                .map((o) => (
                  <Button
                    size="small"
                    key={o}
                    classes={{ root: classes.pageBtn }}
                    className={`${
                      o === pageIndex ? classes.selectedIndex : ''
                    }`}
                    onClick={() => {
                      gotoPage(o);
                      setPage(o + 1);
                    }}
                  >
                    {o + 1}
                  </Button>
                ))}
              {pageIndex <= controlledPageCount - 6 && (
                <IconButton
                  disabled={true}
                  aria-label="..."
                  className={classes.paginationIconBtn}
                >
                  <MoreHorizIcon />
                </IconButton>
              )}
            </>
          )}
          <IconButton
            onClick={() => {
              setPage(pageIndex + 1 + 1);
              nextPage();
            }}
            disabled={!canNextPage}
            aria-label="go to next page"
            className={classes.paginationIconBtn}
          >
            <NavigateNextIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              gotoPage(controlledPageCount - 1);
              setPage(controlledPageCount);
            }}
            disabled={!canNextPage}
            aria-label="go to last page"
            className={classes.paginationIconBtn}
          >
            <LastPageIcon />
          </IconButton>
        </Box>
      )}
      {/* <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              controlledPageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2
          )}
        </code>
      </pre> */}
      {renderLeftTail != null && (
        <Box position="absolute" bottom={0} left={0}>
          {renderLeftTail()}
        </Box>
      )}
      {renderRightTail != null && (
        <Box position="absolute" bottom={0} right={0}>
          {renderRightTail()}
        </Box>
      )}
    </Box>
  );
}
