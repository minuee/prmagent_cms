const { apiObject } = require('api');

export const fetchNotice = (notice_no) =>
  apiObject.getIndividualNotice({ notice_no });
