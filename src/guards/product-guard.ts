import type { Product } from "../types/product";

function isProduct(value:unknown): value is Product{
    if(value === null) return false

    if(typeof value === "object" && "id" in value && typeof value.id === "number") return true

    
}