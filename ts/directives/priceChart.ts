import sd = require('services/settingsDialog')
import fd = require('services/financeData')

export function init(priceChartSettingsDialog:sd.ISettingsDialog, financeData:fd.IFinanceData) {
    return {
        restrict: 'A',
        scope: {
            getChart: '&',
            closeWidget: '='
        },
        link: function(){
            //
        },
        controller: function($scope){
            $scope.settings = $scope.getChart();
            $scope.settingsClick = function(){
                priceChartSettingsDialog.open({settings:$scope.settings, onChange:(newSettings)=>{
                    $scope.settings = newSettings;
                }});
            }
        },
        templateUrl: 'templates/priceChart.html'
    };
}