import fd = require('services/financeData')

export function init($scope, $routeParams, financeData:fd.IFinanceData){
    financeData.getQuote($routeParams.symbol).then(
        (product)=>{
            $scope.product = product;
        }
    )
}