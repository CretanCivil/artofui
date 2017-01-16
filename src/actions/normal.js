import cFetch from './../utils/cFetch';
import cookie from 'js-cookie';
import {NORMAL_MODEL } from './../constants/actionTypes';
import { API_CONFIG } from './../config/api';

export const fetchNormal = (params = { windowTime:864000 }) => {
  return {
    type: NORMAL_MODEL,
    payload: cFetch(API_CONFIG.normal_model, { method: "GET", params: params })
  };
};
