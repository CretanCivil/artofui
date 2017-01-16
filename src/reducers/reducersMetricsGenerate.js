import _ from 'lodash';

export default function reducersMetricsGenerate(actionType, initialState, optionsHandler){
  if(!_.isArray(actionType)){
    actionType = [actionType];
  }

  const defaultHandler = {};

  _.each(actionType, (item) => {
    // PENDING action
    defaultHandler[`${item}_PENDING`] = (state, action) => {
     /* console.log(action.id + "_PENDING");
     
      let newState = new Map();
      newState.set(action.id, {
        isFetching: true,
      });
      return newState;*/
           const key = "key"+action.id;
 
      return Object.assign({}, state, {
        [key]: {
        isFetching: true,
      }});
      /*
      return Object.assign({}, state, {
        isFetching: true
      });*/
    };

    // FULFILLED action
    defaultHandler[`${item}_FULFILLED`] = (state, action) => {
      console.log("_FULFILLED");
     /* state.set(action.id, {
        isFetching: false,
        isFulfilled: true,
        data: action.payload.result,
      });
      return state;*/
            const key = "key"+action.id;
 
      return Object.assign({}, state, {
        [key]: {
        isFetching: false,
        isFulfilled: true,
        data: action.payload.result,
      }});
    };

    // REJECTED action
    defaultHandler[`${item}_REJECTED`] = (state, action) => {
       console.log("_REJECTED");
    /*  state.set(action.id, {
        isFetching: false,
        isRejected: true,
        error: action.payload
      });
      return state;*/
      const key = "key"+action.id;
 
      return Object.assign({}, state, {
        [key]: {
        isFetching: false,
        isRejected: true,
        error: action.payload
      }});


/*
      return Object.assign({}, state, {
        action.id: false,
        isRejected: true,
        error: action.payload
      });*/
    };
  });


  const actionHanlder = Object.assign({}, defaultHandler, optionsHandler);

  return (state = initialState, action) => {
     
    return actionHanlder[action.type] && actionHanlder[action.type](state, action) || state;
  };
}
