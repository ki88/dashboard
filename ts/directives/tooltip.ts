/// <reference path="../../definitions/jquery.d.ts" />
/// <reference path="../../definitions/bootstrap.d.ts" />

export function init(tooltips) {
    return {
        restrict: 'A',
        scope: {
        },
        link: function(scope, element, attrs){
            var msg = tooltips[attrs.widgetTooltip];
            if(msg){
                (<any>$(element)).tooltip({
                    title: msg,
                    container: 'body'
                });
            }
        }
    }
}