import {DIALOG,DRAGING_CHARTS } from './../constants/actionTypes';

export const showDialog = (params) => {
 
  return {
    type: DIALOG,
    param:{show:params},
  };
};


export const setDraging = (params) => {
  return {
    type: DRAGING_CHARTS,
    param: params,
  };
};
