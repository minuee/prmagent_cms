import {Box,Button,Chip,CircularProgress,IconButton,LinearProgress,makeStyles,Typography,} from '@material-ui/core';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import BaseTable from 'components/BaseTable';
import PageSubtitle from 'components/PageSubtitle';
import StartIconButton from 'components/StartIconButton';
import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { useHistory, useRouteMatch } from 'react-router-dom';
import dayjs from 'dayjs';
import { useQuery, useQueryClient } from 'react-query';
import { apiObject } from 'api';
import { fetchSubscr } from './common';
import { downloadURI, parseRangeToUTC } from 'utils';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import * as utils from "../../utils"

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentPage,currentPageName,currentSubscrStartDate,currentSubscrEndDate,currentSubscrSortFilter,currentSubscrSortASC,currentSubscrShowOnly,currentSubscrChevronDirection } from "../../redux/state";

const useStyles = makeStyles(() => ({
    orderFilterOption: { border: 0, paddingTop: '4px', paddingBottom: '4px' },
    headerSmallBtn: {
        maxHeight: '26px',
        backgroundColor:'#fff'
    },
    headerSmallOnBtn: {
        maxHeight: '26px',
        backgroundColor:'#ddd'
    },
    outlinedChip: {
        color: '#222',
        backgroundColor: '#fff',
    },
    filterChevron: {
        transform: (props) => props.chevronDirection ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform.2s ease-in',
    },
}));

export default function SubscrPage(props) {  
    const [startDate, setStartDate] = useRecoilState(currentSubscrStartDate);
    const [endDate, setEndDate] = useRecoilState(currentSubscrEndDate);  
    const [page, setPage] = useRecoilState(currentPage);
    const [pageName, setPageName] = useRecoilState(currentPageName);
    if( props.location.pathname !== pageName ) {
        setPage(1);
        setPageName(props.location.pathname)
    }
    
    const [sortFilter, setSortFilter] = useRecoilState(currentSubscrSortFilter);
    const [asc, setAsc] = useRecoilState(currentSubscrSortASC);
    const [chevronDirection, setChevronDirection] = useRecoilState(currentSubscrChevronDirection);
    const [showOnly, setShowOnly] = useRecoilState(currentSubscrShowOnly);
    const [answeryn, setAnsweryn] = useState(false);
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

        const { url } = await apiObject.downloadSubscrExcel({
            order: sortFilter,
            asc,
            start_dt: parseRangeToUTC(startDate, endDate).start,
            end_dt: parseRangeToUTC(startDate, endDate).end,
        });
        downloadURI(url, 'application/vnd.ms-excel', '', () =>
            setExcelLoading(false)
        );
    };
    const handleWriteBtnClick = () => {
        console.log('write');
    };
    const prefetchSubscr = (sys_subscr_no) =>
        queryClient.prefetchQuery(['Subscr', 'detail', sys_subscr_no],
        () => fetchSubscr(sys_subscr_no),
        {
            staleTime: 10 * 1000,
        }
        );

    const handleSearchBtnClick = () => {
        setPage(1);
        SubscrListQuery.refetch({});
    };
    
    const handleRowClick = (row) => {
        history.push(`${url}/${row.subscr_no}`);
    };
    
    const handleRowHover = (row) => {
        prefetchSubscr(row.subscr_no);
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

    const SubscrListQuery = useQuery(['Subscr', 'list', page, sortFilter, asc,answeryn],
        () => apiObject.getSubscrList({
            page,
            limit: 10,
            order: sortFilter,
            asc,
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

    const handleFilterAnswerYN = async(bool) => {
        console.log('handleFilterAnswerYN',bool);
        if ( page > 1 ) {
            await setPage(1);            
        }
        await setAnsweryn(bool);     
        setAsc(false);   
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
            width : 50
        },
        {
            Header: () => (
                <Box display="flex" justifyContent="center" alignItems="center" maxHeight={20}>
                    [브랜드]신청자
                    {
                        sortFilter === 'name' && (
                        <IconButton onClick={handleChevronClick} className={classes.filterChevron}>
                            <KeyboardArrowDownIcon />
                        </IconButton>
                        )
                    }
                </Box>
            ),
            id: "user_nm",            
            accessor: ({ user_nm,brand_nm }) => <Typography>[{brand_nm}]{user_nm}</Typography>,
            width : 100
        },
        {
            Header: '구독분류',
            accessor: 'subscr_type_name',
        },
        {
            Header: () => (
                <Box display="flex" justifyContent="center" alignItems="center" maxHeight={20}>
                    신청일자
                    {
                        sortFilter === 'reg' && (
                        <IconButton onClick={handleChevronClick} className={classes.filterChevron}>
                            <KeyboardArrowDownIcon />
                        </IconButton>
                        )
                    }
                </Box>
            ),
            accessor: 'subscr_req_dt3',
        },
        {
            Header: '결제금액',            
            id: "subscr_chrge_amt",            
            accessor: ({ subscr_chrge_amt }) => <Typography>{utils.numberWithCommas(subscr_chrge_amt)}</Typography>,
        },
        {
            Header: '결제상태',
            id: "settlement_type_name",            
            accessor: ({ settlement_type_name,settle_complet_yn_str }) => <Typography>{settlement_type_name} {settle_complet_yn_str}</Typography>,
        },
        {
            Header: '구독시작일',
            accessor: 'subscr_begin_de3',
        },
        {
            Header: '구독만료일',
            accessor: 'subscr_end_de3',
        },
    ],
        [asc, sortFilter]
    );

    const data = React.useMemo(() =>
        SubscrListQuery.isLoading
        ? 
        []
        : 
        SubscrListQuery.data.list.map((item,idx) => ({
            ...item,
            seq : page === 1 ? (SubscrListQuery.data.total_count)-idx : (SubscrListQuery.data.total_count)-((page-1)*10)-idx,
        })),
        [SubscrListQuery.data, page]
    );    
    return (
        <div>
            <PageSubtitle textContent="구독관리" renderEndSection={() => (
                <>                   
                    <ToggleButtonGroup value={sortFilter} exclusive onChange={handleSortFilter} aria-label="sortFilter" size="small">
                        <ToggleButton value="name" aria-label="sort by name" className={classes.headerSmallBtn} classes={{ sizeSmall: classes.orderFilterOption }}>이름순</ToggleButton>
                        <ToggleButton value="reg" aria-label="sort by date" className={classes.headerSmallBtn} classes={{ sizeSmall: classes.orderFilterOption }}>작성일자순</ToggleButton>
                        <ToggleButton value="no" aria-label="sort by number" className={classes.headerSmallBtn} classes={{ sizeSmall: classes.orderFilterOption }}>번호순</ToggleButton>
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
                SubscrListQuery.isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="30vh">
                        <CircularProgress size={100} />
                    </Box>
                ) : (
                    <Box mb={2.5}>
                        <BaseTable
                            columns={columns}
                            data={data}
                            pageCount={ SubscrListQuery.isLoading ? 1 : Math.ceil(SubscrListQuery.data.total_count / 10)}
                            actualPage={page}
                            setPage={setPage}
                            onRowclick={handleRowClick}
                            onRowHover={handleRowHover}
                            renderLeftTail={() => ( <StartIconButton category="excel" onClick={handleExcelBtnClick} />)}
                            //renderRightTail={() => ( <StartIconButton category="write" onClick={handleWriteBtnClick} />)}
                        />
                    </Box>
                )
            }
            {excelLoading && <LinearProgress />}
        </div>
    );
}


