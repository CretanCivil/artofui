// This file configures the development web server
// which supports hot reloading and synchronized testing.

// Require Browsersync along with webpack and middleware for it
import browserSync from 'browser-sync';
// Required for react-router browserHistory
// see https://github.com/BrowserSync/browser-sync/issues/204#issuecomment-102623643
import historyApiFallback from 'connect-history-api-fallback';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../webpack.config.dev';

const bundler = webpack(config);
import proxy from 'http-proxy-middleware';

 
/*
const apiProxy = proxy('/api/v1', {
  target: 'http://localhost:4000',
  changeOrigin: true,
  ws: true
});
*/

///dashboards/11997/charts.json
const cloudProxy = proxy('/v1', {
  target: 'http://cloud.oneapm.com',
  changeOrigin: true,
  ws: true
});
const kongProxy = proxy('/p1', {
  target: 'http://api.apmsys.com:8000',
  changeOrigin: true,
  ws: true
});

const javaProxy = proxy('/apmsys', {
  target: 'http://user.apmsys.com:8000',
  changeOrigin: true,
  ws: true
});



function onProxyRes(proxyRes) {

   // proxyRes.headers['x-added'] = 'foobar';     // add new header to response 
    delete proxyRes.headers['location'];       // remove header from response 
    
}

//http://user.oneapm.com/pages/v2/login
const webProxy = proxy('/pages/v2/login', {
  target: 'http://user.oneapm.com',
  changeOrigin: true,
  ws: true,
  cookieDomainRewrite: {
    "*": ""
  },
  onProxyRes: onProxyRes
});
/*
input:83250460@qq.com
password:MTIzNHF3ZXI=
rememberPassword:true
encode:false
labelKey:ci

 */


// Run Browsersync and use middleware for Hot Module Replacement
browserSync({
  port: 8080,
  //更改默认端口weinre
ui: {
    port: 8081,
    weinre: {
        port: 9090
    }
},
  server: {
    baseDir: 'src',

    middleware: [
      //apiProxy,
      kongProxy,
      javaProxy,
      cloudProxy,
      webProxy,
      webpackDevMiddleware(bundler, {
        // Dev middleware can't access config, so we provide publicPath
        publicPath: config.output.publicPath,

        // pretty colored output
        stats: { colors: true },

        // Set to false to display a list of each file that is being bundled.
        noInfo: true

        // for other settings see
        // http://webpack.github.io/docs/webpack-dev-middleware.html
      }),

      // bundler should be the same as above
      webpackHotMiddleware(bundler),

      historyApiFallback()
    ]
  },

  // no need to watch '*.js' here, webpack will take care of it for us,
  // including full page reloads if HMR won't work
  files: [
    'src/*.html'
  ]
});
