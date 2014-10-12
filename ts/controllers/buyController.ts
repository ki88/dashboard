import fd = require('services/financeData')
import m = require('model/model')

export interface IBuyScope extends ng.IScope {
    product: m.IProductDetails
}

export function init($scope:IBuyScope, $routeParams, financeData:fd.IFinanceData){
    financeData.getQuote($routeParams.symbol).then(
        (product:m.IProductDetails)=>{
            $scope.product = product;
        }
    )
}