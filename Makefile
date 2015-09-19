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
		$(GULP)
		$(NPM) --prefix $(BUILD) install $(BUILD)
		# $(NPM) --prefix $(BUILD) install ./app_statics/package.json

build:
		$(GULP)

run:
		$(GULP) run

watch:
		$(GULP) watch -d

release:
		$(GULP) release -p $(PLATFORM)

release-all:
		$(GULP) release -p win64
		$(GULP) release -p osx64
		$(GULP) release -p linux64
		$(GULP) release -p linuxarm

clean:
		$(GULP) clean

fclean: clean
		$(GULP) fclean

.PHONY: all install build run watch release clean fclean
