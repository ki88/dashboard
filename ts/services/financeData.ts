/// <reference path="../../definitions/angular.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
import m = require('model/model')

export interface IFinanceData{
    getQuote:(symbol:string)=>ng.IPromise<m.IProductDetails>
    autocomplete:(q:string)=>ng.IPromise<m.ICompanyInfo[]>
    getPriceChartData:(symbol:string, days:number)=>ng.IPromise<any>
}

export class FinanceData implements IFinanceData {
    constructor(private $q:ng.IQService, private $http:ng.IHttpService){}

    public getQuote(symbol:string) {
        var deferred = this.$q.defer();
        this.$http.jsonp('http://dev.markitondemand.com/Api/v2/Quote/jsonp?callback=JSON_CALLBACK', {params:{symbol:symbol}, cache:true})
            .success((data:any)=>{
                var quote = {symbol:data.Symbol, name: data.Name, lastPrice: data.LastPrice, volume: data.Volume, change: data.Change};
                return deferred.resolve(quote);
            })
            .error(()=>{
                return deferred.reject();
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
            .error(()=>{
                return deferred.reject();
            });
        return deferred.promise;
    }

    public getPriceChartData(symbol:string, days:number){
        var deferred = this.$q.defer();
        this.$http.jsonp('http://dev.markitondemand.com/Api/v2/InteractiveChart/jsonp?callback=JSON_CALLBACK', {
            params: {
                parameters: {
                    Normalized: false,
                    NumberOfDays: days,
                    DataPeriod: 'Day',
                    Elements: [{
                        Symbol: symbol,
                        Type: 'price',
                        Params: ['c']
                    }]
                }
            },
            cache:true
        })
            .success(function(json:any) {
                var dates = json.Dates || [];
                var elements = json.Elements || [];
                var chartSeries = [];
                var fixDate = function(dateIn) {
                    var dat = new Date(dateIn);
                    return Date.UTC(dat.getFullYear(), dat.getMonth(), dat.getDate());
                };

                if (elements[0]) {
                    for (var i = 0, datLen = dates.length; i < datLen; i++) {
                        var dat = fixDate(dates[i]);
                        var pointData = [
                            dat,
                            elements[0].DataSeries['close'].values[i]
                        ];
                        chartSeries.push(pointData);
                    };
                }
                return deferred.resolve(chartSeries);
            })
            .error(()=>{
                return deferred.reject();
            });
        return deferred.promise;
    }
}

export function init($q:ng.IQService, $http:ng.IHttpService){
    return new FinanceData($q, $http);
}