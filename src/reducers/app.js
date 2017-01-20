import initialState from './initialState';


export function app(state = initialState.app, action) {
  if (action.type === 'DIALOG') {
    return {
      isShowDialog: action.param.show,
    };
  }

  return state;
}

export function dragingCharts(state = initialState.dragingCharts, action) {
  if (action.type === 'DRAGING_CHARTS') {
    return Object.assign({}, state, action.param);
  }
  return state;
}

