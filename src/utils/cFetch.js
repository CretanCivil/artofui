import fetch from 'isomorphic-fetch';
require('es6-promise').polyfill();

import cookie from 'js-cookie';
import StandardError from 'standard-error';
import { API_CONFIG } from './../config/api';
import { message, Modal } from 'antd';
//import rFetch from 'fetch-retry';

const errorMessages = (res) => `${res.status} ${res.statusText}`;

function check401(res) {
  // 登陆界面不需要做401校验
  if (res.status === 401 && !res.url.match('auth')) {
    Modal.error({
      title: "登陆验证过期",
      content: "您的登陆验证已过期，请重新登陆",
      onOk: () => {
        cookie.remove('access_token');
        location.href = '/';
      }
    });

    return Promise.reject(errorMessages(res));

  }
  return res;
}

function check404(res) {
  if (res.status === 404) {
    return Promise.reject(errorMessages(res));
  }
  return res;
}

function checkStatus(response) {
  // console.log(response);
  if (response.status >= 200 && response.status < 303) {
    return response;
  } else {
    // 这里补充更多错误参数
    return response.text().then(errorMsg => {
      return new StandardError({
        statusCode: response.status,
        msg: errorMsg
      });
    }).then(err => { throw err; });
  }
}

function jsonParse(res) {
  if (res.status == 302)
    return {};
  return res.json();
}

function setUriParam(keys, value, keyPostfix) {
  let keyStr = keys[0];

  keys.slice(1).forEach((key) => {
    keyStr += `[${key}]`;
  });

  if (keyPostfix) {
    keyStr += keyPostfix;
  }

  return `${encodeURIComponent(keyStr)}=${encodeURIComponent(value)}`;
}

function getUriParam(keys, object) {
  const array = [];

  if (object instanceof (Array)) {
    object.forEach((value) => {
      array.push(setUriParam(keys, value, '[]'));
    });
  } else if (object instanceof (Object)) {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const value = object[key];

        array.push(getUriParam(keys.concat(key), value));
      }
    }
  } else {
    if (object !== undefined) {
      array.push(setUriParam(keys, object));
    }
  }

  return array.join('&');
}

export function toQueryString(object) {
  const array = [];

  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const str = getUriParam([key], object[key]);

      if (str !== '') {
        array.push(str);
      }
    }
  }

  return array.join('&');
}


function cFetch(url, options) {

  let mergeUrl = API_CONFIG.baseUri + url;
  if (url.substr(0, 4) == "http") {
    mergeUrl = url;
  }
  const defaultOptions = {
    method: 'GET'
  };

  const opts = Object.assign({}, defaultOptions, {...options});

// add query params to url when method is GET
if (opts && opts.method == "GET" && opts['params']) {
  mergeUrl = mergeUrl + '?' + toQueryString(opts['params']);
}

opts.credentials = "include";

opts.headers = {
    ...opts.headers,
  'Content-type': "application/x-www-form-urlencoded",
  'Authorization': cookie.get('access_token') || ''
};

if (options.ContentType) {
  opts.headers = Object.assign({}, defaultOptions, { 'Content-type': options.ContentType });
}

return fetch(mergeUrl, opts)
  .then(check401)
  .then(check404)
  .then(checkStatus)
  .then(jsonParse);
}

export function retryFetch(url, options) {
  let mergeUrl = API_CONFIG.baseUri + url;
  if (url.substr(0, 4) == "http") {
    mergeUrl = url;
  }
  const defaultOptions = {
    method: 'GET'
  };

  const opts = Object.assign({}, defaultOptions, {...options});

// add query params to url when method is GET
if (opts && opts['params']) {
  mergeUrl = mergeUrl + '?' + toQueryString(opts['params']);
}



opts.credentials = "include";

opts.headers = {
        ...opts.headers,
  'Content-type': "application/x-www-form-urlencoded",
  'Authorization': cookie.get('access_token') || ''
};

if (options.ContentType) {

  opts.headers = Object.assign({}, defaultOptions, { 'Content-type': options.ContentType });

}

// console.log(opts);
return fetch(mergeUrl, opts);
}


//catch all the unhandled exception
window.addEventListener("unhandledrejection", function (err) {
  const ex = err.reason;
  if (ex.constructor != null && ex.constructor == StandardError || ex.msg != null) {
    message.error(ex.msg, 2.5);
  }
});

export default cFetch;


