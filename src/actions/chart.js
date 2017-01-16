import {CHART_RANGE, CHART_SELECTION, CHART_CROSS_LINE } from './../constants/actionTypes';

export const setChartRange = (params) => {
  return {
    type: CHART_RANGE,
    param: params,
  };
};

export const setChartSelection = (params) => {
  return {
    type: CHART_SELECTION,
    param: params,
  };
};

export const setChartCrossLine = (params) => {
  return {
    type: CHART_CROSS_LINE,
    param: params,
  };
};