/// <reference path="../../definitions/underscore.d.ts" />

export function init($scope, settingsDialog, settingsStorage){
    $scope.settings = settingsStorage.get();

    $scope.openMainSettings = ()=> {
        settingsDialog.open();
    };

    settingsStorage.onChange((stgs)=>{
        $scope.settings = stgs;
    });

    $scope.closeWatchListWidget = ()=>{
        $scope.settings.watchList = false;
        settingsStorage.set($scope.settings);
    };

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
            $scope.settings.charts.push({name:company.name, symbol: company.symbol, period: '1m', isActive: true});
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
}