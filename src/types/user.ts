export interface User {
    id:number,
    name: string,
    email: string
}

export interface Customer{
    phone:string,
    address: string
}

export interface Admin{
    permissions: string[]
}

export type CustomerUser = User & Customer;

export type AdminUser = User & Admin;