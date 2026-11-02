import type { Product } from "../types/product";

function isProduct(value:unknown): value is Product{

    if(value === null) return false
    if(typeof value !== "object") return false
    if(Array.isArray(value)) return false

    if (!("id" in value) || typeof value.id !== "number") return false;
    if (!("name" in value) || typeof value.name !== "string") return false;
    if (!("price" in value) || typeof value.price !== "number") return false;
    if (!("stock" in value) || typeof value.stock !== "number") return false;

    
    return true 
}