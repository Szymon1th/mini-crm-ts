import { isProduct } from "../guards/product-guard";
import type { Product } from "../types/product";
import { Repository } from "../repositories/repository";

class ProductService {
    private productRepository = new Repository<Product>();

    public addProduct(product: unknown): void {
        if (!isProduct(product)) {
            throw new Error("Invalid product type");
        }

        if (product.name.trim().length === 0 || product.name.trim().length > 16) {
            throw new Error("Invalid product name");
        }

        if (!Number.isFinite(product.price) || product.price < 0) {
            throw new Error("Invalid product price");
        }

        if (!Number.isInteger(product.stock) || product.stock < 0) {
            throw new Error("Invalid product stock");
        }

        this.productRepository.addItem(product);
    }

    public getProduct(id: number): Product | undefined {
        return this.productRepository.getById(id);
    }

    public updateProduct(id: number,changes: Partial<Omit<Product, "id">>): Product | undefined {
        if(!this.getProduct(id)) return undefined;
        

        if (changes.name !== undefined) {
            if (changes.name.trim().length === 0 || changes.name.trim().length > 16) {
                throw new Error("Invalid product name");
            }
        }

        if (changes.price !== undefined) {
            if (!Number.isFinite(changes.price) || changes.price < 0) {
                throw new Error("Invalid product price");
            }
        }

        if (changes.stock !== undefined) {
            if (!Number.isInteger(changes.stock) || changes.stock < 0) {
                throw new Error("Invalid product stock");
            }
        }

        if (Object.keys(changes).length === 0) throw new Error("No fields provided for update");
        

        return this.productRepository.update(id, changes);
    }
}

export = ProductService;