/// <reference path="../definitions/angular.d.ts" />
/// <reference path="../definitions/underscore.d.ts" />
import dashboardController = require('controllers/dashboardController');
import detailsController = require('controllers/detailsController');
import buyController = require('controllers/buyController');

import financeData = require('services/financeData');
import settingsStorage = require('services/settingsStorage');
import settingsDialog = require('services/settingsDialog');
import tooltips = require('services/tooltips');

import companyAutocomplete = require('directives/companyAutocomplete');
import watchList = require('directives/watchList');
import priceChart = require('directives/priceChart');
import tradeFeed = require('directives/tradeFeed');
import tooltip = require('directives/tooltip');

var app = angular.module('dashboard', ['ngRoute']);

app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'templates/main.html',
                controller: 'dashboardController'
            }).
            when('/details/:symbol', {
                templateUrl: 'templates/productDetails.html',
                controller: 'detailsController'
            }).
            when('/buy/:symbol', {
                templateUrl: 'templates/buyProduct.html',
                controller: 'buyController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);

app.controller('dashboardController', dashboardController.init);
app.controller('detailsController', detailsController.init);
app.controller('buyController', buyController.init);

app.constant('tooltips', tooltips);
app.factory('financeData', financeData.init);
app.factory('settingsStorage', settingsStorage.initMain);
app.factory('watchListSettingsStorage', settingsStorage.initWatchList);
app.factory('settingsDialog', settingsDialog.initSettingsDialog);
app.factory('watchListSettingsDialog', settingsDialog.initWatchListSettingsDialog);
app.factory('priceChartSettingsDialog', settingsDialog.initPriceChartSettingsDialog);

app.directive('companyAutocomplete', companyAutocomplete.init);
app.directive('watchList', watchList.init);
app.directive('priceChart', priceChart.init);
app.directive('tradeFeed', tradeFeed.init);
app.directive('widgetTooltip', tooltip.init);


export = app;
