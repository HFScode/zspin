'use strict';

app.factory('statistics', [
  function () {
    console.log('statistics - init');
    var service = {};

    const $fs = require('fs');
    const $path = require('path');
    const remote = require('electron').remote;
    const gui = remote.require('electron').app;

    // Path for the app datas
    var dataPath = gui.getPath('userData');
    var statisticsPath = $path.join(dataPath, 'Statistics.json');

    //Stats to be stored
    service.$obj = {
      runCount:{},
      top10:[]
    };

    // Blocking settings "write"
    service.write = function() {
      var data = JSON.stringify(service.$obj, null, 2);
      return $fs.writeFileSync(statisticsPath, data, 'utf8');
    };

    // Blocking settings "load"
    service.load = function() {
      var data = $fs.readFileSync(statisticsPath, 'utf8');
      try {
        var obj = JSON.parse(data);
        angular.extend(service.$obj, obj);
      } catch (e) {
        console.log('Statistics Error:', e);
      }
    };

    // deletes the Settings.json file
    service.deleteStatisticsFile = function() {
      $fs.unlinkSync(statisticsPath);
    };

    // deletes the Settings.json file
    service.incrementRuns = function(elem) {
      //Increment the launches in stat file
      console.log(elem+' : +1!');
      if(elem in service.$obj.runCount) {
        service.$obj.runCount[elem]++;
      }else{
        service.$obj.runCount[elem] = 1;
      }
      service.write();
    };




    // Write defaults settings if there is no Settings.json to load
    try {
      $fs.accessSync(statisticsPath, $fs.F_OK);
      console.log('Statistics file: ' + statisticsPath);
    } catch (e) {
      console.log('No statistics file ! Creating ' + statisticsPath);
      service.write();
    }

    // Load current values
    service.load();

    console.log('statistics - ready');
    return service;
  }
]);