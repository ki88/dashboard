/// <reference path="../../definitions/highcharts.d.ts" />
import sd = require('services/settingsDialog')
import ss = require('services/settingsStorage')
import fd = require('services/financeData')

export function init(priceChartSettingsDialog:sd.ISettingsDialog, financeData:fd.IFinanceData, settingsStorage:ss.ISettingsStorage, errors:any, $q:ng.IQService) {
    return {
        restrict: 'A',
        scope: {
            getChart: '&',
            getCharts: '&',
            isMultiple: '@',
            closeWidget: '='
        },
        link: function(scope, element){
            var countPeriodDays = (period)=>{
                var d2 = new Date(), d1 = new Date(), months = parseInt(period);
                d1.setMonth(d1.getMonth() - months);
                var timeDiff = Math.abs(d2.getTime() - d1.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                return diffDays;
            };

            var chartOptions:any = {
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
                }
            }

            scope.isMultiple = scope.isMultiple=='true';


            if(scope.isMultiple){
                scope.header = 'Price Charts';

                var days = countPeriodDays('12m');

                var charts = [];

                var onChange = (settings?)=>{
                    scope.message = null;

                    var newCharts = scope.getCharts();

                    var isAlike = (charts1, charts2)=>{
                        var symbols1 = _.pluck(charts1, 'symbol');
                        var symbols2 = _.pluck(charts2, 'symbol');
                        return symbols1.length == symbols2.length && _.difference(symbols1, symbols2).length == 0;
                    };

                    if(!isAlike(newCharts, charts)){
                        charts = newCharts;

                        var promises = _.map(charts, (chart:any)=>{
                            return financeData.getPriceChartData(chart.symbol, days);
                        });
                        $q.all(promises).then(
                            (chartsData:any)=>{
                                scope.message = null;

                                if(_.isEmpty(_.flatten(chartsData))){
                                    scope.message = errors.noData;
                                }

                                var series = _.map(chartsData, (item:any, i:number)=>{
                                    return {data:item, lineWidth: 2, name: charts[i].name, showLegend:true};
                                });
                                chartOptions.series = series;
                                new Highcharts.Chart(chartOptions);
                            },
                            ()=>{
                                scope.message = errors.requestError;
                            }
                        );
                    }
                };

                onChange();

                settingsStorage.onChange(onChange);

                scope.$on('$destroy', ()=>{
                    settingsStorage.removeOnChangeListener(onChange);
                });
            }
            else{
                var settings = scope.settings = scope.getChart();

                days = countPeriodDays(settings.period);

                scope.header = 'Price Charts (' + settings.name + ')';

                financeData.getPriceChartData(settings.symbol, days).then((chartData)=>{
                        scope.message = null;

                        if(_.isEmpty(chartData)){
                            scope.message = errors.noData;
                            return;
                        }

                        chartOptions.series = [
                            {
                                data: chartData,
                                lineWidth: 2,
                                showInLegend: false
                            }];

                        var chart = new Highcharts.Chart(chartOptions);
                    },
                    ()=>{
                        scope.message = errors.requestError;
                    });
            }
        },
        controller: function($scope){
            $scope.settings = $scope.getChart();
            $scope.settingsClick = ()=>{
                priceChartSettingsDialog.open({settings:$scope.settings});
            }
        },
        templateUrl: 'templates/priceChart.html'
    };
}