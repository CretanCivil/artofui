var https = require('https');
var httpProxy = require('http-proxy');

httpProxy.createProxyServer({
  target: 'https://app.datadoghq.com',
  agent: https.globalAgent,
  headers: {
    host: 'app.datadoghq.com'
  },
}).listen(10001);

httpProxy.createProxyServer({
  target: 'http://172.29.231.70',
  headers: {
    host: '172.29.231.70'
  },
}).listen(10002);

httpProxy.createServer({
  target: {
    port: 10001,
    host: 'localhost'
  },
  forward: {
    port: 10002,
    host: 'localhost'
  }
}).listen(10000);