import sd = require('services/settingsDialog')
import ss = require('services/settingsStorage')
import fd = require('services/financeData')

export function init($q:ng.IQService, watchListSettingsDialog:sd.ISettingsDialog, settingsStorage:ss.ISettingsStorage, watchListSettingsStorage:ss.ISettingsStorage, financeData:fd.IFinanceData) {
    return {
        restrict: 'A',
        scope: {
            closeWidget: '=',
            addPriceChart: '='
        },
        link: function(){
            //
        },
        controller: function($scope){

            var applySettings = (settings)=>{
                var quotesPromise = _.map(settings, (item:any)=>{
                    return financeData.getQuote(item.symbol);
                });
                $q.all(quotesPromise).then((quotes)=>{
                    $scope.quotes = quotes;
                });
            };

            applySettings(watchListSettingsStorage.get());

            $scope.settingsClick = ()=>{
                watchListSettingsDialog.open();
            };

            watchListSettingsStorage.onChange((newSettings?:any)=>{
                applySettings(newSettings);
            });
        },
        templateUrl: 'templates/watchList.html'
    };
}