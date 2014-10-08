/// <reference path="../../definitions/angular.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />

export interface IFinanceData{
    getQuote:(symbol:string)=>ng.IPromise<any>
    autocomplete:(q:string)=>ng.IPromise<any>
}

export class FinanceData implements IFinanceData {
    constructor(private $q:ng.IQService, private $http:ng.IHttpService){}

    public getQuote(symbol:string) {
        var deferred = this.$q.defer();
        this.$http.jsonp('http://dev.markitondemand.com/Api/v2/Quote/jsonp?callback=JSON_CALLBACK', {params:{symbol:symbol}})
            .success((data:any)=>{
                var quote = {symbol:data.Symbol, name: data.Name, lastPrice: data.LastPrice, volume: data.Volume, change: data.Change};
                return deferred.resolve(quote);
            });
        return deferred.promise;
    }

    public autocomplete(q:string){
        var deferred = this.$q.defer();
        this.$http.jsonp('http://dev.markitondemand.com/Api/v2/Lookup/jsonp?callback=JSON_CALLBACK', {params:{input:q}})
            .success(function(data:any){
                var companies = _.map(data, (item:any)=>{
                    return {name:item.Name, symbol:item.Symbol};
                });
                return deferred.resolve(companies);
            })
        return deferred.promise;
    }
}

export function init($q:ng.IQService, $http:ng.IHttpService){
    return new FinanceData($q, $http);
}