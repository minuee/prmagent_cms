import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import dayjs from 'dayjs';
import { priceWithMillion } from 'utils';

export default function DetailPage({ data, header }) {
  return (
    <>
      <Table>
        <thead>
          <tr>
            <th style={{ width: '15%' }} />
            <th style={{ width: '35%' }} />
            <th style={{ width: '15%' }} />
            <th style={{ width: '35%' }} />
          </tr>
        </thead>
        <tbody>
          {header.map((d, i) => (
            <tr key={`detail_${i}`}>
              {d.rows.map((v, n) => (
                <React.Fragment key={`${v.key}_${n}`}>
                  <TitleTd>{v.label}</TitleTd>
                  <Td colSpan={d.colspan} height={d.height}>
                    {v.type === 'string' && data[v.key]}
                    {v.type === 'date' &&
                      (data[v.key] !== null
                        ? dayjs.unix(data[v.key]).format('YYYY-MM-DD')
                        : '-')}
                    {v.type === 'price' && priceWithMillion(data[v.key])}
                    {v.type === 'preview' && data[v.key]}
                    {v.type === 'img' && data[v.key]}
                  </Td>
                </React.Fragment>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

const Table = styled.table`
  width: 100%;
  min-width: 900px;
  margin-top: 14px;
  margin-bottom: 40px;
  border-spacing: 0;
  border-collapse: collapse;
`;

const TitleTd = styled.td`
  height: 54px;
  background-color: #f1f2ea;
  border-top: solid 1px #c9c9c9;
  border-bottom: solid 1px #c9c9c9;
  font-size: 14px;
  font-weight: bold;
  color: #333333;
  padding: 0 20px;
`;

const Td = styled.td`
  height: ${(props) => props.height || '54px'};
  background-color: #ffffff;
  border-top: solid 1px #c9c9c9;
  border-bottom: solid 1px #c9c9c9;
  font-size: 14px;
  color: #333333;
  padding: 0 20px;
`;
