/// <reference path="../../definitions/angular.d.ts" />
/// <reference path="../../definitions/underscore.d.ts" />
import m = require('model/model')

export interface ISettingsOnChangeHandler<T>{
    (settings?:T):void
}

export interface ISettingsStorage<T>{
    get:()=>any
    set:(settings:T)=>void
    reset:()=>void
    onChange:(handler:ISettingsOnChangeHandler<T>)=>void
    removeOnChangeListener:(handler:ISettingsOnChangeHandler<T>)=>void
}

export interface IDashboardSettings {
    watchList:boolean
    tradeFeed:boolean
    charts:m.IChart[]
    chartsAsNewWidgets:boolean
}

export interface IWatchListSettings{
    [index:number]:m.ICompanyInfo
}

export class SettingsStorage<T> implements ISettingsStorage<T> {
    constructor(private defStgs:T, private key:string){
        this.defaultSettings = angular.copy(this.defStgs);
    }

    private defaultSettings:T
    private handlers:{(settings?:T):void;}[] = []

    private fire(s:T){
        _.each(this.handlers, function(handler){
            handler(s);
        });
    }

    public get(){
        var settingsStr = localStorage.getItem(this.key);
        var settings = null;
        if(settingsStr){
            settings = JSON.parse(settingsStr);
        }
        else{
            settings = angular.copy(this.defaultSettings);
        }
        return angular.copy(settings);
    }

    public set(settings:T){
        var settingsStr = JSON.stringify(settings);
        localStorage.setItem(this.key, settingsStr);
        this.fire(angular.copy(settings));
    }

    public reset(){
        var settingsStr = JSON.stringify(this.defaultSettings);
        localStorage.setItem(this.key, settingsStr);
        this.fire(angular.copy(this.defaultSettings));
    }

    public onChange(handler:ISettingsOnChangeHandler<T>){
        this.handlers.push(handler);
    }

    public removeOnChangeListener(handler:ISettingsOnChangeHandler<T>){
        var index = this.handlers.indexOf(handler);
        if (index > -1) {
            this.handlers.splice(index, 1);
        }
    }
}

var defaults:IDashboardSettings = {
    watchList:true,
    tradeFeed:true,
    charts: [
        { symbol:'AAPL', name: 'Apple Inc', period: '12m', isActive: true },
        { symbol:'GOOGL', name: 'Google Inc', period: '12m', isActive: false },
        { symbol:'MSFT', name: 'Microsoft Corp', period: '12m', isActive: false },
        { symbol:'KO', name: 'The Coca-Cola Co', period: '12m', isActive: false },
        { symbol:'F', name: 'Ford Motor Co', period: '12m', isActive: false }
    ],
    chartsAsNewWidgets:true
};

export function initMain(){
    return new SettingsStorage<IDashboardSettings>(defaults, 'watch-list-settings');
}

export function initWatchList(){
    var defs:IWatchListSettings = _.map(defaults.charts, (chart:m.IChart)=>{
        return {symbol:chart.symbol, name:chart.name};
    });
    return new SettingsStorage<IWatchListSettings>(defs, 'dashboard-settings');
}