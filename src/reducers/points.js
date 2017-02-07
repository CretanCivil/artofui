import initialState from './initialState';
import { CHART_SELECT_POINTS } from './../constants/actionTypes';

export default function points(state = initialState.points, action) {
  if (action.type === CHART_SELECT_POINTS) {
    return Object.assign({}, state, {
      points: action.param,
    });
  }

  return state;
}


