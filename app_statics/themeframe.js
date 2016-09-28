// Theme script addon for zspin html themes

window.alreadyLoaded = true;

var i;
var videoElem = [];
var play = true;

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
    loadApiInfos();
    checkLoadPL();
  } else {
    window.setTimeout(checkLoadJQ, 50);
  }
}

function checkPause() {
  $.get("api/zspin", function (api) {
    if (play === false && api.focused === true) {
      for (i = 0; i < videoElem.length; i++) {
        videoElem[i].jPlayer('play');
      }
      play = true;

    } else if (play === true && api.focused === false) {
      for (i = 0; i < videoElem.length; i++) {
        videoElem[i].jPlayer('pause');
      }
      play = false;
    }
  });

  window.setTimeout(checkPause, 500);
}

function loadApiInfos() {
  $.get("api/infos", function (api) {
    // get infos on current theme then apply it to .zspin-<infoname> div
    for (var i in api) {
      $('.zspin-'+i).text(api[i]);
    }

    // replace src on elements with a zspin-src attribute
    $('[zspin-src]').each(function() {
      this.src = $(this).attr('zspin-src').replace(/%[^%]+%/g, function(v) {
        return api[v.slice(1, -1)];
      });
    });
  });
}

function loaded() {
  var i = 0;

  // this is used to show webview after all loadings are finished
  console.log('LOADING FINISHED');

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

    videoElem[i] = $("#"+this.id).jPlayer('destroy').jPlayer({
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

    var swf_script = document.createElement('script');
    swf_script.src = 'swf2js.js';
    head[0].appendChild(swf_script);

    var tween_script = document.createElement('script');
    tween_script.src = 'TweenMax.min.js';
    head[0].appendChild(tween_script);
    checkLoadJQ();
  }
}

checkForHead();
