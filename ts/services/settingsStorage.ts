/// <reference path="../../definitions/angular.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />

export interface ISettingsStorage{
    get:()=>any
    set:(settings:any)=>void
    reset:()=>void
    onChange:(handler:(settings?:any)=>void)=>any
}

export class SettingsStorage implements ISettingsStorage {
    constructor(private defStgs:any){
        this.stgs = angular.copy(this.defStgs);
    }

    private stgs:any
    private handlers:{(settings?:any):void;}[] = []

    private fire(s:any){
        _.each(this.handlers, function(handler){
            handler(s);
        });
    }

    public get(){
        return angular.copy(this.stgs);
    }

    public set(settings:any){
        this.stgs = angular.copy(settings);
        this.fire(angular.copy(this.stgs));
    }

    public reset(){
        this.stgs = angular.copy(this.defStgs);
        this.fire(angular.copy(this.stgs));
    }

    public onChange(handler:(settings?:any)=>void){
        this.handlers.push(handler);
    }
}

export function initMain(){
    var defaults = {watchList:true, tradeFeed:true, charts: [{symbol:'AAPL', name: 'Apple Inc', period: '1m', isActive: true}]};
    return new SettingsStorage(defaults);
}

export function initWatchList(){
    var defaults = [{symbol:'AAPL', name: 'Apple Inc'}];
    return new SettingsStorage(defaults);
}