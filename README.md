![Logo zspin](assets/256.png)
# Zspin
[![Join the chat at https://gitter.im/HFScode/zspin](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/HFScode/zspin?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
### <a href="README-fr.md">Version francaise</a>    

zspin is an arcade frontend, working on windows, linux, and OSX.    
It's beta software, so expect things to bug !    
Don't hesitate to open an issue or send me a PR !

![Image zspin](http://zspin.vik.io/static/zspin-small.gif)

## Current features

* OSX, Linux, Windows compatible
* Hyperspin basic themes and settings support
* HTML5 theme support
* Multilanguage support
* Automatic theme scaling (1080p and above)
* Custom launcher support
* Keyboard / Gamepad / Joystick native support
* Fully customizable wheel
* Options screen
* First run assistant
* On start / on stop application launch
* Basic API

## Install
<a href="https://github.com/vikbez/zspin-gui/releases">Go to downloads.</a>

## Planned features

* Better theme support
* Social stuff ?
* Over-network configuration ?
* You have an idea ? Tell me !

## Help the project
There is a lot of stuff to do and you can help a LOT by doing:    

* Documentation
* Translations
* Testing / bug reporting
* Finding what to add to this list

## For development
### OSX

```bash
# for brew users
$> brew install nodejs npm

# install & build app
$> make install

# (optional) watch source (livereload) & build
$> gulp watch # -d for debug

# run zspin
$> gulp run

# if you want to make a release
$> gulp release -p [platform] # -d for debug
```

## License

zspin is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

If you want to sell zspin installed on some hardware (commercial use), <a href="mailto:v@42.am?subject=I+want+a+license+!">contact me</a> ! I will give you a license for that.
