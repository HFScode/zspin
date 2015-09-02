// Theme script addon for zspin html themes

window.alreadyLoaded = true;

var videoElem;

function checkLoadPL() {
  if ($.jPlayer) {
    // override width settings for initialisation
    $.jPlayer.prototype._setSize = function() {
      this.status.width = '100%';
      this.status.height = '';
      this.status.cssClass = this.options.size.cssClass;
    };

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

function checkPause() {
  $.get("api/infos", function (api) {
    if (api.focus === true) {
      videoElem.jPlayer('play');
    } else if (api.focus === false) {
      videoElem.jPlayer('pause');
    }
  });

  window.setTimeout(checkPause, 500);
}

function loaded() {
  var i = 0;
  $('video').each(function() {
    if (this.id === undefined || this.id === '') {
      this.id = 'video'+i;
    }
    var volume = $(this).prop('muted') ? 0 : 100;

    $(this).replaceWith(
      '<div id="'+$(this).attr('id')+'" class="'+
        $(this).attr('class')+'" style="'+$(this).attr('style')+'"></div>'
    );

    var videoExt = this.src.slice(-3);
    var type = (videoExt == 'mp4' ? 'm4v': videoExt);
    var param = {};
    param[type] = this.src;

    videoElem = $("#"+this.id).jPlayer('destroy').jPlayer({
      ready: function () {
        $(this).jPlayer("setMedia", param).jPlayer('play');
      },
      volume: volume,
      size: {width: '100%', height: ''},
      wmode: 'opaque',
      swfPath: "",
      loop: true,
      supplied: type,
      solution: 'html',
    });
    i++;
  });
  if (i > 0) {
    checkPause();
  }
}

function checkForHead() {
  head = document.getElementsByTagName('head');
  if (head.length === 0) {
    window.setTimeout(checkForHead, 10);
  } else {
    var script = document.createElement('script');
    script.src = 'jquery.js';
    head[0].appendChild(script);
    checkLoadJQ();
  }
}

checkForHead();
