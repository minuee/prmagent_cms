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

const LogoImg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.div`
  width: 64px;
  height: 24px;
  border: solid 1px #dddddd;
  ${(props) =>
    props.imgUrl !== null
    ? css`
        background: url('${(props) => props.imgUrl}') no-repeat center;
        background-size: contain;
      `
    : css`
        background-color: #dddddd;
  `}
`;

const URL = 'https://fpr-prod-file.s3-ap-northeast-2.amazonaws.com/';

export default function UserTable({
  data,
  header,
  page,
  setPage,
  totalCount,
  handleDetail,
  open,
  setOpen,
  checked,
  setChecked,
  searchText,
  setSearchText,
  filterActive,
  setFilterActive,
  align,
  setAlign,
  isFilter = false,
  handleFilterConfirm,
  handleFilterInit,
  isExcelDown,
  excelDown,
}) {
  return (
    <Container>
      <Table>
        <thead>
          <TheadTr>
            {header.map((d, i) => (
              <TheadTh key={d.key}>
                {isFilter && d.key !== 'logo_img_url' ? (
                  <HeaderFilter
                    type={d.key}
                    value={d.value}
                    idx={i}
                    open={open}
                    setOpen={setOpen}
                    checked={checked}
                    setChecked={setChecked}
                    searchText={searchText}
                    setSearchText={setSearchText}
                    filterActive={filterActive}
                    setFilterActive={setFilterActive}
                    align={align}
                    setAlign={setAlign}
                    handleFilterConfirm={handleFilterConfirm}
                    handleFilterInit={handleFilterInit}
                  />
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
                key={row.num}
                onClick={() => handleDetail(row.user_id, row.user_type)}
              >
                {header.map((h) => (
                  <td key={h.key} height={h.height} width={h.width}>
                    {h.type === 'string' && row[h.key]}
                    {h.type === 'amount' &&
                      (row[h.key] !== '-'
                        ? priceWithMillion(row[h.key])
                        : row[h.key])}
                    {h.type === 'logo_img' && (
                      <>
                        {row[h.key] === '' ? (
                          '-'
                        ) : (
                          <LogoImg>
                            <Logo imgUrl={URL + row[h.key]} />
                          </LogoImg>
                        )}
                      </>
                    )}
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
      <Pagination currentPage={page} setCurrentPage={setPage} pageSize={10} totalCount={totalCount} />
    </Container>
  );
}
