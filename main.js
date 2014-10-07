require.config({
    baseUrl: 'ts/',
    paths: {
        'jquery': '../libs/jquery-2.0.1.min',
        'angular': '../libs/angular.min'
    },
    shim: {
        angular: {
            exports: 'angular'
        },
        jquery: {
            exports: 'jQuery'
        }
    }
});

require(['angular', 'jquery'], function () {
    require(['app'], function (app) {
        $(function () {
            angular.bootstrap($('html'), [app.name]);
        });
    });
});