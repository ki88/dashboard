/// <reference path="../../definitions/highcharts.d.ts" />
import sd = require('services/settingsDialog')
import fd = require('services/financeData')

export function init(priceChartSettingsDialog:sd.ISettingsDialog, financeData:fd.IFinanceData) {
    return {
        restrict: 'A',
        scope: {
            getChart: '&',
            closeWidget: '='
        },
        link: function(scope, element){
            var countPeriodDays = (period)=>{
                var d2 = new Date(), d1 = new Date(), months = parseInt(period);
                d1.setMonth(d1.getMonth() - months);
                var timeDiff = Math.abs(d2.getTime() - d1.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                return diffDays;
            }

            var settings = scope.settings = scope.getChart();
            var days = countPeriodDays(settings.period);
            financeData.getPriceChartData(settings.symbol, days).then((chartData)=>{

                var chart = new Highcharts.Chart({
                    chart: {
                        height:270,
                        renderTo: $('.chart-container', element)[0]
                    },
                    title: {text:''},
                    height: 300,
                    subtitle: {text: ''},
                    yAxis: [
                        {title: {text:''}}
                    ],
                    xAxis: {type: 'datetime'},
                    plotOptions: {
                        line: {
                            marker: {enabled:false}
                        }
                    },
                    series: [
                        {
                            data: chartData,
                            lineWidth: 2,
                            showInLegend: false
                        }]
                });
            });
        },
        controller: function($scope){
            $scope.settings = $scope.getChart();
            $scope.settingsClick = ()=>{
                priceChartSettingsDialog.open({settings:$scope.settings);
            }
        },
        templateUrl: 'templates/priceChart.html'
    };
}