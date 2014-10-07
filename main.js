require.config({
    baseUrl: 'ts/',
    paths: {
        'jquery': '../libs/jquery-2.0.1.min',
        'angular': '../libs/angular.min',
        'underscore': '../libs/underscore-min',
        'bootstrap': '../libs/bootstrap/js/bootstrap.min',
        'typeahead': '../libs/typeahead/typeahead'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        jquery: {
            exports: 'jQuery'
        },
        bootstrap: {
            deps: ["jquery"]
        },
        typeahead: {
            deps: ["jquery"]
        },
        underscore: {
            exports: '_'
        }
    }
});

require(['angular', 'jquery', 'bootstrap', 'underscore', 'typeahead'], function () {
    require(['app'], function (app) {
        $(function () {
            angular.bootstrap($('html'), [app.name]);
        });
    });
});