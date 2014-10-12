import sd = require('services/settingsDialog')
import ss = require('services/settingsStorage')
import fd = require('services/financeData')
import m = require('model/model')

export interface IWatchListScope extends ng.IScope {
    closeWidget:()=>void
    addPriceChart:(company:m.ICompanyInfo)=>void
    settingsClick: ()=>void
    message:string
    quotes:m.IProductDetails[]
}

export function init($q:ng.IQService, watchListSettingsDialog:sd.ISettingsDialog, watchListSettingsStorage:ss.ISettingsStorage<ss.IWatchListSettings>, financeData:fd.IFinanceData, errors:any) {
    return {
        restrict: 'A',
        scope: {
            closeWidget: '=',
            addPriceChart: '='
        },
        link: function(){
        },
        controller: function($scope:IWatchListScope){

            var applySettings = (settings:ss.IWatchListSettings)=>{
                var quotesPromise = _.map(<any>settings, (item:m.ICompanyInfo)=>{
                    return financeData.getQuote(item.symbol);
                });
                $q.all(quotesPromise).then((quotes:m.IProductDetails[])=>{
                        $scope.message = null;
                        $scope.quotes = quotes;
                    },
                    ()=>{
                        $scope.message = errors.requestError;
                    });
            };

            applySettings(watchListSettingsStorage.get());

            $scope.settingsClick = ()=>{
                watchListSettingsDialog.open();
            };

            var onSettingsChange = (newSettings?:ss.IWatchListSettings)=>{
                applySettings(newSettings);
            };

            watchListSettingsStorage.onChange(onSettingsChange);

            $scope.$on('$destroy', ()=>{
                watchListSettingsStorage.removeOnChangeListener(onSettingsChange);
            });
        },
        templateUrl: 'templates/watchList.html'
    };
}