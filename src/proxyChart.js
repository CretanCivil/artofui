var https = require('https');
var httpProxy = require('http-proxy');
var http = require('http');

httpProxy.createProxyServer({
  target: 'https://app.datadoghq.com',
  agent: https.globalAgent,
  headers: {
    host: 'app.datadoghq.com'
  },
}).listen(10001);

//host: '172.29.231.70',
httpProxy.createProxyServer({
  target: {
    
    host: '172.29.228.234',
    port: 8080
  }
}).listen(10002);

var proxyCI = httpProxy.createServer({
  target: 'https://dc-cloud.oneapm.com',
  agent: https.globalAgent,
  headers: {
    host: 'dc-cloud.oneapm.com'
  },
});//.listen(10000);

http.createServer(function (req, res) {
  req.url  = req.url.replace("\/?","?");
  if(req.url == "/intake?api_key=e7afaf986f5cc822406cbd5831328462") {
    req.url = "/infrastructure/metrics?license_key=VgAAA1sNB1Ze953TH1YTVV5KXxb55aBVWR9QBQRXSe38fAMASwkKSgNU92f1CAMeUgIYUFA=";
    proxyCI.web(req, res);
  } else {
    res.end("Agent server runnning");
  }
  //console.log(req.url);
  //res.end();
  
}).listen(10003);

//http://dc-cloud.oneapm.com/infrastructure/metrics?license_key=VgAAA1sNB1Ze953TH1YTVV5KXxb55aBVWR9QBQRXSe38fAMASwkKSgNU92f1CAMeUgIYUFA=
//http://172.29.225.114:1000/infrastructure/metrics?license_key=VgAAA1sNB1Ze953TH1YTVV5KXxb55aBVWR9QBQRXSe38fAMASwkKSgNU92f1CAMeUgIYUFA=

var proxy70CI = httpProxy.createServer({
  target: {
    port: 10002,
    host: 'localhost'
  },
  forward: {
    port: 10003,
    host: 'localhost'
  },
  /*forward: {
    port: 10003,
    host: 'localhost'
  },*/
});//.listen(10000);

http.createServer(function (req, res) {
  req.url  = req.url.replace("\/?","?");
  //console.log(req.url);
  try {
    proxy70CI.web(req, res);
  } catch(err) {
    var errorMsg
      = '\n'
      + 'Error ' + new Date().toISOString() + ' ' + req.url
      + '\n'
      + err.stack || err.message || 'unknow error'
      + '\n'
      ;

    console.error(errorMsg);
   
  }
}).listen(10010);

var proxy = httpProxy.createServer({
  target: {
    port: 10001,
    host: 'localhost'
  },
  forward: {
    port: 10010,
    host: 'localhost'
  },
  /*forward: {
    port: 10003,
    host: 'localhost'
  },*/
});//.listen(10000);

var proxyServer = http.createServer(function (req, res) {
  req.url  = req.url.replace("\/?","?");
  //console.log(req.url);
  try {
    proxy.web(req, res);
  } catch(err) {
    var errorMsg
      = '\n'
      + 'Error ' + new Date().toISOString() + ' ' + req.url
      + '\n'
      + err.stack || err.message || 'unknow error'
      + '\n'
      ;

    console.error(errorMsg);
   
  }
}).listen(10000);
//forever start proxyTest.js 

/*
curl -XPUT http://172.29.225.16:9200/shakespeare -d '
{
 "mappings" : {
  "_default_" : {
   "properties" : {
    "speaker" : {"type": "string", "index" : "not_analyzed" },
    "play_name" : {"type": "string", "index" : "not_analyzed" },
    "line_id" : { "type" : "integer" },
    "speech_number" : { "type" : "integer" }
   }
  }
 }
}
';


curl -XPUT http://172.29.225.16:9200/logstash-2015.05.18 -d '
{
  "mappings": {
    "log": {
      "properties": {
        "geo": {
          "properties": {
            "coordinates": {
              "type": "geo_point"
            }
          }
        }
      }
    }
  }
}
';



curl -XPUT http://172.29.225.16:9200/logstash-2015.05.19 -d '
{
  "mappings": {
    "log": {
      "properties": {
        "geo": {
          "properties": {
            "coordinates": {
              "type": "geo_point"
            }
          }
        }
      }
    }
  }
}
';


curl -XPUT http://172.29.225.16:9200/logstash-2015.05.20 -d '
{
  "mappings": {
    "log": {
      "properties": {
        "geo": {
          "properties": {
            "coordinates": {
              "type": "geo_point"
            }
          }
        }
      }
    }
  }
}
';

curl -XPOST '172.29.225.16:9200/bank/account/_bulk?pretty' --data-binary @accounts.json
curl -XPOST '172.29.225.16:9200/shakespeare/_bulk?pretty' --data-binary @shakespeare.json
curl -XPOST '172.29.225.16:9200/_bulk?pretty' --data-binary @logs.jsonl

 */
