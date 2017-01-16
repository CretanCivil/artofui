import {DIALOG } from './../constants/actionTypes';

export const showDialog = (params) => {
 
  return {
    type: DIALOG,
    param:{show:params},
  };
};