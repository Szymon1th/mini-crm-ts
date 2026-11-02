import { isProduct } from "../guards/product-guard";
import type { Product } from "../types/product";

class ProductService{
    private productList :Product[] = []

        
    public addProduct(product: unknown): void {

        if (!isProduct(product)) {
            throw new Error("Invalid product type");
        }

        const isTaken = this.productList.some(p => p.id === product.id);

        if (isTaken) {
            throw new Error("Duplicate product ID");
        }

        if (product.name.trim().length === 0) {
            throw new Error("Invalid product name");
        }

        if (!Number.isFinite(product.price) || product.price < 0) {
            throw new Error("Invalid product price");
        }

        if (!Number.isFinite(product.stock) || product.stock < 0) {
            throw new Error("Invalid product stock");
        }

        this.productList.push(product);
    }

    public getProduct(id:number){
        return this.productList.find(product=>product.id === id)
    }

   public findProduct(id: number, name?: string): boolean {
    return this.productList.some(product => 
        product.id === id || (name !== undefined && product.name === name)
    );
}

   public updateProduct(
    idOrigin: number, 
    newName?: string, 
    newPrice?: number, 
    newStock?: number
):Product | undefined | boolean{

    if(newName!== undefined && newName.length === 0) return false 
    if((newPrice!==undefined && newPrice < 0)) return false
    if(newStock!==undefined && newStock < 0) return false

    const foundProduct = this.productList.find(product => product.id === idOrigin)

    if(!foundProduct) return undefined

    if (newName !== undefined && newName.length > 0) {
        foundProduct.name = newName;
    }
    if (newPrice !== undefined && newPrice >= 0) {
        foundProduct.price = newPrice;
    }
    if (newStock !== undefined && newStock >= 0) {
        foundProduct.stock = newStock;
    }

    return { ...foundProduct };
}
}

export = ProductService;

