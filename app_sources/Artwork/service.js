'use strict';

app.factory('artworks', ['$q', 'qbind', 'fs',
  function($q, qbind, fs) {
    console.log('artworks - init');

    var SWFReader = require('swf-reader');

    function getFlashNaturalSize(src) {
      return qbind.call(SWFReader, SWFReader.read, src)
        .then(function(res) { return res[0].frameSize; });
    }

    function getVideoNaturalSize(src) {
      var $el = angular.element('<video preload="metadata" src="'+src+'"/>');
      return qbind.callSafe($el, $el.on, 'loadedmetadata').then(function(ev) {
        return {width: $el[0].videoWidth, height: $el[0].videoHeight};
      });
    }

    function getImageNaturalSize(src) {
      var $el = angular.element('<img src="'+src+'"/>');
      return qbind.callSafe($el, $el.on, 'load').then(function(ev) {
        return {width: $el[0].naturalWidth, height: $el[0].naturalHeight};
      });
    }


    var service = function(src) {
      var obj = {
        src: src,
        type: undefined,
        size: {},
      };

      // Extract type from extname
      obj.type = fs.extname(obj.src||'');

      // Natural size method differ base on the type
      var getSize = $q.when(null);
      if (obj.type === 'png' || obj.type === 'jpg')
        getSize = getImageNaturalSize(obj.src);
      else if (obj.type === 'swf')
        getSize = getFlashNaturalSize(obj.src);
      else if (obj.type === 'flv')
        getSize = $q.when({width: 200, height: 200});
      else if (obj.type === 'mp4')
        getSize = getVideoNaturalSize(obj.src);

      getSize.then(function(size) {
        obj.size = size;
      });

      obj.computeBox = service.computeBox.bind(null, obj);

      return obj;
    };

    // Compute item bounding box base one config
    service.computeBox = function(obj, conf, isOverlay) {
      // If we miss both config or size, abort
      if (!conf && !obj.size)
        return {};

      // Init variables
      var box = {};

      // Original artork size might be overrided in config
      // otherwise, use the native artwork size
      box.width  = (conf.w || obj.size.width || 0);
      box.height = (conf.h || obj.size.height || 0);

      // Position (x,y) is defined as the position of the center
      // of the resized artwork relative to window (top,left)
      // posX = x - (width / 2)
      box.left = (conf.x - (box.width / 2)) || 0;
      box.top = (conf.y - (box.height / 2)) || 0;

      // If the item is an overlay, the previously parsed config
      // is its artorwk's and the actual size and position can be
      // deduced from it.
     if (isOverlay && isOverlay !== 'false') {
        // By default, the overlay has its center aligned with the artwork's center
        box.left = box.left + ((box.width - obj.size.width) / 2);
        box.top  = box.top + ((box.height - obj.size.height) / 2);
        // Apply overlay offsets if any
        box.left += parseInt(conf.overlayoffsetx);
        box.top += parseInt(conf.overlayoffsety);
        // The overlay size is its native one
        box.width = (obj.size.width || 0);
        box.height = (obj.size.height || 0);
      }
      return box;
    };

    console.log('artworks - ready');
    return service;
  }
]);