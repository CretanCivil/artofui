import {CHART_SELECT_POINTS } from './../constants/actionTypes';

export const selectPoints = (params) => {
  return {
    type: CHART_SELECT_POINTS,
    param: params,
  };
};
