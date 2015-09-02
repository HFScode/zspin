ChangeLog
=========

0.2.0 (unreleased)
------------------

* Replaced nw.js with atom-electron
* Replaced iframe with webview (many modifications to fileserver)
* Deactivated ravenjs temporarly
* Changed interaction between html theme and zspin (added api in fileserver)
* Replaced hs.exe file selection with a data folder selection
* Now using flash ppapi
* Refactored themeframe.js
* gulpfile.js handles atom-electron building and running
* Multilanguage support
* Html default theme support
* Removed FLV support for html themes (use MP4 or OGV)
* Support muted attribute on html themes videos
* Fix: correct html video resizing

0.1.0 (2015-07-11)
------------------

* License info in settings

0.0.6 (2015-07-11)
------------------

* Added sentry and raven-js for debugging
* Added escape and tab key handling
* Case insensitive intro.mp4 and default.zip files detection
* Fix: going in parent menu shows the correct last theme
* Fix: some wheel images not displayed

0.0.5 (2015-07-04)
------------------

* Default themes type basic handling
* Increased wait before unarchive themes from 200ms to 500ms
* Fix blur/focus events creation
* Icon in taskbar
* Fix close fileserver on quit
* Fix video loop on roms
* Fix pause video on lost focus
* Wheel is using percentage for position
* Wheel auto-hide
* Options page small UX improvements
* Default theme handling
* Updated readme + license

0.0.4 (2015-07-03)
------------------

* Edited icons
* Replaced videojs with jPlayer
* Removed old flvplayer

0.0.3 (2015-06-24)
------------------

* Added icons \o/
* Video stop/play when launching game / refocus window
* Using videojs's swf player for all videos
* HTML Theme support if index.html found in zipfile
* Builtin web-server to serve medias for themes and videos

0.0.2 (2015-06-15)
------------------

* First public release.
* OSX, Linux, Windows compatible
* Hyperspin basic themes and settings support
* Automatic theme scaling (1080p and above)
* Custom launcher support
* Keyboard / Gamepad / Joystick support
* Fully customizable wheel
* Options screen
* First run assistant
