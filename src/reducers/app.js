import initialState from './initialState';


function app(state = initialState.app, action) {
  if (action.type === 'DIALOG') {
    return {
      isShowDialog: action.param.show,
    };
  }
 
  return state;
}

module.exports = app;
