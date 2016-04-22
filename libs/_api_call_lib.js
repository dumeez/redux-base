import http from 'http';
import LocalStorage from 'localStorage';

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

class ApiCallLib {

  constructor (settings) {
    this.settings = settings;
  } // <= constructor

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------

  destroy (path) {
    return this._request(path, 'DELETE');
  } // <= _destroy

  // ----------------------------------------------------------------------

  get (path) {
    return this._request(path, 'GET');
  } // <= _get

  // ----------------------------------------------------------------------

  post (path, data) {
    return this._post_request(path, data, 'POST');
  } // <= _post

  // ----------------------------------------------------------------------

  put (path, data) {
    return this._post_request(path, data, 'PUT');
  } // <= _put

  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------
  // ----------------------------------------------------------------------

  _get_headers (data, multipart) {

    let headers = {};
    let token = LocalStorage.getItem('token');

    if (data) {
      let postData = JSON.stringify(data);
      headers['Content-Length'] = Buffer.byteLength(postData);
    }

    if (!multipart) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['X-Access-Token'] = token;
    }

    return headers;
  } // <= _get_headers

  // ----------------------------------------------------------------------

  _post_request (url, data, method, multipart) {
    return this._request(url, method, data);
  } // <= _post_request

  // ----------------------------------------------------------------------

  _request (path, method, data) {

    let options = {
      headers: this._get_headers(data),
      protocol: this.settings.api.protocol,
      host: this.settings.api.host,
      port: this.settings.api.port,
      path: path,
      method: method
    };

    let promise = new Promise( (resolve, reject) => {

      let req = http.request(options, (response) => {

        response.on('data', (chunk) => {

          if (!/^20\d$/.test(response.statusCode)) {
            return reject(JSON.parse(chunk));
          }

          return resolve(JSON.parse(chunk));
        });

        response.on('end', () => {

          if (!/^20\d$/.test(response.statusCode)) {
            return reject(response.statusCode);
          }

          return resolve(null);
        });
      });

      req.on('error', (e) => {
        return reject(e);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();

    });

    return promise;

  } // <= _request

}

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

export default ApiCallLib;
