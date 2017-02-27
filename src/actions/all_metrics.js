import cFetch from './../utils/cFetch';
import cookie from 'js-cookie';
import {ALL_METRICS } from './../constants/actionTypes';
import { API_CONFIG } from './../config/api';

export const fetchAllMetrics = (params = { windowTime:864000,api_key:API_CONFIG.apiKey }) => {
  return {
    type: ALL_METRICS,
    payload: cFetch(API_CONFIG.all_metrics, { method: "GET", params: params })
  };
};
