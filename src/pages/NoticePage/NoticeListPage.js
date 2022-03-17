import {Box,Button,Checkbox,CircularProgress,IconButton,LinearProgress,makeStyles,Typography,} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import BaseTable from 'components/BaseTable';
import PageSubtitle from 'components/PageSubtitle';
import StartIconButton from 'components/StartIconButton';
import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { useQuery, useQueryClient } from 'react-query';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { downloadURI, parseRangeToUTC } from 'utils';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { apiObject } from 'api';
import dayjs from 'dayjs';
import { fetchNotice } from './common';

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentPage,currentPageName,currentNoticeStartDate,currentNoticeEndDate,currentNoticeSortFilter,currentNoticeSortASC,currentNoticeShowOnly,currentNoticeChevronDirection } from "../../redux/state";

const useStyles = makeStyles(() => ({
    orderFilterOption: { border: 0, paddingTop: '4px', paddingBottom: '4px' },
    headerSmallBtn: {
        maxHeight: '26px',
    },
    outlinedChip: {
        color: '#222',
        backgroundColor: '#fff',
    },
    filterChevron: {
        transform: (props) => props.chevronDirection ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform.2s ease-in',
    },
    limitedHeader: {
        maxHeight: 20,
    },
}));

export default function NoticeListPage(props) {

    const [startDate, setStartDate] = useRecoilState(currentNoticeStartDate);
    const [endDate, setEndDate] = useRecoilState(currentNoticeEndDate);  
    const [page, setPage] = useRecoilState(currentPage);
    const [pageName, setPageName] = useRecoilState(currentPageName);
    if( props.location.pathname !== pageName ) {
        setPage(1);
        setPageName(props.location.pathname)
    }
    //const [sortFilter, setSortFilter] = useState('no');
    //const [asc, setAsc] = useState(false);
    //const [chevronDirection, setChevronDirection] = useState(false);
    //const [showOnly, setShowOnly] = useState(false);
    const [sortFilter, setSortFilter] = useRecoilState(currentNoticeSortFilter);
    const [asc, setAsc] = useRecoilState(currentNoticeSortASC);
    const [chevronDirection, setChevronDirection] = useRecoilState(currentNoticeChevronDirection);
    const [showOnly, setShowOnly] = useRecoilState(currentNoticeShowOnly);

    useEffect(() => {
        setChevronDirection(asc);
        return () => {};
    }, [asc]);

    const classes = useStyles({ chevronDirection });
    const queryClient = useQueryClient();

    let history = useHistory();
    let { url } = useRouteMatch();
    const [excelLoading, setExcelLoading] = useState(false);

    const handleExcelBtnClick = async () => {
        setExcelLoading(true);

        const { url } = await apiObject.downloadNoticeExcel({
            order: sortFilter,
            asc,
            show_only: showOnly,
            start_dt: parseRangeToUTC(startDate, endDate).start,
            end_dt: parseRangeToUTC(startDate, endDate).end,
        });
        downloadURI(url, 'application/vnd.ms-excel', '', () =>
            setExcelLoading(false)
        );
    };

    const handleWriteBtnClick = () => {
        history.push(`${url}/create`);        
    };

    const prefetchNotice = (notice_no) =>
        queryClient.prefetchQuery(['notice', 'detail', notice_no],
        () => fetchNotice(notice_no),{
            staleTime: 10 * 1000,
        }
    );

    const handleSearchBtnClick = () => {
        setPage(1);
        noticeListQuery.refetch({});
    };

    const handleRowClick = (row) => {
        history.push(`${url}/detail/${row.notice_no}`);
    };

    const handleRowHover = (row) => {
        prefetchNotice(row.notice_no);
    };

    const handleSortFilter = async(event, newSortFilter) => {
        if (newSortFilter != null) {      
            if ( page > 1 ) {
                await setPage(1);
            }
            setAsc(false);
            setSortFilter(newSortFilter);
        }
    };

    const handleShowOnlyChange = async(event) => {  
        if ( page > 1 ) {
            await setPage(1);
        }
        setShowOnly(!showOnly);
    };

    const noticeListQuery = useQuery(['notice', 'list', page, sortFilter, asc, showOnly],
        () => apiObject.getNoticeList({
            page,
            limit: 10,
            order: sortFilter,
            asc,
            show_only: showOnly,
            start_dt: parseRangeToUTC(startDate, endDate).start,
            end_dt: parseRangeToUTC(startDate, endDate).end,
            excel_download: false,
        }),
        {
            keepPreviousData: true,
        }
    );

    const handleChevronClick = () => {
        setChevronDirection(!chevronDirection);
        setTimeout(() => setAsc(!asc), 200);
    };

    const handleDisplayCheckBoxChange = (e) => {
        e.stopPropagation();
    };

    const columns = React.useMemo(() => [
        {
            Header: () => (
                <Box display="flex" justifyContent="center" alignItems="center" maxHeight={20}>
                    번호
                    {
                        sortFilter === 'no' && (
                        <IconButton onClick={handleChevronClick} className={classes.filterChevron}>
                            <KeyboardArrowDownIcon />
                        </IconButton>
                        )
                    }
                </Box>
            ),
            accessor: 'seq',
        },
        {
            Header: '대상',
            accessor: 'recv_type_text',
        },
        {
            Header: '제목',
            accessor: 'title',
        },
        {
            Header: () => (
                <Box display="flex" justifyContent="center" alignItems="center" maxHeight={20}>
                    등록일
                    {
                        sortFilter === 'reg' && (
                        <IconButton onClick={handleChevronClick} className={classes.filterChevron}>
                            <KeyboardArrowDownIcon />
                        </IconButton>
                        )
                    }
                </Box>
            ),
            accessor: 'reg_dt',
        },
        {
            Header: () => (
                <Box display="flex" justifyContent="center" alignItems="center">작성자</Box>
            ),
            accessor: 'mngr_nm',
        },
        {
            Header: '조회수',
            accessor: 'view_count',
        },
        {
            Header: '노출허용',
            accessor: 'show_yn',
        },
    ],
        [asc, sortFilter]
    );

    const data = React.useMemo(() =>
        noticeListQuery.isLoading
        ? 
        []
        :
        noticeListQuery.data.list.map((item,idx) => ({
            ...item,
            seq : page === 1 ? (noticeListQuery.data.total_count)-idx : (noticeListQuery.data.total_count)-((page-1)*10)-idx,
            reg_dt: item.reg_dt ? dayjs.unix(item.reg_dt).format('YYYY-MM-DD'): '-',
            show_yn : item.show_yn ? '사용' : '미사용'
            /* show_yn: () => (
                <Checkbox
                    disableRipple
                    disabled
                    checked={item.show_yn}
                    readOnly
                    color="default"
                    inputProps={{ 'aria-label': 'checkbox for notice exposure' }}
                    onClick={(e) => handleDisplayCheckBoxChange(e)}
                    name={item.notice_no}
                />
            ), */
        })),
            [noticeListQuery.data, page]
    );

    return (
        <div>
            <PageSubtitle
                textContent="공지사항"
                renderEndSection={() => (
                    <>
                        <ToggleButtonGroup
                            value={sortFilter}
                            exclusive
                            onChange={handleSortFilter}
                            aria-label="sortFilter"
                            size="small"
                        >
                            <ToggleButton
                                value="no"
                                aria-label="sort by number"
                                className={classes.headerSmallBtn}
                                classes={{ sizeSmall: classes.orderFilterOption }}
                            >
                                번호순
                            </ToggleButton>
                            <ToggleButton
                                value="reg"
                                aria-label="sort by date"
                                className={classes.headerSmallBtn}
                                classes={{ sizeSmall: classes.orderFilterOption }}
                            >
                                작성일자순
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <ToggleButtonGroup
                            exclusive
                            value={showOnly}
                            onChange={handleShowOnlyChange}
                            aria-label="show-only-exposed"
                            size="small"
                        >
                            <ToggleButton
                                value={true}
                                aria-label="sort only exposed"
                                className={classes.headerSmallBtn}
                                classes={{ sizeSmall: classes.orderFilterOption }}
                            >
                                노출만보기
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <Box display="flex" alignItems="center" pl={1} pr={1}>
                            <ReactDatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                selectsStart
                                startDate={startDate}
                                endDate={endDate}
                                dateFormat="yyyy-MM-dd"
                            />
                            <Box pl={1} pr={1}>
                                <Typography>~</Typography>
                            </Box>
                            <ReactDatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                selectsEnd
                                startDate={startDate}
                                endDate={endDate}
                                minDate={startDate}
                                dateFormat="yyyy-MM-dd"
                            />
                        </Box>
                        <Button
                            variant="contained"
                            disableElevation={true}
                            size="small"
                            onClick={handleSearchBtnClick}
                            className={classes.headerSmallBtn}
                        >
                            검색
                        </Button>
                    </>
                )}
            />
            {
                noticeListQuery.isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="30vh">
                        <CircularProgress size={100} />
                    </Box>
                ) : (
                    <Box mb={2.5}>
                        <BaseTable
                            columns={columns}
                            data={data}
                            pageCount={noticeListQuery.isLoading? 1: Math.ceil(noticeListQuery.data.total_count / 10)}
                            actualPage={page}
                            setPage={setPage}
                            onRowclick={handleRowClick}
                            onRowHover={handleRowHover}
                            renderLeftTail={() => (
                                <StartIconButton category="excel" onClick={handleExcelBtnClick} />
                            )}
                            renderRightTail={() => (
                                <StartIconButton category="write" onClick={handleWriteBtnClick} />
                            )}  
                        />
                    </Box>
                )
            }
            {
            excelLoading && <LinearProgress />}
        </div>
    );
}