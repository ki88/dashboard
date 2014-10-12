/// <reference path="../../definitions/underscore.d.ts" />
import sd = require('services/settingsDialog')
import ss = require('services/settingsStorage')

export function init($scope, settingsDialog:sd.SettingsDialog, settingsStorage:ss.SettingsStorage){
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
        return _.filter($scope.settings.charts, (chart:any)=>{
            return chart.isActive;
        });
    };

    $scope.addPriceChart = (company)=> {
        var chart = _.find($scope.settings.charts, (chart:any)=>{
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
        var chart = _.find($scope.settings.charts, (chart:any)=>{
            return chart.symbol == symbol;
        });
        chart.isActive = false;
        settingsStorage.set($scope.settings);
    };

    $scope.$on('$destroy', ()=>{
        settingsStorage.removeOnChangeListener(onSettingsChange);
    });
}