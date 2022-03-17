import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { darken } from 'polished';
import { useHistory } from 'react-router-dom';
import dayjs from 'dayjs';

import HeaderFilter from './HeaderFilter';
import { priceWithMillion } from 'utils';
import Pagination from './Pagination';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeadWrap = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 15px;
`;

const HeadLeft = styled.div`
  display: flex;
  margin-left: 5px;
`;

const AllCheckWrap = styled.div`
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: solid 1px #dddddd;
  background-color: #f6f6f6;
  cursor: pointer;
  margin-right: 20px;
  transition: all 0.3s;

  &:hover {
    background-color: ${darken(0.1, '#f6f6f6')};
    border: solid 1px ${darken(0.1, '#dddddd')};
  }
`;

const DelBtn = styled.div`
  width: 72px;
  height: 42px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  border: solid 1px #dddddd;
  cursor: pointer;
  margin-right: 20px;
  transition: all 0.3s;

  &:hover {
    background-color: ${darken(0.1, '#ffffff')};
  }
  &:active {
    background-color: ${darken(0.2, '#ffffff')};
  }
`;

const SearchBox = styled.div`
  display: flex;
  float: right;
  border-radius: 5px;
  border: solid 1px #dddddd;
  width: 280px;
  height: 42px;
  box-sizing: border-box;
  border-radius: 10px;

  ${(props) =>
    props.focus
      ? css`
          background-color: ${darken(0.04, '#ffffff')};
        `
      : css``}
`;

const SearchInput = styled.input`
  width: 100%;
  border: none;
  background-color: #ffffff;
  border-radius: 10px;
  font-size: 14px;
  padding-left: 20px;

  :focus {
    outline: none;
    background-color: ${darken(0.04, '#ffffff')};
  }
`;

const SearchImgWrap = styled.div`
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Table = styled.table`
  border-spacing: 0;
  margin-bottom: 50px;
  position: relative;
`;

const TheadTr = styled.tr`
  font-size: 14px;
  color: #333333;
  font-weight: 500;
  height: 50px;
  background-color: #f1f2ea;
`;

const TheadTh = styled.th`
  width: ${(props) => props.width || 'auto'};
`;

const TheadDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const TBodyTr = styled.tr`
  text-align: center;
  height: 50px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: ${darken(0.1, '#ffffff')};
  }
`;

const LinkedTb = styled.td`
  cursor: pointer;
  text-align: left;
  text-indent: 20px;
`;

const StateWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const State = styled.div`
  width: 74px;
  height: 32px;
  border: solid 1px
    ${(props) => (props.theme === 'brand' ? '#7ea1b2' : '#000000')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: ${(props) => (props.theme === 'brand' ? '#7ea1b2' : '#000000')};

  ${(props) =>
    props.state &&
    css`
      ${props.theme === 'brand'
        ? css`
            background-color: #7ea1b2;
            color: #ffffff;
          `
        : css`
            background-color: #000000;
            color: #ffffff;
          `}
    `}
`;

const CheckBoxTh = styled.th`
  width: 50px;
  border-bottom: 1px solid #dddddd;
`;

export default function CommonTable({
  data,
  header,
  page,
  setPage,
  totalCount,
  handleDetail,
  isFilter = false,
  isExcelDown,
  excelDown,
}) {
  const [onFocus, setOnFocus] = useState(false);

  return (
    <>
      <Container>
        <Table>
          <thead>
            <TheadTr>
              {header.map((d, i) => (
                <TheadTh key={d.key}>
                  {isFilter ? (
                    <HeaderFilter type={d.key} value={d.value} idx={i} />
                  ) : (
                    <TheadDiv>{d.value}</TheadDiv>
                  )}
                </TheadTh>
              ))}
            </TheadTr>
          </thead>
          <tbody>
            {totalCount === 0 ? (
              <TBodyTr>
                <td colSpan={header.length}>조회된 데이터가 없습니다.</td>
              </TBodyTr>
            ) : (
              data.map((row) => (
                <TBodyTr
                  key={row.user_id}
                  onClick={() => handleDetail(row.user_id, row.user_type)}
                >
                  {header.map((h) => (
                    <td key={h.key} height={h.height} width={h.width}>
                      {h.type === 'string' && row[h.key]}
                      {h.type === 'amount' &&
                        (row[h.key] !== '-'
                          ? priceWithMillion(row[h.key])
                          : row[h.key])}
                    </td>
                  ))}
                </TBodyTr>
              ))
            )}
          </tbody>
          {isExcelDown && (
            <div style={{ position: 'absolute', bottom: '-60px' }}>
              {excelDown}
            </div>
          )}
        </Table>
        <Pagination
          currentPage={page}
          setCurrentPage={setPage}
          pageSize={10}
          totalCount={totalCount}
        />
      </Container>

      {/* // <TBodyTr key={d.sys_inqry_no}>
                //   <td>{dayjs.unix(d.inqry_dt).format('YYYY.MM.DD')}</td>
                //   <td>
                //     <StateWrap>
                //       <State state={d.answer_yn} theme={theme}>
                //         {d.answer_yn ? '답변 완료' : '답변 대기'}
                //       </State>
                //     </StateWrap>
                //   </td>
                // </TBodyTr> */}
    </>
  );
}
