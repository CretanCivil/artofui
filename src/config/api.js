let host;

if(process.env.NODE_ENV == "test"){
  host = "http://localhost:4000";
}else{
  host = location.origin;
}

const baseUri = host;
export const API_CONFIG = {
  host: host,
  baseUri: baseUri,
  auth: '/pages/v2/login',
  users: '/api/v1/users',
  dashboard: '/v1/dashboards/{}/charts.json',
  show: '/v1/dashboards/{}/show.json',
  metric: '/v1/query.json',
  tags: '/v1/tags.json',
  normal_model: '/v1/metric_types/normal_mode_list',
  all_metrics: '/v1/metrics.json',
  buckets: '/v1/events/buckets.json',
  updateLayout: '/v1/dashboards/{}/update.json',
};

