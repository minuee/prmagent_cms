import React from 'react';
import styled, { css } from 'styled-components';

import HeaderFilterDialog from './HeaderFilterDialog';
import HeaderFilterNoQueryDialog from './HeaderFilterDialog_noQuery';
import Filter from 'asset/images/filter_down.svg';
import FilterOn from 'asset/images/filter_down_active.svg';

export default function HeaderFilter({
  type,
  value,
  idx,
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
  handleFilterConfirm,
  handleFilterInit,
}) {
  return (
    <Container onClick={() => setOpen(type)} active={filterActive[type]}>
      {value}
      <img src={filterActive[type] ? FilterOn : Filter} alt="" />
      {type !== 'reg_dt_excel' && type !== 'expire_dt_excel' ? (
        <HeaderFilterDialog
          open={open[type]}
          setOpen={setOpen}
          checked={checked}
          setChecked={setChecked}
          searchText={searchText}
          setSearchText={setSearchText}
          filterActive={filterActive}
          setFilterActive={setFilterActive}
          align={align}
          setAlign={setAlign}
          type={type}
          isRightSorting={idx > 6 ? true : false}
          handleFilterConfirm={handleFilterConfirm}
          handleFilterInit={handleFilterInit}
        />
      ) : (
        <HeaderFilterNoQueryDialog
          open={open[type]}
          setOpen={setOpen}
          checked={checked}
          setChecked={setChecked}
          searchText={searchText}
          setSearchText={setSearchText}
          filterActive={filterActive}
          setFilterActive={setFilterActive}
          align={align}
          setAlign={setAlign}
          type={type}
          isRightSorting={idx > 6 ? true : false}
          handleFilterConfirm={handleFilterConfirm}
          handleFilterInit={handleFilterInit}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  > img {
    margin-left: 5px;
    width: 12px;
  }
  color: ${(props) => (props.active ? '#7ea1b2' : '#333333')};
`;
