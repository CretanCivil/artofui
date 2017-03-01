// 统一声明默认State
import cookie from 'js-cookie';

export default {
  auth: {
    isFetching: false,
    isAuthenticated: cookie.get('access_token') ? true : false
  },
  users: {
    isFetching: false,
    meta: {
      total: 0,
      perPage: 10,
      page: 1
    },
    data: []
  },
  app: {
    isShowDialog: false,
  },
  dashboard: {
    isFetching: false,
    data: []
  },
  metric: {},
  tags: {
    isFetching: false,
    data: []
  },
  normalModel: {
    isFetching: false,
    data: []
  },
  allMetrics: {
    isFetching: false,
    data: []
  },
  chart: {//图标样式统一控制
    range: {
      startDate: 0,
      endDate: 0,
    },
    selection: {
      min: 0,
      max: 0,
      resetSelection: false,
    },
    crossLine: {
      pos: 0,
    }
  },
  dragingCharts: {
    isDraging: false,
    item:null,
  },
  points: {//选中的序列点
    points:[],
  },
  params:{
    scope:{},
  },

};
