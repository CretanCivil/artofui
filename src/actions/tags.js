import cFetch from './../utils/cFetch';
import cookie from 'js-cookie';
import {TAGS } from './../constants/actionTypes';
import { API_CONFIG } from './../config/api';

//https://cloud.oneapm.com/v1/tags.json?window=3600000
export const fetchTags = (params = {  }) => {
  return {
    type: TAGS,
    payload: cFetch(API_CONFIG.tags, { method: "GET", params: params })
  };
};
