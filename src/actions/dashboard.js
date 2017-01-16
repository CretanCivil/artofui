import cFetch from './../utils/cFetch';
import cookie from 'js-cookie';
import {DASHBOARD } from './../constants/actionTypes';
import { API_CONFIG } from './../config/api';

export const fetchDashboard = (params = { page: 1, per_page: 10 }) => {
  return {
    type: DASHBOARD,
    payload: cFetch(API_CONFIG.dashboard, { method: "GET", params: params })
  };
};
