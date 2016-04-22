import {enums} from '../helpers';

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

function _promise_middleware () {
  return next => action => {
    const {promise, type, ...rest} = action;

    const FAILURE = `${type}_${enums.failure}`;
    const REQUEST = `${type}_${enums.request}`;
    const SUCCESS = `${type}_${enums.success}`;

    if (!promise) {
      return next(action);
    }

    next({...rest, type: REQUEST});

    return promise
    .then((res) => {
      next({...rest,
        data: res,
        type: SUCCESS
      });
      return true;
    }, (error) => {
      next({...rest, error, type: FAILURE});
      return false;
    });
  }
} // <= _promise_middleware

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

export default _promise_middleware;
