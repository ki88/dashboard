/// <reference path="../definitions/angular.d.ts" />
import dc = require('controllers/dashboardController');

var app = angular.module('dashboard', []);

app.controller('dashboardController', dc.dashboardController);

export = app;
