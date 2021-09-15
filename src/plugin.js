/**
 * @file plugin.js
 */

import videojs from 'video.js';

const Html5 = videojs.getTech('Html5');
const mergeOptions = videojs.mergeOptions || videojs.util.mergeOptions;
const defaults = {
  mediaDataSource: {},
  config: {}
};

class Hlsjs extends Html5 {

  /**
   * Create an instance of this Tech.
   *
   * @param {Object} [options]
   *        The key/value store of player options.
   *
   * @param {Component~ReadyCallback} ready
   *        Callback function to call when the `Hlsjs` Tech is ready.
   */
   constructor(options, ready) {
     options = mergeOptions(defaults, options);
     super(options, ready);
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
  setSrc(src) {
    if (this.hlsPlayer) {
      // Is this necessary to change source?
      this.hlsPlayer.destroy();
    }

    const mediaDataSource = this.options_.mediaDataSource;
    const config = this.options_.config;

    mediaDataSource.type = mediaDataSource.type === undefined ? 'hls' : mediaDataSource.type;
    mediaDataSource.url = src;
    this.hlsPlayer = new window.Hls();
    this.hlsPlayer.loadSource(mediaDataSource.url);
    this.hlsPlayer.attachMedia(this.el_);
    this.hlsPlayer.on(Hls.Events.MANIFEST_PARSED, () => {
      if(this.options_.autoplay){
        this.el_.play();
      }
    });
    this.hlsPlayer.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        switch(data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
        // try to recover network error
          console.log("fatal network error encountered, try to recover");
          this.hlsPlayer.startLoad();
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          console.log("fatal media error encountered, try to recover");
          this.hlsPlayer.recoverMediaError();
          break;
        default:
        // cannot recover
          this.hlsPlayer.destroy();
          break;
        }
      }
    });
  }

  /**
   * Dispose of Hlsjs.
   */
  dispose() {
    if (this.hlsPlayer) {
      this.hlsPlayer.destroy();
    }
    super.dispose();
  }

}

/**
 * Check if the Hlsjs tech is currently supported.
 *
 * @return {boolean}
 *          - True if the Hlsjs tech is supported.
 *          - False otherwise.
 */
 Hlsjs.isSupported = function() {

  return window.Hls  && true;
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
 Hlsjs.canPlayType = function(type) {
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
 Hlsjs.canPlaySource = function(srcObj, options) {
  return Hlsjs.canPlayType(srcObj.type);
};

// Include the version number.
Hlsjs.VERSION = '__VERSION__';

videojs.registerTech('Hlsjs', Hlsjs);

export default Hlsjs;
