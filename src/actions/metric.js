import cFetch from './../utils/cFetch';
import cookie from 'js-cookie';
import {METRIC } from './../constants/actionTypes';
import { API_CONFIG } from './../config/api';

export const fetchMetric = (params = { page: 1, per_page: 10 }) => {
  let id = params.id;
  delete params.id

  console.log(id);
  return {
    type: METRIC,
    id:id,
    datas:"dsdsd",
    payload: cFetch(API_CONFIG.metric, { method: "GET", params: params })
  };
};
