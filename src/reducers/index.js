import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import auth from './auth';
import chart from './chart';

import reducersGenerate from './reducersGenerate';
import reducersCloundGenerate from './reducersCloundGenerate';
import reducersMetricsGenerate from './reducersMetricsGenerate';

import {
  USER,
  DASHBOARD,
  TAGS,
  NORMAL_MODEL,
  ALL_METRICS
} from './../constants/actionTypes';
import initialState from './initialState';

const users = reducersGenerate(USER, initialState.users);
const dashboard = reducersCloundGenerate(DASHBOARD, initialState.dashboard);
//const metric = reducersMetricsGenerate(METRIC, initialState.metric);
const tags = reducersCloundGenerate(TAGS, initialState.tags);
const normalModel = reducersCloundGenerate(NORMAL_MODEL, initialState.normalModel);
const allMetrics = reducersCloundGenerate(ALL_METRICS, initialState.allMetrics);


const rootReducer = combineReducers({
  routing: routerReducer,
  auth,
  users,
  dashboard,
  tags,
  normalModel,
  allMetrics,
  chart
});

export default rootReducer;
