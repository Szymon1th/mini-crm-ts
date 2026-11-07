
import { beforeEach, describe, expect, it } from "vitest";
import ProductService from "../../src/services/product-service";
import type { Product } from "../../src/types/product";

describe("ProductService", () => {
    let productService: ProductService;

    const keyboard: Product = {
        id: 1,
        name: "Keyboard",
        price: 150,
        stock: 10
    };

    beforeEach(() => {
        productService = new ProductService();
        productService.addProduct(keyboard);
    });

    describe("addProduct()", () => {
        it("adds a valid product", () => {
            const mouse: Product = {
                id: 2,
                name: "Mouse",
                price: 80,
                stock: 5
            };

            expect(() => productService.addProduct(mouse)).not.toThrow();
            expect(productService.getProduct(2)).toEqual(mouse);
        });

        it("rejects a product with an invalid structure", () => {
            const invalidProduct: unknown = {
                id: 2,
                name: "Mouse",
                price: 80
            };

            expect(() => productService.addProduct(invalidProduct))
                .toThrow("Invalid product type");
        });

        it("rejects null", () => {
            expect(() => productService.addProduct(null))
                .toThrow("Invalid product type");
        });

        it("rejects an array instead of an object", () => {
            expect(() => productService.addProduct([keyboard]))
                .toThrow("Invalid product type");
        });

        it("rejects a product with an empty name", () => {
            expect(() => productService.addProduct({
                ...keyboard,
                id: 2,
                name: "   "
            })).toThrow("Invalid product name");
        });

        it("rejects a product name longer than 16 characters", () => {
            expect(() => productService.addProduct({
                ...keyboard,
                id: 2,
                name: "VeryLongProductName"
            })).toThrow("Invalid product name");
        });

        it("rejects a negative price", () => {
            expect(() => productService.addProduct({
                ...keyboard,
                id: 2,
                price: -150
            })).toThrow("Invalid product price");
        });

        it("rejects a NaN price", () => {
            expect(() => productService.addProduct({
                ...keyboard,
                id: 2,
                price: NaN
            })).toThrow("Invalid product price");
        });

        it("rejects an infinite price", () => {
            expect(() => productService.addProduct({
                ...keyboard,
                id: 2,
                price: Infinity
            })).toThrow("Invalid product price");
        });

        it("accepts a price equal to zero", () => {
            expect(() => productService.addProduct({
                ...keyboard,
                id: 2,
                price: 0
            })).not.toThrow();
        });

        it("rejects negative stock", () => {
            expect(() => productService.addProduct({
                ...keyboard,
                id: 2,
                stock: -1
            })).toThrow("Invalid product stock");
        });

        it("rejects non-integer stock", () => {
            expect(() => productService.addProduct({
                ...keyboard,
                id: 2,
                stock: 1.5
            })).toThrow("Invalid product stock");
        });

        it("rejects a product with a duplicate ID", () => {
            expect(() => productService.addProduct(keyboard)).toThrow();
        });
    });

    describe("getProduct()", () => {
        it("returns the product with the specified ID", () => {
            expect(productService.getProduct(1)).toEqual(keyboard);
        });

        it("returns undefined if the product does not exist", () => {
            expect(productService.getProduct(999)).toBeUndefined();
        });

        it("prevents modifying the product by changing the returned copy", () => {
            const product = productService.getProduct(1);

            if (!product) throw new Error("Product not found");

            product.stock = 0;

            expect(productService.getProduct(1)?.stock).toBe(10);
        });
    });

    describe("updateProduct()", () => {
        it("updates the product's name", () => {
            const result = productService.updateProduct(1, {
                name: "Mouse"
            });

            expect(result?.name).toBe("Mouse");
        });

        it("updates the product's price", () => {
            const result = productService.updateProduct(1, {
                price: 200
            });

            expect(result?.price).toBe(200);
        });

        it("updates the product's stock", () => {
            const result = productService.updateProduct(1, {
                stock: 20
            });

            expect(result?.stock).toBe(20);
        });

        it("updates multiple fields simultaneously", () => {
            const result = productService.updateProduct(1, {
                name: "Mouse",
                price: 80,
                stock: 5
            });

            expect(result).toEqual({
                id: 1,
                name: "Mouse",
                price: 80,
                stock: 5
            });
        });

        it("preserves unchanged product fields", () => {
            const result = productService.updateProduct(1, {
                name: "Mouse"
            });

            expect(result).toEqual({
                id: 1,
                name: "Mouse",
                price: 150,
                stock: 10
            });
        });

        it("returns undefined if the product does not exist", () => {
            expect(productService.updateProduct(999, {
                name: "Mouse"
            })).toBeUndefined();
        });

        it("rejects an empty name", () => {
            expect(() => productService.updateProduct(1, {
                name: "   "
            })).toThrow("Invalid product name");
        });

        it("rejects a name that is too long", () => {
            expect(() => productService.updateProduct(1, {
                name: "VeryLongProductName"
            })).toThrow("Invalid product name");
        });

        it("rejects a negative price", () => {
            expect(() => productService.updateProduct(1, {
                price: -10
            })).toThrow("Invalid product price");
        });

        it("rejects invalid stock", () => {
            expect(() => productService.updateProduct(1, {
                stock: 1.5
            })).toThrow("Invalid product stock");
        });

        it("rejects an update with no fields provided", () => {
            expect(() => productService.updateProduct(1, {}))
                .toThrow("No fields provided for update");
        });
    });

    describe("decreaseStock()", () => {
        it("decreases the product's stock", () => {
            const result = productService.decreaseStock(1, 3);

            expect(result?.stock).toBe(7);
            expect(productService.getProduct(1)?.stock).toBe(7);
        });

        it("returns undefined if the product does not exist", () => {
            expect(productService.decreaseStock(999, 2)).toBeUndefined();
        });

        it.each([0, -1, 1.5, NaN, Infinity])(
            "rejects an invalid quantity: %s",
            quantity => {
                expect(() => productService.decreaseStock(1, quantity))
                    .toThrow("Invalid product quantity");

                expect(productService.getProduct(1)?.stock).toBe(10);
            }
        );

        it("rejects decreasing stock below zero", () => {
            expect(() => productService.decreaseStock(1, 11))
                .toThrow("Insufficient product stock");

            expect(productService.getProduct(1)?.stock).toBe(10);
        });

        it("allows decreasing stock exactly to zero", () => {
            const result = productService.decreaseStock(1, 10);

            expect(result?.stock).toBe(0);
        });
    });

    describe("increaseStock()", () => {
        it("increases the product's stock", () => {
            const result = productService.increaseStock(1, 5);

            expect(result?.stock).toBe(15);
            expect(productService.getProduct(1)?.stock).toBe(15);
        });

        it("returns undefined if the product does not exist", () => {
            expect(productService.increaseStock(999, 2)).toBeUndefined();
        });

        it.each([0, -1, 1.5, NaN, Infinity])(
            "rejects an invalid quantity: %s",
            quantity => {
                expect(() => productService.increaseStock(1, quantity))
                    .toThrow("Invalid product quantity");

                expect(productService.getProduct(1)?.stock).toBe(10);
            }
        );

        it("rejects an invalid product ID", () => {
            expect(() => productService.increaseStock(-1, 2))
                .toThrow("ProductID should be greater than 0");
        });

        it("rejects an ID exceeding the safe integer range", () => {
            expect(() => productService.increaseStock(
                Number.MAX_SAFE_INTEGER + 1,
                2
            )).toThrow("ProductID is not a safe integer");
        });

        it("rejects stock exceeding Number.MAX_SAFE_INTEGER", () => {
            productService.updateProduct(1, {
                stock: Number.MAX_SAFE_INTEGER
            });

            expect(() => productService.increaseStock(1, 1))
                .toThrow("Resulting stock exceeds safe integer limit");

            expect(productService.getProduct(1)?.stock)
                .toBe(Number.MAX_SAFE_INTEGER);
        });
    });
});
