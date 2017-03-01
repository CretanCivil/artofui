import initialState from './initialState';
import { CHART_RANGE, CHART_SELECTION, CHART_CROSS_LINE, SCOPE_PARAMS } from './../constants/actionTypes';

export default function chart(state = initialState.chart, action) {
  if (action.type === CHART_RANGE) {
    return Object.assign({}, state, {
      range: action.param,
    });
  } else if (action.type === CHART_SELECTION) {
    return Object.assign({}, state, {
      selection: action.param,
    });
  } else if (action.type === CHART_CROSS_LINE) {
    return Object.assign({}, state, {
      crossLine: action.param,
    });
  }

  return state;
}

export  function params(state = initialState.params, action) {
  if (action.type === SCOPE_PARAMS) {
    return Object.assign({}, state, {
      scope: action.param,
    });
  }

  return state;
}


