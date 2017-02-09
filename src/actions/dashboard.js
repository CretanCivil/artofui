import cFetch from './../utils/cFetch';
import cookie from 'js-cookie';
import {DASHBOARD } from './../constants/actionTypes';
import { API_CONFIG } from './../config/api';
import format from 'string-format';
import $ from 'jquery';

export const fetchDashboard = (params = { page: 1, per_page: 10 }) => {
  return {
    type: DASHBOARD,
    payload: cFetch(format(API_CONFIG.dashboard,$("#dashboard").attr("dashboardid")), { method: "GET", params: params })
  };
};
