import React from 'react';
import styled, { css } from 'styled-components';
import { darken, lighten } from 'polished';
import {
  FirstPage,
  ChevronLeft,
  ChevronRight,
  LastPage,
} from '@material-ui/icons';

const PaginationContainer = styled.div`
  flex: 1;
  display: flex;
  margin-top: 15px;
  margin-bottom: 80px;
  justify-content: center;
`;

const Ul = styled.ul`
  list-style: none;
  margin: 0 80px 0 30px;
  padding: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const Li = styled.li`
  margin: 0 8px;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
`;

const Button = styled.button`
  border: none;
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  background: ${(props) => (props.active ? '#000000' : '#ffffff')};
  font-family: Noto Sans KR;
  font-size: 12px;
  cursor: pointer;
  border-radius: 4px;
  color: ${(props) => (props.active ? '#ffffff' : '#000000')};
  font-weight: ${(props) => (props.active ? '900' : 'normal')};

  :focus {
    outline: none;
  }

  ${(props) =>
    props.active
      ? css`
          &:hover {
            font-weight: bold;
            transition: all 0.3s;
            background-color: ${darken(0.7, '#ffffff')};
          }
        `
      : css`
          &:hover {
            font-weight: bold;
            transition: all 0.3s;
            background-color: ${darken(0.05, '#ffffff')};
          }
        `}
`;

const MoveButton = styled.button`
  border: none;
  display: flex;
  box-sizing: border-box;
  background: #ffffff;
  vertical-align: bottom;
  font-size: 14px;
  cursor: ${(props) => (props.disable ? 'initial' : 'pointer')};
  transition: all 0.3s;
  color: ${(props) => (props.disable ? '#d9d9d9' : '#000000')};

  :focus {
    outline: none;
  }
  > svg {
  }

  & + & {
    margin-left: 10px;
  }
`;

export default function Pagination({
  currentPage,
  setCurrentPage,
  pageSize,
  totalCount,
}) {
  // 페이지 리스트 출력 개수
  const PAGE_DEPTH = 10;

  // total 120 => page 12
  // 현재 페이지
  const NOW_PAGE_BLOCK = Math.ceil(currentPage / pageSize);

  // 총 페이지 수
  const PAGINATION = Math.ceil(totalCount / pageSize);

  // 페이지 시작 index
  // const startPageIndex = (NOW_PAGE_BLOCK - 1) * pageSize + 1;
  const startPageIndex = (NOW_PAGE_BLOCK - 1) * pageSize + 1;

  // 페이지 마지막 index
  const lastPageIndex =
    NOW_PAGE_BLOCK * PAGE_DEPTH <= PAGINATION
      ? NOW_PAGE_BLOCK * PAGE_DEPTH
      : PAGINATION;
  // NOW_PAGE_BLOCK === PAGINATION ? totalCount : NOW_PAGE_BLOCK * pageSize;

  // console.log("NOW PAGE BLOCK : ", NOW_PAGE_BLOCK);
  // console.log("PAGINATION : ", PAGINATION);
  // console.log("start page index : ", startPageIndex);
  // console.log("lasg page index : ", lastPageIndex);

  const numberList = [];
  for (let i = startPageIndex; i <= lastPageIndex; i++) {
    numberList.push(i);
  }

  const handlePageChange = (page) => {
    // dispatch({
    //   type: pageActions.CHANGE_CURRENT_PAGE,
    //   payload: {
    //     currentPage: page,
    //     pageSize,
    //   },
    // });
    setCurrentPage(page);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    // dispatch({
    //   type: pageActions.CHANGE_CURRENT_PAGE,
    //   payload: {
    //     currentPage: currentPage - 1,
    //     pageSize,
    //   },
    // });
    setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    // dispatch({
    //   type: pageActions.CHANGE_CURRENT_PAGE,
    //   payload: {
    //     currentPage: currentPage + 1,
    //     pageSize,
    //   },
    // });
    setCurrentPage(currentPage + 1);
  };

  const handleLastPage = () => {
    setCurrentPage(PAGINATION);
  };

  return (
    <>
      {totalCount > pageSize && (
        <PaginationContainer>
          <Ul>
            {totalCount > pageSize && (
              <>
                <Li onClick={currentPage !== 1 ? handleFirstPage : null}>
                  <MoveButton disable={currentPage === 1 ? true : false}>
                    <FirstPage
                      style={{ marginBottom: '1px', fontSize: '25px' }}
                    />
                  </MoveButton>
                </Li>
                <Li onClick={currentPage !== 1 ? handlePrevPage : null}>
                  <MoveButton disable={currentPage === 1 ? true : false}>
                    <ChevronLeft
                      size="22px"
                      style={{ marginBottom: '1px', fontSize: '25px' }}
                    />
                  </MoveButton>
                </Li>
              </>
            )}
            {numberList.map((d, i) => (
              <Li key={d + '_' + i} onClick={() => handlePageChange(d)}>
                <Button active={d === currentPage ? true : false}>{d}</Button>
              </Li>
            ))}
            {totalCount > pageSize && (
              <>
                <Li
                  onClick={currentPage !== PAGINATION ? handleNextPage : null}
                >
                  <MoveButton
                    disable={currentPage === PAGINATION ? true : false}
                  >
                    <ChevronRight
                      style={{
                        marginBottom: '1px',
                        marginLeft: '-12px',
                        fontSize: '25px',
                      }}
                    />
                  </MoveButton>
                </Li>
                <Li
                  onClick={currentPage !== PAGINATION ? handleLastPage : null}
                >
                  <MoveButton
                    disable={currentPage === PAGINATION ? true : false}
                  >
                    <LastPage
                      style={{
                        marginBottom: '1px',
                        marginLeft: '-12px',
                        fontSize: '25px',
                      }}
                    />
                  </MoveButton>
                </Li>
              </>
            )}
          </Ul>
        </PaginationContainer>
      )}
    </>
  );
}
