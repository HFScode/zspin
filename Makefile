NPM     =   npm
BUILD   =   ./build/
RELEASE =   ./releases/
GULP    =   ./node_modules/.bin/gulp
BOWER   =   ./node_modules/.bin/bower
NWBUILD =   node ./node_modules/.bin/nwbuild
# necessary to run without internet connection
NWVER   =   0.12.1

all: install build

install:
		$(NPM) install
		$(BOWER) install

build:
		$(GULP)

run:
		$(NWBUILD) -v $(NWVER) -r $(BUILD)

watch:
		$(GULP) watch

release:
		$(NWBUILD) -o $(RELEASE) $(BUILD) -p win32,osx32,linux32

clean:
		rm -rf ./node_modules
		rm -rf ./bower_components

fclean: clean
		rm -rf $(BUILD)

.PHONY: all install build run watch release clean fclean
