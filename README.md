# Z Spin

Multi-OS Hyperspin drop in replacement.


## Setup for development
### OSX

```bash
brew update && brew upgrade brew-cask && brew cleanup && brew cask cleanup
brew cask install node-webkit
ln -s /opt/homebrew-cask/Caskroom/node-webkit/0.11.2/node-webkit-v0.11.2-osx-x64/node-webkit.app/Contents/MacOS/node-webkit node-webkit
npm install -g gulp
npm install -g bower
npm install
bower install
cd public
npm install
cd ..
```

and then `gulp watch` and then `./node-webkit public`


if installed with brew:
`/opt/homebrew-cask/Caskroom/node-webkit/0.11.2/node-webkit-v0.11.2-osx-x64/node-webkit.app/Contents/MacOS/node-webkit public`
