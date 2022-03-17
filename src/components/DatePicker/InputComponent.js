import React from "react";
import styled from "styled-components";
import moment from "moment";

const Container = styled.div`
  display: flex;
  margin-bottom: 10px;
`;

const InputWrap = styled.div`
  width: 140px;
  height: 42px;
  border-radius: 5px;
  border: solid 1px #dddddd;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
`;

const Date = styled.div`
  font-size: 16px;
  font-weight: 500;
  height: 20px;
  text-transform: uppercase;
  color: #999999;
`;

const ArrowDiv = styled.div`
  margin-right: 5px;
`;

export default function DateRangePickerComp({ dt, open, setOpen }) {
  return (
    <>
      <Container onClick={() => setOpen(!open)}>
        <InputWrap>
          <Date>{dt === "" ? "-" : moment(dt).format("MM/DD(ddd)")}</Date>
          <ArrowDiv>
            <img src="/images/common/select_down.svg" alt="" />
          </ArrowDiv>
        </InputWrap>
      </Container>
    </>
  );
}
