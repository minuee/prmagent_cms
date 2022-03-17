import dayjs from 'dayjs';
import _ from 'lodash';

export const downloadURI = (
  uri,
  media_type = '',
  name = '',
  callback = () => {}
) => {
  var link = document.createElement('a');
  link.setAttribute('download', name);
  link.setAttribute('media_type', media_type);
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  link.remove();
  callback();
};

export const parseRangeToUTC = (startDate, endDate) => {
  let start = dayjs(startDate);
  let end = dayjs(endDate);
  start = dayjs(start).hour(0);
  start = dayjs(start).minute(0);
  start = dayjs(start).second(0);
  end = dayjs(end).hour(23);
  end = dayjs(end).minute(59);
  end = dayjs(end).second(59);
  return {
    start: start.unix(),
    end: end.unix(),
  };
};

export const priceWithMillion = (x) => {
  if (x === undefined || x === null || x === '' || _.isNaN(x)) return x;

  if (x < 1000) {
    let parts = x.toString().replace(/,/g, '').split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.') + '원';
  } else {
    let parts = (x / 10000).toString().replace(/,/g, '').split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.') + '만원';
  }
};

export const numberWithCommas = (x) => {
  if (x === undefined || x === null || x === '' || _.isNaN(x)) return x;
  let parts = x.toString().replace(/,/g, '').split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

export const phoneFormat = (val) => {
  if (val === undefined || val === null || val === '') return val;
  val = String(val).replace(/-/g, '');
  if (val.length <= 7) {
    return val.replace(/([0-9]{3})([0-9]{1})/, '$1-$2');
  } else {
    return val.replace(/([0-9]{3})([0-9]{4})([0-9]{1})/, '$1-$2-$3');
  }
};

export const isEmpty = (str) => {
  return str === null || str === undefined || str === '' || (typeof str === 'object' && Array.isArray(str) === false && Object.keys(str).length === 0);
};

export const  filterOnlyDigit = (str) => {
  var regex = /[^0-9;]/g;				// 숫자가 아닌 문자열을 선택하는 정규식
  var result = str.replace(regex, "");
  return result;
};
