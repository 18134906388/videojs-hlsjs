/**
 * videojs-hlsjs
 * @version 0.2.0
 * @copyright 2021 mister-ben <git@misterben.me>
 * @license Apache-2.0
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.videojsHlsjs = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _video = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _video2 = _interopRequireDefault(_video);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @file plugin.js
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var Html5 = _video2.default.getTech('Html5');
var mergeOptions = _video2.default.mergeOptions || _video2.default.util.mergeOptions;
var defaults = {
  mediaDataSource: {},
  config: {}
};

var Hlsjs = function (_Html) {
  _inherits(Hlsjs, _Html);

  /**
   * Create an instance of this Tech.
   *
   * @param {Object} [options]
   *        The key/value store of player options.
   *
   * @param {Component~ReadyCallback} ready
   *        Callback function to call when the `Hlsjs` Tech is ready.
   */
  function Hlsjs(options, ready) {
    _classCallCheck(this, Hlsjs);

    options = mergeOptions(defaults, options);
    return _possibleConstructorReturn(this, (Hlsjs.__proto__ || Object.getPrototypeOf(Hlsjs)).call(this, options, ready));
  }

  /**
   * A getter/setter for the `Hlsjs` Tech's source object.
   *
   * @param {Tech~SourceObject} [src]
   *        The source object you want to set on the `Hlsjs` techs.
   *
   * @return {Tech~SourceObject|undefined}
   *         - The current source object when a source is not passed in.
   *         - undefined when setting
   */


  _createClass(Hlsjs, [{
    key: 'setSrc',
    value: function setSrc(src) {
      var _this2 = this;

      if (this.hlsPlayer) {
        // Is this necessary to change source?
        this.hlsPlayer.destroy();
      }

      var mediaDataSource = this.options_.mediaDataSource;
      var config = this.options_.config;

      mediaDataSource.type = mediaDataSource.type === undefined ? 'hls' : mediaDataSource.type;
      mediaDataSource.url = src;
      this.hlsPlayer = new window.Hls();
      this.hlsPlayer.loadSource(mediaDataSource.url);
      this.hlsPlayer.attachMedia(this.el_);
      this.hlsPlayer.on(Hls.Events.MANIFEST_PARSED, function () {
        if (_this2.options_.autoplay) {
          _this2.el_.play();
        }
      });
      this.hlsPlayer.on(Hls.Events.ERROR, function (event, data) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // try to recover network error
              console.log("fatal network error encountered, try to recover");
              _this2.hlsPlayer.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log("fatal media error encountered, try to recover");
              _this2.hlsPlayer.recoverMediaError();
              break;
            default:
              // cannot recover
              _this2.hlsPlayer.destroy();
              break;
          }
        }
      });
    }

    /**
     * Dispose of Hlsjs.
     */

  }, {
    key: 'dispose',
    value: function dispose() {
      if (this.hlsPlayer) {
        this.hlsPlayer.destroy();
      }
      _get(Hlsjs.prototype.__proto__ || Object.getPrototypeOf(Hlsjs.prototype), 'dispose', this).call(this);
    }
  }]);

  return Hlsjs;
}(Html5);

/**
 * Check if the Hlsjs tech is currently supported.
 *
 * @return {boolean}
 *          - True if the Hlsjs tech is supported.
 *          - False otherwise.
 */


Hlsjs.isSupported = function () {

  return window.Hls && true;
};

/**
 * Hlsjs supported mime types.
 *
 * @constant {Object}
 */
Hlsjs.formats = {
  'video/hls': 'Hlsjs',
  'video/x-hls': 'Hlsjs'
};

/**
 * Check if the tech can support the given type
 *
 * @param {string} type
 *        The mimetype to check
 * @return {string} 'probably', 'maybe', or '' (empty string)
 */
Hlsjs.canPlayType = function (type) {
  if (Hlsjs.isSupported() && type in Hlsjs.formats) {
    return 'maybe';
  }

  return '';
};

/**
 * Check if the tech can support the given source
 * @param {Object} srcObj
 *        The source object
 * @param {Object} options
 *        The options passed to the tech
 * @return {string} 'probably', 'maybe', or '' (empty string)
 */
Hlsjs.canPlaySource = function (srcObj, options) {
  return Hlsjs.canPlayType(srcObj.type);
};

// Include the version number.
Hlsjs.VERSION = '0.2.0';

_video2.default.registerTech('Hlsjs', Hlsjs);

exports.default = Hlsjs;
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});
