/// <reference path="../../definitions/angular.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />

export interface ISettingsOnChangeHandler{
    (settings?:any):void
}

export interface ISettingsStorage{
    get:()=>any
    set:(settings:any)=>void
    reset:()=>void
    onChange:(handler:ISettingsOnChangeHandler)=>void
    removeOnChangeListener:(handler:ISettingsOnChangeHandler)=>void
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

    public onChange(handler:ISettingsOnChangeHandler){
        this.handlers.push(handler);
    }

    public removeOnChangeListener(handler:ISettingsOnChangeHandler){
        var index = this.handlers.indexOf(handler);
        if (index > -1) {
            this.handlers.splice(index, 1);
        }
    }
}

export function initMain(){
    var defaults = {watchList:true, tradeFeed:true, charts: [{symbol:'AAPL', name: 'Apple Inc', period: '1m', isActive: true}], chartsAsNewWidgets:false};
    return new SettingsStorage(defaults);
}

export function initWatchList(){
    var defaults = [{symbol:'AAPL', name: 'Apple Inc'}];
    return new SettingsStorage(defaults);
}