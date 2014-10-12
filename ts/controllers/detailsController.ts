import fd = require('services/financeData')
import m = require('model/model')

export interface IDetailsScope extends ng.IScope {
    product: m.IProductDetails
}

export function init($scope:IDetailsScope, $routeParams, financeData:fd.IFinanceData){
    financeData.getQuote($routeParams.symbol).then(
        (product:m.IProductDetails)=>{
            $scope.product = product;
        }
    )
}