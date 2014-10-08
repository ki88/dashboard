/// <reference path="../definitions/angular.d.ts" />
/// <reference path="../definitions/underscore.d.ts" />
import dashboardController = require('controllers/dashboardController');

import financeData = require('services/financeData');
import settingsStorage = require('services/settingsStorage');
import settingsDialog = require('services/settingsDialog');

import companyAutocomplete = require('directives/companyAutocomplete');
import watchList = require('directives/watchList');
import priceChart = require('directives/priceChart');

var app = angular.module('dashboard', []);

app.controller('dashboardController', dashboardController.init);

app.factory('financeData', financeData.init);
app.factory('settingsStorage', settingsStorage.initMain);
app.factory('watchListSettingsStorage', settingsStorage.initWatchList);
app.factory('settingsDialog', settingsDialog.initSettingsDialog);
app.factory('watchListSettingsDialog', settingsDialog.initWatchListSettingsDialog);
app.factory('priceChartSettingsDialog', settingsDialog.initPriceChartSettingsDialog);

app.directive('companyAutocomplete', companyAutocomplete.init);
app.directive('watchList', watchList.init);
app.directive('priceChart', priceChart.init);

export = app;
