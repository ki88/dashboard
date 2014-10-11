/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/typeahead.d.ts" />
import fd = require('services/financeData')

export function init(financeData:fd.IFinanceData) {
    return {
        restrict: 'A',
        scope: {
            currentCompany: '='
        },
        link: function(scope, element){
            ($(element))
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
                .on('typeahead:selected', function(e, company?){
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