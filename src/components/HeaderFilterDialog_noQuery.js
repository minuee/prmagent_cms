import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { darken } from 'polished';
import moment from 'moment';

import SelectBox from './SelectBox';
import MultiDatePicker from './MultiDatePicker';
import { SORTING_OPTIONS } from 'pages/UsersPage/UsersPageMock';

export default function HeaderFilterDialog({
  open,
  setOpen,
  checked,
  setChecked,
  filterActive,
  setFilterActive,
  align,
  setAlign,
  type,
  isRightSorting = false,
  handleFilterConfirm,
  handleFilterInit,
}) {
  const [data, setData] = useState(0);
  const [startDt, setStartDt] = useState(null);
  const [endDt, setEndDt] = useState(null);
  const [initDt, setInitDt] = useState(moment());

  const handleSubmit = () => {
    if ((startDt === null || endDt === null) && data === 0) {
      alert('시작일과 종료일 또는 정렬값을 선택해주세요.');
      return;
    } else {
      setFilterActive({
        ...filterActive,
        [type]: true,
      });
      data !== 0 && data !== '0' && setAlign({ order: type, asc: data });
      setOpen(type);

      if (type === 'reg_dt_excel') {
        checked.start_reg_dt = startDt;
        checked.end_reg_dt = endDt;
        setChecked({ ...checked });
      } else if (type === 'expire_dt_excel') {
        checked.start_expire_dt = startDt;
        checked.end_expire_dt = endDt;
        setChecked({ ...checked });
      }
      handleFilterConfirm(type);
    }
  };

  const handleInit = () => {
    if (align.order === type) {
      setAlign({ order: '', asc: true });
      setData(0);
    }
    handleFilterInit(type);
    setStartDt(null);
    setEndDt(null);
    setFilterActive({
      ...filterActive,
      [type]: false,
    });
    setOpen(type);
  };

  useEffect(() => {
    if (align.order === type) {
      setData(align.asc);
    } else {
      setData(0);
    }
  }, [align]);

  return (
    <>
      {open && (
        <Container sort={isRightSorting}>
          <div style={{ marginBottom: '12px' }}>
            <SelectBox
              value={data}
              setValue={setData}
              opt={SORTING_OPTIONS}
              width="360px"
            />
          </div>
          <div
            style={{ marginBottom: '12px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* <DatePicker dt={dt} setDt={setDt} handleChange={handleDtChange} /> */}
            <MultiDatePicker
              type={type}
              startDt={startDt}
              setStartDt={setStartDt}
              endDt={endDt}
              setEndDt={setEndDt}
              initDt={initDt}
              setInitDt={setInitDt}
              checked={checked}
              setChecked={setChecked}
            />
          </div>
          <BtnWrap onClick={(e) => e.stopPropagation()}>
            <Btn onClick={handleInit}>필터 지우기</Btn>
            <BtnConfirm onClick={handleSubmit}>필터 적용</BtnConfirm>
          </BtnWrap>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  position: absolute;
  top: 20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: 425px;
  height: auto;
  padding: 32px;
  background-color: #ffffff;
  border: solid 1px #d9d9d9;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.08);
  ${(props) =>
    props.sort
      ? css`
          right: 15px;
        `
      : css`
          left: 15px;
        `}
`;

const BtnWrap = styled.div`
  display: flex;
  width: 360px;
  align-items: center;
  justify-content: space-between;
  margin-top: 27px;
`;

const Btn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 34px;
  border: solid 1px #dddddd;
  font-size: 14px;
  font-weight: normal;
  color: #505050;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: ${darken(0.05, '#ffffff')};
  }
  &:active {
    background-color: ${darken(0.1, '#ffffff')};
  }
`;

const BtnConfirm = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 34px;
  background-color: #7ea1b2;
  font-size: 14px;
  font-weight: normal;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: ${darken(0.05, '#7ea1b2')};
  }
  &:active {
    background-color: ${darken(0.1, '#7ea1b2')};
  }
`;
