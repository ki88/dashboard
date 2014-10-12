
export interface ICompanyInfo {
    symbol:string
    name:string
}

export interface IProductDetails extends ICompanyInfo {
    lastPrice:number
    change:number
    volume:number
}

export interface IChart extends ICompanyInfo {
    period: string
    isActive:boolean
}

export interface IUserInfo{
    name:string
    pictureUrl:string
}

export interface IUserActivity{
    user:IUserInfo
    action: number
    amount: number
    currency: string
    price: number
    company: string
    date: Date
}