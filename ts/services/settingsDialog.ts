/// <reference path="../../definitions/angular.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
import ss = require('services/settingsStorage')

export interface ISettingsDialog {
    open:(params?:any)=>void
}

export class SettingsDialogBase implements ISettingsDialog {
    constructor(
        private controller:(scope:ng.IScope, params?:any)=>void,
        private templateUrl:string,
        private $q:ng.IQService,
        private $http:ng.IHttpService,
        private $rootScope:ng.IRootScopeService,
        private $compile:ng.ICompileService){
    }

    public open(params?:any){
        this.$q.all([
            this.$http.get('templates/settingsWindowBase.html'),
            this.$http.get(this.templateUrl)
        ]).then((resp)=>{
            var baseTemplate = resp[0].data, msTemplate = resp[1].data;
            var scope:any = this.$rootScope.$new();

            scope.close = ()=>{
                settingsWindowElement.remove();
                scope.$destroy();
            };

            this.controller(scope, params);

            var settingsWindowElement = $(baseTemplate);
            $('.content', settingsWindowElement).append(msTemplate);
            settingsWindowElement = this.$compile(settingsWindowElement)(scope);
            $('body').append(settingsWindowElement);
        });
    }
}

export class SettingsDialog extends SettingsDialogBase {
    constructor($q:ng.IQService,
                $http:ng.IHttpService,
                $rootScope:ng.IRootScopeService,
                $compile:ng.ICompileService,
                settingsStorage:ss.ISettingsStorage,
                watchListSettingsStorage:ss.ISettingsStorage){
        super((scope:any)=>{
                scope.header = 'Dashboard Settings';

                scope.settings = settingsStorage.get();
                scope.save = function(){
                    settingsStorage.set(scope.settings);
                    isDirty = false;
                };
                scope.reset = function(){
                    settingsStorage.reset();
                    watchListSettingsStorage.reset();
                    scope.settings = settingsStorage.get();
                    isDirty = null;
                };

                scope.canSave = function(){
                    return isDirty;
                };

                var isDirty = null;
                scope.$watch('settings', function(){
                    isDirty = !(_.isNull(isDirty));
                }, true);
            },
            'templates/mainSettingsWindowContent.html', $q, $http, $rootScope, $compile);
    }
}

export class WatchListSettingsDialog extends SettingsDialogBase {
    constructor($q:ng.IQService,
                $http:ng.IHttpService,
                $rootScope:ng.IRootScopeService,
                $compile:ng.ICompileService,
                watchListSettingsStorage:ss.ISettingsStorage){
        super((scope:any)=>{
                scope.header = 'Watch List Settings';

                scope.settings = watchListSettingsStorage.get();

                scope.addCompany = (company)=>{
                    scope.settings.push(company);
                };

                scope.canAddCompany = ()=>{
                    if(!scope.currentCompany){
                        return false;
                    }
                    else{
                        return !_.chain(scope.settings)
                            .pluck('symbol')
                            .contains(scope.currentCompany.symbol)
                            .value();
                    }
                };

                scope.changePosition = (company, direction)=>{
                    var index = scope.settings.indexOf(company);
                    var nextCompany = scope.settings[index+direction];
                    scope.settings[index] = nextCompany;
                    scope.settings[index+direction] = company;
                };

                scope.save = ()=>{
                    watchListSettingsStorage.set(scope.settings);
                    isDirty = false;
                };
                scope.reset = ()=>{
                    scope.settings = watchListSettingsStorage.get();
                    isDirty = null;
                };

                scope.canSave = ()=>{
                    return isDirty;
                };

                var isDirty = null;
                scope.$watch('settings', ()=>{
                    isDirty = !(_.isNull(isDirty));
                }, true);
        },
        'templates/watchListSettingsContent.html', $q, $http, $rootScope, $compile);
    }
}

export class PriceChartSettingsDialog extends SettingsDialogBase {
    constructor($q:ng.IQService,
                $http:ng.IHttpService,
                $rootScope:ng.IRootScopeService,
                $compile:ng.ICompileService,
                settingsStorage:ss.ISettingsStorage){
        super((scope:any, params?:any)=>{
                scope.header = 'Price Chart Settings';

                var settings = params.settings;

                var lastSettings = settings;
                scope.settings = angular.copy(settings);
                var mainSettings = settingsStorage.get();
                var allCharts = mainSettings.charts;

                scope.save = ()=>{
                    var chart = _.find(allCharts, (chart:any)=>{
                        return chart.symbol == scope.settings.symbol && !chart.isActive;
                    });
                    if(chart){
                        var i = allCharts.indexOf(chart);
                        allCharts.splice(i, 1);
                        chart.isActive = true;
                    }
                    var oldChart = _.find(allCharts, (chart:any)=>{
                        return chart.symbol == lastSettings.symbol;
                    });
                    var index = allCharts.indexOf(oldChart);
                    allCharts[index] = {symbol:scope.settings.symbol, name:scope.settings.name, period: scope.settings.period, isActive:true};
                    settingsStorage.set(mainSettings);

                    lastSettings = angular.copy(scope.settings);
                };
                scope.reset = ()=>{
                    scope.settings = angular.copy(lastSettings);
                    scope.currentCompany = {symbol:scope.settings.symbol, name:scope.settings.name};
                };

                scope.currentCompany = {symbol:settings.symbol, name:settings.name};
                scope.$watch('currentCompany', (currentCompany, currentCompanyOld)=> {
                    if(currentCompany && currentCompany != currentCompanyOld) {
                        scope.settings.name = currentCompany.name;
                        scope.settings.symbol = currentCompany.symbol;
                    }
                });

                scope.canSave = ()=>{
                    return scope.currentCompany && !angular.equals(scope.settings, lastSettings) &&
                        !(_.find(allCharts, (chart:any)=>{
                            return chart.symbol == scope.settings.symbol && chart.isActive;
                        }) && scope.settings.symbol != lastSettings.symbol);
                };

            },
            'templates/priceChartSettingsContent.html', $q, $http, $rootScope, $compile);
    }
}

export function initSettingsDialog($q:ng.IQService,
                                  $http:ng.IHttpService,
                                  $rootScope:ng.IRootScopeService,
                                  $compile:ng.ICompileService,
                                  settingsStorage:ss.ISettingsStorage,
                                  watchListSettingsStorage:ss.ISettingsStorage){
    return new SettingsDialog($q, $http, $rootScope, $compile, settingsStorage, watchListSettingsStorage);
}

export function initWatchListSettingsDialog($q:ng.IQService,
                                  $http:ng.IHttpService,
                                  $rootScope:ng.IRootScopeService,
                                  $compile:ng.ICompileService,
                                  watchListSettingsStorage:ss.ISettingsStorage){
    return new WatchListSettingsDialog($q, $http, $rootScope, $compile, watchListSettingsStorage);
}

export function initPriceChartSettingsDialog($q:ng.IQService,
                                  $http:ng.IHttpService,
                                  $rootScope:ng.IRootScopeService,
                                  $compile:ng.ICompileService,
                                  settingsStorage:ss.ISettingsStorage){
    return new PriceChartSettingsDialog($q, $http, $rootScope, $compile, settingsStorage);
}
