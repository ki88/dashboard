require.config({
    baseUrl: 'ts/',
    paths: {
        'jquery': '../libs/jquery-2.0.1.min',
        'angular': '../libs/angular.min',
        'angularRoute': '../libs/angular-route',
        'underscore': '../libs/underscore-min',
        'bootstrap': '../libs/bootstrap/js/bootstrap.min',
        'typeahead': '../libs/typeahead/typeahead',
        'highcharts': '../libs/highcharts',
        'humane': '../libs/humane',
        'parse': '../libs/parse.min'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        angularRoute: {
            deps: ['angular']
        },
        jquery: {
            exports: 'jQuery'
        },
        bootstrap: {
            deps: ['jquery']
        },
        typeahead: {
            deps: ['jquery']
        },
        underscore: {
            exports: '_'
        },
        highcharts: {
            exports: 'Highcharts'
        },
        humane: {
            exports: 'humaneDate'
        },
        parse: {
            exports: 'Parse'
        }
    }
});

require(['angular', 'angularRoute', 'jquery', 'bootstrap', 'underscore', 'typeahead', 'highcharts', 'humane', 'parse'], function () {
    require(['app'], function (app) {
        $(function () {
            angular.bootstrap($('html'), [app.name]);
        });
    });
});