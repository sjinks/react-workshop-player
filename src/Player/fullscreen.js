'use strict';

export default {
  isSupported: document.fullscreenEnabled || document.msFullScreenEnabled,
  requestFullscreen: (element) => {
    const method = element.requestFullscreen || element.webkitRequestFullscreen || element.mozRequestFullscreen;
    if (method) {
      return method.apply(element, []);
    }

    // Promise is not supported by IE
    // However, the code will not work with IE anyway (e.g., CSS variables are not supported by IE, so I am not going to waste my time loading polyfills)
    return new Promise((resolve, reject) => reject(new TypeError("Fullscreen mode is not supported")));
  },

  exitFullscreen: () => {
    const method = document.exitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen || document.webkitExitFullscreen;
    if (method) {
      return method.apply(document, []);
    }

    return new Promise((resolve, reject) => reject(new TypeError("Fullscreen mode is not supported")));
  },

  fullscreenElement: () => {
    const props = ['fullscreenElement', 'webkitFullscreenElement', 'mozFullScreenElement', 'msFullscreenElement'];
    for (const p of props) {
      if (p in document) {
        return document[p];
      }
    }

    return null;
  }
};
