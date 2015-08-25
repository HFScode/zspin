NPM     	=   npm
BUILD   	=   ./build/
RELEASE 	=   ./releases/
GULP    	=   ./node_modules/.bin/gulp
BOWER   	=   ./node_modules/.bin/bower
PLATFORM	?=  win64

all: install build

install:
		$(NPM) install
		$(BOWER) install

build:
		$(GULP)

run:
		$(GULP) run

watch:
		$(GULP) watch -d

release:
		$(GULP) release -p $(PLATFORM)

clean:
		rm -rf ./bower_components
		rm -rf ./node_modules

fclean: clean
		rm -rf $(BUILD)

.PHONY: all install build run watch release clean fclean
