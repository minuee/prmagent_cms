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
import { fetchInquiry } from './common';
import { downloadURI, parseRangeToUTC } from 'utils';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentPage,currentPageName,currentInquiryStartDate,currentInquiryEndDate,currentInquirySortFilter,currentInquirySortASC,currentInquiryShowOnly,currentInquiryChevronDirection } from "../../redux/state";

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

export default function InquiryPage(props) {  
    const [startDate, setStartDate] = useRecoilState(currentInquiryStartDate);
    const [endDate, setEndDate] = useRecoilState(currentInquiryEndDate);  
    const [page, setPage] = useRecoilState(currentPage);
    const [pageName, setPageName] = useRecoilState(currentPageName);
    if( props.location.pathname !== pageName ) {
        setPage(1);
        setPageName(props.location.pathname)
    }
    
    const [sortFilter, setSortFilter] = useRecoilState(currentInquirySortFilter);
    const [asc, setAsc] = useRecoilState(currentInquirySortASC);
    const [chevronDirection, setChevronDirection] = useRecoilState(currentInquiryChevronDirection);
    const [showOnly, setShowOnly] = useRecoilState(currentInquiryShowOnly);
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

        const { url } = await apiObject.downloadInquiryExcel({
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
    const prefetchInquiry = (sys_inqry_no) =>
        queryClient.prefetchQuery(['inquiry', 'detail', sys_inqry_no],
        () => fetchInquiry(sys_inqry_no),
        {
            staleTime: 10 * 1000,
        }
        );

    const handleSearchBtnClick = () => {
        setPage(1);
        inquiryListQuery.refetch({});
    };
    
    const handleRowClick = (row) => {
        history.push(`${url}/${row.sys_inqry_no}`);
    };
    
    const handleRowHover = (row) => {
        prefetchInquiry(row.sys_inqry_no);
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

    const inquiryListQuery = useQuery(['inquiry', 'list', page, sortFilter, asc,answeryn],
        () => apiObject.getInquiryList({
            page,
            limit: 10,
            order: sortFilter,
            asc,
            start_dt: parseRangeToUTC(startDate, endDate).start,
            end_dt: parseRangeToUTC(startDate, endDate).end,
            excel_download: false,
            filter_answeryn : answeryn
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
        },
        {
            Header: () => (
                <Box display="flex" justifyContent="center" alignItems="center" maxHeight={20}>
                    작성자
                    {
                        sortFilter === 'name' && (
                        <IconButton onClick={handleChevronClick} className={classes.filterChevron}>
                            <KeyboardArrowDownIcon />
                        </IconButton>
                        )
                    }
                </Box>
            ),
            accessor: 'user_nm',
        },
        {
            Header: '제목',
            accessor: 'title',
        },
        {
            Header: () => (
                <Box display="flex" justifyContent="center" alignItems="center" maxHeight={20}>
                    작성일자
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
            Header: '답변일자',
            accessor: 'answer_dt',
        },
        {
            Header: '비고',
            accessor: 'answer_yn_text',
        },
    ],
        [asc, sortFilter]
    );

    const data = React.useMemo(() =>
        inquiryListQuery.isLoading
        ? 
        []
        : 
        inquiryListQuery.data.list.map((item,idx) => ({
            ...item,
            seq : page === 1 ? (inquiryListQuery.data.total_count)-idx : (inquiryListQuery.data.total_count)-((page-1)*10)-idx,
            reg_dt: item.reg_dt ? dayjs.unix(item.reg_dt).format('YYYY-MM-DD') : '-',
            answer_dt: item.answer_dt ? dayjs.unix(item.answer_dt).format('YYYY-MM-DD') : '-',
            answer_yn_text : item.answer_dt ? '답변완료' : '대기중',
        })),
        [inquiryListQuery.data, page]
    );    
    return (
        <div>
            <PageSubtitle textContent="문의사항" renderEndSection={() => (
                <>
                    <Button
                        variant="contained"
                        disableElevation={true}
                        size="small"
                        backgroundColor={'#fff'}
                        onClick={()=>handleFilterAnswerYN(!answeryn)}
                        className={answeryn ? classes.headerSmallOnBtn : classes.headerSmallBtn}
                    >
                        미답변만
                    </Button>
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
                inquiryListQuery.isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="30vh">
                        <CircularProgress size={100} />
                    </Box>
                ) : (
                    <Box mb={2.5}>
                        <BaseTable
                            columns={columns}
                            data={data}
                            pageCount={ inquiryListQuery.isLoading ? 1 : Math.ceil(inquiryListQuery.data.total_count / 10)}
                            actualPage={page}
                            setPage={setPage}
                            onRowclick={handleRowClick}
                            onRowHover={handleRowHover}
                            renderLeftTail={() => ( <StartIconButton category="excel" onClick={handleExcelBtnClick} />)}
                            renderRightTail={() => ( <StartIconButton category="write" onClick={handleWriteBtnClick} />)}
                        />
                    </Box>
                )
            }
            {excelLoading && <LinearProgress />}
        </div>
    );
}


