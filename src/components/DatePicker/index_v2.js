import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import dayjs from 'dayjs';

import InputComponent from './InputComponent';
import DatePicker from './DatePicker';
// import useOutsideClick from "components/UseOutsideClick";
import SelectDownIcon from 'asset/images/select_down_icon.png';

const Container = styled.div`
  position: relative;
`;

const DataPickerWrap = styled.div`
  height: 420px;
  position: absolute;
  background-color: #ffffff;
  z-index: 9999;
`;

const Day = styled.div`
  width: 276px;
  height: 34px;
  border: solid 1px #dddddd;
  display: flex;
  align-items: center;
  padding: 0 12px;
  font-size: 15px;
  font-weight: normal;
  position: relative;
`;

const Img = styled.img`
  margin-left: 20px;
  position: absolute;
  right: 12px;
`;

export default function DatePickerComp({ dt, setDt, handleChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // useOutsideClick(ref, () => {
  //   setOpen(false);
  // });

  return (
    <>
      <Container ref={ref} onClick={(e) => e.stopPropagation()}>
        <Day onClick={() => setOpen(!open)}>
          {dt === null ? '-' : dayjs(dt).format('YYYY-MM-DD')}
          <Img src="/images/calendar.svg" alt="" />
        </Day>
        {open && (
          <DataPickerWrap>
            <DatePicker
              dt={dt}
              setDt={setDt}
              setOpen={setOpen}
              handleChange={handleChange}
            />
          </DataPickerWrap>
        )}
      </Container>
    </>
  );
}
