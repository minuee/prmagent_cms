import React from 'react';
import styled, { css } from 'styled-components';

export default function SelectBox({ value, setValue, opt, width }) {
  return (
    <Select
      value={value}
      onChange={(v) => setValue(v.target.value)}
      onClick={(e) => e.stopPropagation()}
      width={width}
    >
      {opt.map((d) => (
        <option key={d.value} value={d.value}>
          {d.label}
        </option>
      ))}
    </Select>
  );
}

const Select = styled.select`
  width: ${(props) => props.width || '276px'};
  height: 34px;
  border: solid 1px #dddddd;
  padding: 0 12px;
  font-size: 15px;
  font-family: Noto Sans KR;
  cursor: pointer;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  ::ms-expand {
    display: none;
  }
  background: url('/images/select_down.svg') no-repeat calc(100% - 10px) 50%;
`;
