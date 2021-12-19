import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, LinearProgress } from '@material-ui/core';
import PageSubtitle from 'components/PageSubtitle';
import StartIconButton from 'components/StartIconButton';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import { apiObject } from 'api';
import { downloadURI } from 'utils';

import UserTable from 'components/UserTable';
import { UserTable as header } from './UsersPageMock';

/* 서랍장 상태 관리 */
import { useRecoilState } from "recoil";
import { currentPage,currentPageName,currentUserListOpen,currentUserListChecked,currentUserListSearch,currentUserListFilter,currentUserListAlign} from "../../redux/state";


export default function UsersPage(props) {
  // 컬럼별 필터 dialog open handle
  const [open, setOpen] = useRecoilState(currentUserListOpen);

  // 컬럼별 필터 dialog 조회데이터 관리
  const [checked, setChecked] = useRecoilState(currentUserListChecked);

  // 검색 데이터 관리
  const [searchText, setSearchText] = useRecoilState(currentUserListSearch);

  // 컬럼별 필터검색 active 체크
  const [filterActive, setFilterActive] = useRecoilState(currentUserListFilter);

  // 검색 정렬값 관리
  const [align, setAlign] = useRecoilState(currentUserListAlign);

  let history = useHistory();
  let { url } = useRouteMatch();
  const [page, setPage] = useRecoilState(currentPage);
  const [pageName, setPageName] = useRecoilState(currentPageName);
  if( props.location.pathname !== pageName ) {
      setPage(1);
      setPageName(props.location.pathname)
  }

  const userListQuery = useQuery(
    [
      'users',
      page,
      searchText.num,
      searchText.user_nm,
      searchText.user_type_text,
      searchText.company_nm,
      searchText.position,
      // searchText.reg_dt_excel,
      searchText.start_reg_dt,
      searchText.end_reg_dt,
      searchText.subscript_type,
      searchText.active_text,
      // searchText.expire_dt_excel,
      searchText.start_expire_dt,
      searchText.end_expire_dt,
      searchText.amount_excel,
      align.order,
      align.asc,
    ],
    async () =>
      await apiObject.getUserList({
        page,
        limit: 10,
        num_search_text_str: searchText.num,
        user_nm_search_text_str: searchText.user_nm,
        user_type_text_search_text_str: searchText.user_type_text,
        company_search_text_str: searchText.company_nm,
        potision_search_text_str: searchText.position,
        // reg_dt_search_text_str: searchText.reg_dt_excel,
        start_reg_dt: searchText.start_reg_dt,
        end_reg_dt: searchText.end_reg_dt,
        subscript_type_search_text_str: searchText.subscript_type,
        active_text: searchText.active_text,
        // expire_dt_search_text_str: searchText.expire_dt_excel,
        start_expire_dt: searchText.start_expire_dt,
        end_expire_dt: searchText.end_expire_dt,
        amount_search_text_str: searchText.amount_excel,
        order:
          align.order === 'reg_dt_excel'
            ? 'reg_dt'
            : align.order === 'amount_excel'
            ? 'amount'
            : align.order === 'expire_dt_excel'
            ? 'expire_dt'
            : align.order === 'active_text'
            ? 'active_yn'
            : align.order,
        asc: align.asc,
        excel_download: false,
      }),
    { keepPreviousData: true }
  );

  const data = React.useMemo(
    () =>
      userListQuery.isLoading
        ? []
        : userListQuery.data.list.map((item) => ({
            ...item,
            reg_dt: item.reg_dt
              ? dayjs.unix(item.reg_dt).format('YYYY-MM-DD')
              : '-',
            expire_dt: item.expire_dt
              ? dayjs.unix(item.expire_dt).format('YYYY-MM-DD')
              : '-',
            subscript_type: item.subscript_type ? item.subscript_type : '-',
            logo_img_url: item.user_type === 'STYLIST' ? '' : item.logo_img_url,
          })),
    [userListQuery.data, page]
  );

  const [excelLoading, setExcelLoading] = useState(false);

  const handleExcelBtnClick = async () => {
    setExcelLoading(true);
    const { url } = await apiObject.downloadUserExcel(
      // { search_text: searchInput },
      () => {}
    );
    downloadURI(url, 'application/vnd.ms-excel', '', () =>
      setExcelLoading(false)
    );
  };

  const handleDetail = (no, user_type) => {
    history.push(`${url}/${no}/${user_type}`);
  };

  const handleFilterOpen = (type) => {
    setChecked({
      num: [],
      user_nm: [],
      user_type_text: [],
      company_nm: [],
      position: [],
      // reg_dt_excel: [],
      start_reg_dt: '',
      end_reg_dt: '',
      subscript_type: [],
      active_text: [],
      // expire_dt_excel: [],
      start_expire_dt: '',
      end_expire_dt: '',
      amount_excel: [],
    });
    if (type === 'num') {
      setOpen({
        num: !open.num,
        user_nm: false,
        user_type_text: false,
        company_nm: false,
        position: false,
        reg_dt_excel: false,
        subscript_type: false,
        active_text: false,
        expire_dt_excel: false,
        amount_excel: false,
      });
    } else if (type === 'user_nm') {
      setOpen({
        num: false,
        user_nm: !open.user_nm,
        user_type_text: false,
        company_nm: false,
        position: false,
        reg_dt_excel: false,
        subscript_type: false,
        active_text: false,
        expire_dt_excel: false,
        amount_excel: false,
      });
    } else if (type === 'user_type_text') {
      setOpen({
        num: false,
        user_nm: false,
        user_type_text: !open.user_type_text,
        company_nm: false,
        position: false,
        reg_dt_excel: false,
        subscript_type: false,
        active_text: false,
        expire_dt_excel: false,
        amount_excel: false,
      });
    } else if (type === 'company_nm') {
      setOpen({
        num: false,
        user_nm: false,
        user_type_text: false,
        company_nm: !open.company_nm,
        position: false,
        reg_dt_excel: false,
        subscript_type: false,
        active_text: false,
        expire_dt_excel: false,
        amount_excel: false,
      });
    } else if (type === 'position') {
      setOpen({
        num: false,
        user_nm: false,
        user_type_text: false,
        company_nm: false,
        position: !open.position,
        reg_dt_excel: false,
        subscript_type: false,
        active_text: false,
        expire_dt_excel: false,
        amount_excel: false,
      });
    } else if (type === 'reg_dt_excel') {
      setOpen({
        num: false,
        user_nm: false,
        user_type_text: false,
        company_nm: false,
        position: false,
        reg_dt_excel: !open.reg_dt_excel,
        subscript_type: false,
        active_text: false,
        expire_dt_excel: false,
        amount_excel: false,
      });
    } else if (type === 'subscript_type') {
      setOpen({
        num: false,
        user_nm: false,
        user_type_text: false,
        company_nm: false,
        position: false,
        reg_dt_excel: false,
        subscript_type: !open.subscript_type,
        active_text: false,
        expire_dt_excel: false,
        amount_excel: false,
      });
    } else if (type === 'active_text') {
      setOpen({
        num: false,
        user_nm: false,
        user_type_text: false,
        company_nm: false,
        position: false,
        reg_dt_excel: false,
        subscript_type: false,
        active_text: !open.active_text,
        expire_dt_excel: false,
        amount_excel: false,
      });
    } else if (type === 'expire_dt_excel') {
      setOpen({
        num: false,
        user_nm: false,
        user_type_text: false,
        company_nm: false,
        position: false,
        reg_dt_excel: false,
        subscript_type: false,
        active_text: false,
        expire_dt_excel: !open.expire_dt_excel,
        amount_excel: false,
      });
    } else if (type === 'amount_excel') {
      setOpen({
        num: false,
        user_nm: false,
        user_type_text: false,
        company_nm: false,
        position: false,
        reg_dt_excel: false,
        subscript_type: false,
        active_text: false,
        expire_dt_excel: false,
        amount_excel: !open.amount_excel,
      });
    } else {
      console.log('Wrong type...');
    }
  };

  // 필터 적용
  const handleFilterConfirm = (type) => {
    let result = '';
    if ( type !== 'active_text' && type !== 'reg_dt_excel' && type !== 'expire_dt_excel' ) {
      checked[type].map((d, i) => {
        if (d !== '모두선택') {
          if (i === checked[type].length - 1) {
            result += d;
          } else {
            result += d + ',';
          }
        }
      });
      setSearchText({
        ...searchText,
        [type]: result,
      });
    } else if (type === 'reg_dt_excel') {
      setSearchText({
        ...searchText,
        start_reg_dt: checked.start_reg_dt,
        end_reg_dt: checked.end_reg_dt,
      });
    } else if (type === 'expire_dt_excel') {
      setSearchText({
        ...searchText,
        start_expire_dt: checked.start_expire_dt,
        end_expire_dt: checked.end_expire_dt,
      });
    } else {
      if (checked[type].length === 0 || checked[type].length > 1) {
        result = '';
      } else {
        result = checked[type][0];

        setSearchText({
          ...searchText,
          [type]: result,
        });
      }
    }

    // setSearchText({
    //   ...searchText,
    //   [type]: result,
    // });

    setPage(1);
  };

  // 필터 지우기
  const handleFilterInit = (type) => {
    if (type === 'reg_dt_excel') {
      setSearchText({
        ...searchText,
        start_reg_dt: '',
        end_reg_dt: '',
      });
    } else if (type === 'expire_dt_excel') {
      setSearchText({
        ...searchText,
        start_expire_dt: '',
        end_expire_dt: '',
      });
    } else {
      setSearchText({
        ...searchText,
        [type]: '',
      });
    }
    setPage(1);
  };

  useEffect(() => {
    if (!userListQuery.isLoading) {
      if (align.order === 'num') {
        if (
          searchText.user_nm === '' &&
          searchText.user_type_text === '' &&
          searchText.company_nm === '' &&
          searchText.position === '' &&
          searchText.reg_dt_excel === '' &&
          searchText.subscript_type === '' &&
          searchText.active_text === '' &&
          searchText.expire_dt_excel === '' &&
          searchText.amount_excel === ''
        ) {
          setFilterActive({
            num: true,
            user_nm: false,
            user_type_text: false,
            company_nm: false,
            position: false,
            reg_dt_excel: false,
            subscript_type: false,
            active_text: false,
            expire_dt_excel: false,
            amount_excel: false,
          });
        }
      } else if (align.order === 'user_nm') {
        if (
          searchText.num === '' &&
          searchText.user_type_text === '' &&
          searchText.company_nm === '' &&
          searchText.position === '' &&
          searchText.reg_dt_excel === '' &&
          searchText.subscript_type === '' &&
          searchText.active_text === '' &&
          searchText.expire_dt_excel === '' &&
          searchText.amount_excel === ''
        ) {
          setFilterActive({
            num: false,
            user_nm: true,
            user_type_text: false,
            company_nm: false,
            position: false,
            reg_dt_excel: false,
            subscript_type: false,
            active_text: false,
            expire_dt_excel: false,
            amount_excel: false,
          });
        }
      } else if (align.order === 'user_type_text') {
        if (
          searchText.num === '' &&
          searchText.user_nm === '' &&
          searchText.company_nm === '' &&
          searchText.position === '' &&
          searchText.reg_dt_excel === '' &&
          searchText.subscript_type === '' &&
          searchText.active_text === '' &&
          searchText.expire_dt_excel === '' &&
          searchText.amount_excel === ''
        ) {
          setFilterActive({
            num: false,
            user_nm: false,
            user_type_text: true,
            company_nm: false,
            position: false,
            reg_dt_excel: false,
            subscript_type: false,
            active_text: false,
            expire_dt_excel: false,
            amount_excel: false,
          });
        }
      } else if (align.order === 'company_nm') {
        if (
          searchText.num === '' &&
          searchText.user_nm === '' &&
          searchText.user_type_text === '' &&
          searchText.position === '' &&
          searchText.reg_dt_excel === '' &&
          searchText.subscript_type === '' &&
          searchText.active_text === '' &&
          searchText.expire_dt_excel === '' &&
          searchText.amount_excel === ''
        ) {
          setFilterActive({
            num: false,
            user_nm: false,
            user_type_text: false,
            company_nm: true,
            position: false,
            reg_dt_excel: false,
            subscript_type: false,
            active_text: false,
            expire_dt_excel: false,
            amount_excel: false,
          });
        }
      } else if (align.order === 'position') {
        if (
          searchText.num === '' &&
          searchText.user_nm === '' &&
          searchText.user_type_text === '' &&
          searchText.company_nm === '' &&
          searchText.reg_dt_excel === '' &&
          searchText.subscript_type === '' &&
          searchText.active_text === '' &&
          searchText.expire_dt_excel === '' &&
          searchText.amount_excel === ''
        ) {
          setFilterActive({
            num: false,
            user_nm: false,
            user_type_text: false,
            company_nm: false,
            position: true,
            reg_dt_excel: false,
            subscript_type: false,
            active_text: false,
            expire_dt_excel: false,
            amount_excel: false,
          });
        }
      } else if (align.order === 'reg_dt_excel') {
        if (
          searchText.num === '' &&
          searchText.user_nm === '' &&
          searchText.user_type_text === '' &&
          searchText.company_nm === '' &&
          searchText.position === '' &&
          searchText.subscript_type === '' &&
          searchText.active_text === '' &&
          searchText.expire_dt_excel === '' &&
          searchText.amount_excel === ''
        ) {
          setFilterActive({
            num: false,
            user_nm: false,
            user_type_text: false,
            company_nm: false,
            position: false,
            reg_dt_excel: true,
            subscript_type: false,
            active_text: false,
            expire_dt_excel: false,
            amount_excel: false,
          });
        }
      } else if (align.order === 'subscript_type') {
        if (
          searchText.num === '' &&
          searchText.user_nm === '' &&
          searchText.user_type_text === '' &&
          searchText.company_nm === '' &&
          searchText.position === '' &&
          searchText.reg_dt_excel === '' &&
          searchText.active_text === '' &&
          searchText.expire_dt_excel === '' &&
          searchText.amount_excel === ''
        ) {
          setFilterActive({
            num: false,
            user_nm: false,
            user_type_text: false,
            company_nm: false,
            position: false,
            reg_dt_excel: false,
            subscript_type: true,
            active_text: false,
            expire_dt_excel: false,
            amount_excel: false,
          });
        }
      } else if (align.order === 'active_text') {
        if (
          searchText.num === '' &&
          searchText.user_nm === '' &&
          searchText.user_type_text === '' &&
          searchText.company_nm === '' &&
          searchText.position === '' &&
          searchText.reg_dt_excel === '' &&
          searchText.subscript_type === '' &&
          searchText.expire_dt_excel === '' &&
          searchText.amount_excel === ''
        ) {
          setFilterActive({
            num: false,
            user_nm: false,
            user_type_text: false,
            company_nm: false,
            position: false,
            reg_dt_excel: false,
            subscript_type: false,
            active_text: true,
            expire_dt_excel: false,
            amount_excel: false,
          });
        }
      } else if (align.ordr === 'expire_dt_excel') {
        if (
          searchText.num === '' &&
          searchText.user_nm === '' &&
          searchText.user_type_text === '' &&
          searchText.company_nm === '' &&
          searchText.position === '' &&
          searchText.reg_dt_excel === '' &&
          searchText.subscript_type === '' &&
          searchText.active_text === '' &&
          searchText.amount_excel === ''
        ) {
          setFilterActive({
            num: false,
            user_nm: false,
            user_type_text: false,
            company_nm: false,
            position: false,
            reg_dt_excel: false,
            subscript_type: false,
            active_text: false,
            expire_dt_excel: true,
            amount_excel: false,
          });
        }
      } else if (align.order === 'amount_excel') {
        if (
          searchText.num === '' &&
          searchText.user_nm === '' &&
          searchText.user_type_text === '' &&
          searchText.company_nm === '' &&
          searchText.position === '' &&
          searchText.reg_dt_excel === '' &&
          searchText.subscript_type === '' &&
          searchText.active_text === '' &&
          searchText.expire_dt_excel === ''
        ) {
          setFilterActive({
            num: false,
            user_nm: false,
            user_type_text: false,
            company_nm: false,
            position: false,
            reg_dt_excel: false,
            subscript_type: false,
            active_text: false,
            expire_dt_excel: false,
            amount_excel: true,
          });
        }
      }
    }
  }, [userListQuery, align, searchText]);

  return (
    <div>
      <PageSubtitle textContent="사용자 관리" />
      {userListQuery.isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="30vh"
        >
          <CircularProgress size={100} />
        </Box>
      ) : (
        <Box mb={2.5}>
          <UserTable
            data={data}
            header={header}
            handleDetail={handleDetail}
            page={page}
            setPage={setPage}
            open={open}
            setOpen={handleFilterOpen}
            checked={checked}
            setChecked={setChecked}
            searchText={searchText}
            setSearchText={setSearchText}
            filterActive={filterActive}
            setFilterActive={setFilterActive}
            align={align}
            setAlign={setAlign}
            isFilter={true}
            isExcelDown={true}
            handleFilterConfirm={handleFilterConfirm}
            handleFilterInit={handleFilterInit}
            excelDown={
              <StartIconButton category="excel" onClick={handleExcelBtnClick} />
            }
            totalCount={
              userListQuery.isLoading ? 1 : userListQuery.data.total_count
            }
          />
        </Box>
      )}
      {excelLoading && <LinearProgress />}
    </div>
  );
}
