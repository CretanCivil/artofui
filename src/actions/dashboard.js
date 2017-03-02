import cFetch from './../utils/cFetch';
import cookie from 'js-cookie';
import {DASHBOARD } from './../constants/actionTypes';
import { API_CONFIG } from './../config/api';
import format from 'string-format';
import $ from 'jquery';

export const fetchDashboard = (params = { page: 1, per_page: 10,api_key:API_CONFIG.apiKey }) => {
  return {
    type: DASHBOARD,
    payload: cFetch(format(API_CONFIG.dashboard,G_WEB_PARAMS.dashId), { method: "GET", params: params })
  };
};
