import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import CheckBoxOn from 'asset/images/checkbox_on.svg';
import CheckBoxOff from 'asset/images/checkbox_off.svg';
import { numberWithCommas } from 'utils';

export default function SearchResult({ data, type, checked, setChecked, opt }) {
  const handleChecked = () => {
    if (data === '모두선택') {
      if (opt.length === checked[type].length) {
        setChecked({ ...checked, [type]: [] });
      } else {
        let allValue = [];
        opt.forEach((d) => {
          allValue.push(d.label);
        });
        console.log('CHK : ', allValue);
        setChecked({ ...checked, [type]: allValue });
      }
    } else {
      setChecked({
        ...checked,
        [type]: checked[type].includes(data)
          ? checked[type].filter((c) => c !== data && c !== '모두선택')
          : [...checked[type], data],
      });
    }
  };

  return (
    <SearchDetail onClick={handleChecked}>
      <img
        src={checked[type].includes(data) ? CheckBoxOn : CheckBoxOff}
        alt=""
      />
      {numberWithCommas(data)}
    </SearchDetail>
  );
}

const SearchDetail = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  color: #333333;
  font-weight: normal;
  > img {
    width: 16px;
    height: 16px;
    margin-right: 8px;
  }
  & + & {
    margin-top: 8px;
  }
  &:hover {
    font-weight: bold;
  }
`;
