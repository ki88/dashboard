/// <reference path="../../definitions/jquery.d.ts" />
import fd = require('services/financeData')

/*interface JQueryStatic {
    typeahead:(params:any)=>JQuery
}*/

export function init(financeData:fd.IFinanceData) {
    return {
        restrict: 'A',
        scope: {
            currentCompany: '='
        },
        link: function(scope, element){
            (<any>$(element))
                .addClass('company-autocomplete')
                .typeahead({
                    hint: false,
                    highlight: true,
                    minLength: 1
                },
                {
                    displayKey: 'name',
                    source: function(q, cb){
                        if(scope.currentCompany){
                            scope.currentCompany = null;
                            scope.$apply();
                        }
                        financeData.autocomplete(q).then(function(companies){
                            cb(companies);
                        });
                    }
                })
                .on('typeahead:selected', function(e, company){
                    scope.currentCompany = company;
                    scope.$apply();
                });

            scope.$watch('currentCompany', function(currentCompany) {
                if(currentCompany){
                    $(element).val(currentCompany.name);
                }
            });
        }
    }
}