/// <reference path="../../definitions/underscore.d.ts" />
import m = require('model/model')
import sd = require('services/settingsDialog')
import ss = require('services/settingsStorage')

export interface IDashboarScope extends ng.IScope{
    closeWatchListWidget:()=>void
    closeTradeFeedWidget:()=>void
    closePriceChart:(symbol:string)=>void
    getActiveCharts: ()=>m.IChart[]
    addPriceChart: (company:m.ICompanyInfo)=>void
    openMainSettings: ()=>void
    settings:ss.IDashboardSettings
}

export function init($scope:IDashboarScope, settingsDialog:sd.ISettingsDialog, settingsStorage:ss.ISettingsStorage<ss.IDashboardSettings>){
    $scope.settings = settingsStorage.get();

    $scope.openMainSettings = ()=> {
        settingsDialog.open();
    };

    var onSettingsChange = (stgs?)=>{
        $scope.settings = stgs;
    };

    settingsStorage.onChange(onSettingsChange);

    $scope.closeWatchListWidget = ()=>{
        $scope.settings.watchList = false;
        settingsStorage.set($scope.settings);
    };

    $scope.closeTradeFeedWidget = function() {
        $scope.settings.tradeFeed = false;
        settingsStorage.set($scope.settings);
    }

    $scope.getActiveCharts = ()=>{
        return _.filter($scope.settings.charts, (chart:m.IChart)=>{
            return chart.isActive;
        });
    };

    $scope.addPriceChart = (company)=> {
        var chart = _.find($scope.settings.charts, (chart:m.IChart)=>{
            return chart.symbol == company.symbol;
        });
        if(!chart){
            $scope.settings.charts.push({name:company.name, symbol: company.symbol, period: '12m', isActive: true});
            settingsStorage.set($scope.settings);
        } else if(!chart.isActive){
            chart.isActive = true;
            settingsStorage.set($scope.settings);
        }
    };

    $scope.closePriceChart = (symbol)=>{
        var chart = _.find($scope.settings.charts, (chart:m.IChart)=>{
            return chart.symbol == symbol;
        });
        chart.isActive = false;
        settingsStorage.set($scope.settings);
    };

    $scope.$on('$destroy', ()=>{
        settingsStorage.removeOnChangeListener(onSettingsChange);
    });
}