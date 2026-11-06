import { isProduct } from "../guards/product-guard";
import type { Product } from "../types/product";
import { Repository } from "../repositories/repository";

class ProductService{
    private productRepository = new Repository<Product>
        
    public addProduct(product: unknown): void {

        if (!isProduct(product)) {
            throw new Error("Invalid product type");
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

        this.productRepository.addItem(product)
    }

    public getProduct(id:number){
        return this.productRepository.getById(id)
    }

   public updateProduct(
    id: number,
    changes: Partial<Omit<Product, "id">>
): Product | undefined | false {

    const isExist = this.getProduct(id) !== undefined;
    if (!isExist) return undefined;

    if (changes.name !== undefined) {
        if (changes.name.trim().length === 0 || changes.name.trim().length > 16) {
            return false;
        }
    }

    if (changes.price !== undefined) {
        if (!Number.isFinite(changes.price) || changes.price < 0) {
            return false;
        }
    }

    if (changes.stock !== undefined) {
        if (!Number.isInteger(changes.stock) || changes.stock < 0) {
            return false;
        }
    }

    if (Object.keys(changes).length === 0) {
        return false;
    }

    return this.productRepository.update(id, changes);
}
}

export = ProductService;

