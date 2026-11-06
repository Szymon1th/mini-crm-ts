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

    public decreaseStock(productId: number, quantity: number): Product | undefined {
        const product = this.getProduct(productId);

        if (!product) {
            return undefined;
        }

        if (!Number.isInteger(quantity) || !Number.isFinite(quantity) || quantity <= 0) {
            throw new Error("Invalid product quantity");
        }

        if (product.stock < quantity) {
            throw new Error("Insufficient product stock");
        }

        const updatedProduct = this.productRepository.update(productId, {
            stock: product.stock - quantity
        });

        if (!updatedProduct) {
            throw new Error("Failed to update product stock");
        }

        return updatedProduct;
    }

    public increaseStock(productId: number, quantity: number):Product|undefined{

        if (!Number.isSafeInteger(productId))
            throw new Error("ProductID is not a safe integer");

        if (productId <= 0)
            throw new Error("ProductID should be greater than 0");


        if (!Number.isSafeInteger(quantity) || quantity <= 0) {
            throw new Error("Invalid product quantity");
        }

        const product = this.getProduct(productId);

        if (!product) return undefined

        const newStock = product.stock + quantity;

        if (!Number.isSafeInteger(newStock)) {
            throw new Error("Resulting stock exceeds safe integer limit");
        }

        const updatedProduct = this.productRepository.update(productId,{
            stock:newStock
        })

        return updatedProduct
        
    }
}

export = ProductService;