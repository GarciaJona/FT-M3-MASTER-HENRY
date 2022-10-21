'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:

class $Promise {
  constructor(executor, state = 'pending', value = undefined) {
    if (typeof executor !== 'function')
      throw new TypeError('executor function');
    this._state = state;
    this._value = value;
    this._handlerGroups = [];
    executor(
      (data) => this._internalResolve(data),
      (data) => this._internalReject(data),
    );
  }
  static resolve(value) {
    // if (value instanceof $Promise) return value;
    // let promise = new $Promise(() => {});
    // if (promise._state === "pending") {
    //   promise._internalResolve(value);
    // }
    // return promise;
    if (value instanceof $Promise) return value;
    return new $Promise(() => {}, 'fulfilled', value);
  }

  static all(values) {
    if (values.some((ele) => ele instanceof $Promise)) {
      return values.reduce((accumulator, value) => {
        return accumulator.then((results) => {
          return $Promise.resolve(value).then((result) => {
            return [...results, result];
          });
        });
      }, Promise.resolve([]));
    } else return new $Promise(() => {}, 'fulfilled', values);
  }
}

// let promise = new $Promise(() => {});
let SMALL_DELAY = 10;
let MAX_DELAY = 100;
function slowPromise(value, delay) {gut¿
//   if (typeof executor !== "function") throw new TypeError("executor function");
//   this._state = "pending";
//   this._value = undefined;
//   this._handlerGroups = [];
//   executor(
//     (data) => this._internalResolve(data),
//     (data) => this._internalReject(data)
//   );
// }

$Promise.prototype._internalResolve = function (data) {
  if (this._state === 'pending') {
    this._value = data;
    this._state = 'fulfilled';
    this._callHandlers();
  }
};

$Promise.prototype._internalReject = function (data) {
  if (this._state === 'pending') {
    this._value = data;
    this._state = 'rejected';
    this._callHandlers();
  }
};

$Promise.prototype.then = function (successCb, errorCb) {
  typeof successCb !== 'function' ? (successCb = undefined) : 1;
  typeof errorCb !== 'function' ? (errorCb = undefined) : 1;
  let downstreamPromise = new $Promise(() => {});
  this._handlerGroups.push({
    successCb,
    errorCb,
    downstreamPromise,
  });
  if (this._state !== 'pending') this._callHandlers();
  return downstreamPromise;
};

$Promise.prototype._callHandlers = function () {
  while (this._handlerGroups.length > 0) {
    let actual = this._handlerGroups.shift();
    if (this._state === 'fulfilled') {
      if (!actual.successCb)
        actual.downstreamPromise._internalResolve(this._value);
      else {
        try {
          let result = actual.successCb(this._value);
          if (result instanceof $Promise)
            result.then(
              (value) => actual.downstreamPromise._internalResolve(value),
              (error) => actual.downstreamPromise._internalReject(error),
            );
          else {
            actual.downstreamPromise._internalResolve(result);
          }
        } catch (error) {
          actual.downstreamPromise._internalReject(error);
        }
      }
      // actual.successCb?.(this._value);
    }
    if (this._state === 'rejected') {
      if (!actual.errorCb)
        actual.downstreamPromise._internalReject(this._value);
      else {
        try {
          let result = actual.errorCb(this._value);
          if (result instanceof $Promise)
            result.then(
              (value) => actual.downstreamPromise._internalResolve(value),
              (error) => actual.downstreamPromise._internalReject(error),
            );
          else {
            actual.downstreamPromise._internalResolve(result);
          }
        } catch (error) {
          actual.downstreamPromise._internalReject(error);
        }
      }
      // actual.errorCb?.(this._value);
    }
  }
};

$Promise.prototype.catch = function (errorCb) {
  return this.then(null, errorCb);
};

// $Promise.prototype.resolve = function () {
//   this.resolve.staticMethod = function () {};
// };

// $Promise.prototype.all = function () {};

module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

let Promise = require('pledge');
…
let promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
