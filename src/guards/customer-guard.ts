import { CustomerUser,AdminUser,User } from "../types/user";

export function isUser(value:unknown):value is User{
    if(value===null) return false
    if(Array.isArray(value)) return false
    if(typeof value !== "object") return false

    if(!("id" in value) || typeof value.id !== "number") return false
    if(!("name" in value) || typeof value.name !== "string") return false
    if(!("email" in value) || typeof value.email !== "string") return false

    return true
}

export function isCustomerUser(value:unknown): value is CustomerUser {

    if(!isUser(value)) return false

    if(!("phone" in value) || typeof value.phone !== "string") return false
    if(!("address" in value) || typeof value.address !== "string") return false
   

    return true
}

export function isAdminUser(value:unknown): value is AdminUser{
    if(!isUser(value)) return false

    if(!("permissions" in value) || !(Array.isArray(value.permissions) && value.permissions.every(permission=>
        typeof permission === "string"
    ))) return false
    
    return true

}