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
    constructor(private defStgs:any, private key:string){
        this.defaultSettings = angular.copy(this.defStgs);
    }

    private defaultSettings:any
    private handlers:{(settings?:any):void;}[] = []

    private fire(s:any){
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

    public set(settings:any){
        var settingsStr = JSON.stringify(settings);
        localStorage.setItem(this.key, settingsStr);
        this.fire(angular.copy(settings));
    }

    public reset(){
        var settingsStr = JSON.stringify(this.defaultSettings);
        localStorage.setItem(this.key, settingsStr);
        this.fire(angular.copy(this.defaultSettings));
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

var defaults = {
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
    return new SettingsStorage(defaults, 'watch-list-settings');
}

export function initWatchList(){
    var defs = _.map(defaults.charts, (chart:any)=>{
        return {symbol:chart.symbol, name:chart.name};
    });
    return new SettingsStorage(defs, 'dashboard-settings');
}