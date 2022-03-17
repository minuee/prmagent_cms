import { apiObject } from 'api';

export const fetchUserDetail = async (user_id, user_type) => {
  return await apiObject.getUserDetail({ user_id, user_type }, () => {});
};
