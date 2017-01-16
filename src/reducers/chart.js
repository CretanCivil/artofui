import initialState from './initialState';
import { CHART_RANGE, CHART_SELECTION, CHART_CROSS_LINE } from './../constants/actionTypes';

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


