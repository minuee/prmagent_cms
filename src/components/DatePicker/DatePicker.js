import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { darken } from 'polished';
import moment from 'moment';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const Calendar = styled.div`
  width: 360px;
  border: 1px solid #bababa;
  padding: 24px 10px 8px 10px;
`;

const Head = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 18px;
`;

const HeadBtnWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeadBtn = styled.div`
  margin-right: 20px;
  cursor: pointer;
`;

const HeadBtn2 = styled.div`
  margin-left: 24px;
  cursor: pointer;
`;

const HeadTxt = styled.div`
  font-weight: 400;
  font-size: 16px;
  padding-bottom: 2px;
`;

const Body = styled.div`
  margin-top: 32px;
`;

const WeekWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Week = styled.div`
  width: calc(100% / 7);
  height: 30px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => props.color || '#000000'};
`;

const DayWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const DayBack = styled.div`
  width: calc(100% / 7);
  display: flex;
  justify-content: center;
  position: relative;

  ${(props) =>
    props.over === 'start' &&
    props.start === 'on' &&
    props.end === 'on' &&
    css`
      background: linear-gradient(90deg, #ffffff 50%, #b4dbee 50%);
    `}
  ${(props) =>
    props.over === 'on' &&
    props.start === 'on' &&
    props.end === 'on' &&
    css`
      background-color: #b4dbee;
    `}
    ${(props) =>
    props.over === 'end' &&
    props.start === 'on' &&
    props.end === 'on' &&
    css`
      background: linear-gradient(90deg, #b4dbee 50%, #ffffff 50%);
    `}
`;

const Day = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;

  ${(props) =>
    props.type === 'prev' &&
    css`
      color: #999999;
      pointer-events: none;
    `}
  ${(props) =>
    props.unAvail &&
    css`
      color: #bebebe;
      pointer-events: none;
    `}

  ${(props) =>
    props.selected &&
    css`
      background-color: #7ea1b2;
      color: #000000;
    `}

  &:hover {
    background-color: ${darken(0.1, '#ffffff')};
  }
`;

export default function DatePicker({ dt, setDt, setOpen, handleChange }) {
  const [initDt, setInitDt] = useState(moment(dt));

  const handleMonthChange = (act) => {
    if (act === 'prev') {
      setInitDt(moment(initDt).subtract({ month: 1 }));
    } else if (act === 'next') {
      setInitDt(moment(initDt).add({ month: 1 }));
    }
  };

  const handleDtChange = (date) => {
    setDt(date);
    setOpen(false);
    handleChange(moment(date).format('YYYY-MM-DD'));
  };

  function generate() {
    const today = initDt;
    const startWeek = today.clone().startOf('month').week();
    const endWeek =
      today.clone().endOf('month').week() === 1
        ? 53
        : today.clone().endOf('month').week();
    let calendar = [];
    for (let week = startWeek; week <= endWeek; week++) {
      calendar.push(
        <DayWrap>
          {Array(7)
            .fill(0)
            .map((n, i) => {
              let current = today
                .clone()
                .week(week)
                .startOf('week')
                .add(n + i, 'day');
              let isSelected =
                current.format('YYYY-MM-DD') === moment(dt).format('YYYY-MM-DD')
                  ? true
                  : false;
              let isGrayed =
                current.format('MM') === today.format('MM') ? '' : 'grayed';
              return (
                <DayBack key={`${current}_${i}`}>
                  <Day
                    type={isGrayed}
                    key={current.format('YYYY-MM-DD')}
                    selected={isSelected}
                    onClick={() => handleDtChange(current)}
                  >
                    <div>{current.format('D')}</div>
                  </Day>
                </DayBack>
              );
            })}
        </DayWrap>
      );
    }
    return calendar;
  }
  return (
    <>
      <Calendar>
        <Head>
          <HeadBtnWrap>
            <HeadBtn onClick={() => handleMonthChange('prev')}>
              <ArrowBackIosIcon style={{ fontSize: '16px' }} />
            </HeadBtn>
            <HeadTxt>{moment(initDt).format('MM')}</HeadTxt>
            <HeadBtn2 onClick={() => handleMonthChange('next')}>
              <ArrowForwardIosIcon style={{ fontSize: '16px' }} />
            </HeadBtn2>
          </HeadBtnWrap>
        </Head>
        <Body>
          <WeekWrap>
            <Week color="#ff0000">
              <div>S</div>
            </Week>
            <Week>
              <div>M</div>
            </Week>
            <Week>
              <div>T</div>
            </Week>
            <Week>
              <div>W</div>
            </Week>
            <Week>
              <div>T</div>
            </Week>
            <Week>
              <div>F</div>
            </Week>
            <Week>
              <div>S</div>
            </Week>
          </WeekWrap>
          {generate()}
        </Body>
      </Calendar>
    </>
  );
}
