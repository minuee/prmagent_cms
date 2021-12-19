import { apiObject } from 'api';

export const fetchInquiry = async (sys_inquiry_no) =>
  await apiObject.getInquiryDetail({ sys_inquiry_no }, () => {});
