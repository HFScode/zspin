// Theme script addon for zspin html themes

if (window.name === 'themeframe' && window.alreadyLoaded === undefined) {
    // this avoids multiple calls (but I don't know why this is called multiple times ?)
    window.alreadyLoaded = true;

    var videoElem;

    vjsOptions = {
      'autoplay': true,
      'loop': true,
      'flash': {
        'swf': "video-js.swf"
      },
      'techOrder': ['flash'],
    };

    function receiveMessage(event) {
      console.log("FRAME-EVENTMESSAGE:", event);
      if (event.data === 'pause') {
        videoElem.pause();
      } else if (event.data === 'play') {
        videoElem.play();
      }
    };

    function checkLoads() {
      if (window.jQuery && window.videojs) {
        loaded();
      } else {
        window.setTimeout(checkLoads, 50);
      }
    }

    function loaded() {
      console.log('themeframe really loaded');

      var i = 0;
      $('video').each(function() {
        if (this.id === undefined || this.id === '') {
          this.id = 'video'+i;
        }

        $(this).append(
          '<source src="'+this.src+'" type="video/'+this.src.slice(-3)+'"/>'
        );

        videoElem = videojs(this.id, vjsOptions).ready(function() {
          $('#video style').remove();
        });
      });

      // window.parent.postMessage('THEMEFRAME LOADED', 'file://');
    }

    document.addEventListener("DOMContentLoaded", function() {
      // adding deps
      scripts = ['jquery.js', 'video.js'];
      for (var i in scripts) {
        var script = document.createElement('script');
        script.src = scripts[i];
        document.getElementsByTagName('head')[0].appendChild(script);
      }

      var style = document.createElement('style');
      style.innerHTML = '.vjs-control-bar, .vjs-big-play-button, .vjs-caption-settings {display: none !important;}';
      document.getElementsByTagName('head')[0].appendChild(style);
      checkLoads();
    });

    window.addEventListener("message", receiveMessage, false);
}
