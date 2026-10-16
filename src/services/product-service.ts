import type { Product } from "../types/product";

class ProductService{
    private productList :Product[] = []

    public addProduct(product : Product) : void | boolean{
        const isTaken = this.productList.some(p=>p.id === product.id)

        if(isTaken) return false   
        if(product.name!== undefined && product.name.trim().length === 0) return false
        if (product.price !== undefined && (isNaN(product.price) || product.price < 0)) return false;
        if((product.stock!==undefined  && (isNaN(product.stock) || product.stock <0)))return false
        
        this.productList.push(product)
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

