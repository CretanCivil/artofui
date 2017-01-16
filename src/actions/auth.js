import cFetch from './../utils/cFetch';
import cookie from 'js-cookie';
import {LOGIN } from './../constants/actionTypes';
import { API_CONFIG } from './../config/api';


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

  if (object instanceof(Array)) {
    object.forEach((value) => {
      array.push(setUriParam(keys, value, '[]'));
    });
  } else if (object instanceof(Object)) {
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

function toQueryString(object) {
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

export const loginUser = (creds, cbk) => {

  creds.rememberPassword = true;
  creds.encode = false;
  creds.labelKey = "ci";

  //83250460@qq.com
	let body = toQueryString(creds);
  

  return {
    type: LOGIN,
    fallback: cbk,
    
    payload: cFetch(API_CONFIG.auth, { method: "POST", body: /*JSON.stringify(creds)*/body }).then(response => {
     console.log(response);
     
      cookie.set('access_token', response.access_token);
    })
    
  };
};
