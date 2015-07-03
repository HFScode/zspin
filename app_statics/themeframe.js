// Theme script addon for zspin html themes

if (window.name === 'themeframe' && window.alreadyLoaded === undefined) {
    // this avoids multiple calls (but I don't know why this is called multiple times ?)
    window.alreadyLoaded = true;

    var videoElem;

    function receiveMessage(event) {
      console.log("FRAME-EVENTMESSAGE:", event);
      if (event.data === 'pause') {
        videoElem.jPlayer('pause');
      } else if (event.data === 'play') {
        videoElem.jPlayer('play');
      }
    };

    function checkLoadPL() {
      if ($.jPlayer) {
        loaded();
      } else {
        window.setTimeout(checkLoadPL, 50);
      }
    }

    function checkLoadJQ() {
      if (window.jQuery && $) {
        var script = document.createElement('script');
        script.src = 'jquery.jplayer.js';
        document.getElementsByTagName('head')[0].appendChild(script);
        checkLoadPL();
      } else {
        window.setTimeout(checkLoadJQ, 50);
      }
    }

    function loaded() {

      var i = 0;
      $('video').each(function() {
        if (this.id === undefined || this.id === '') {
          this.id = 'video'+i;
        }

        $(this).replaceWith(
          '<div id="'+$(this).attr('id')+'" class="'+$(this).attr('class')+'" style="'+$(this).attr('style')+'"></div>'
        );

        var videoExt = this.src.slice(-3);
        var type = (videoExt == 'mp4' ? 'm4v': videoExt);
        var param = {};
        param[type] = this.src;

        videoElem = $("#"+this.id).jPlayer('destroy').jPlayer({
          ready: function () {
            $(this).jPlayer("setMedia", param).jPlayer('play');
          },
          volume: 1,
          size: {width: 'auto'},
          wmode: 'opaque',
          swfPath: "",
          loop: true,
          supplied: type,
          solution: 'flash',
        });

      });

      // window.parent.postMessage('THEMEFRAME LOADED', 'file://');
    }

    document.addEventListener("DOMContentLoaded", function() {
      var script = document.createElement('script');
      script.src = 'jquery.js';
      document.getElementsByTagName('head')[0].appendChild(script);
      checkLoadJQ();
    });

    window.addEventListener("message", receiveMessage, false);
}
