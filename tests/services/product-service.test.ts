import { beforeEach, describe, expect, it } from "vitest";
import ProductService from "../../src/services/product-service";

describe("ProductService", () => {
    let productService: ProductService;

    beforeEach(() => {
        productService = new ProductService();

        const keyboard: unknown = {
            id: 2,
            name: "Klawiatura",
            price: 150,
            stock: 10
        };

        productService.addProduct(keyboard);
    });

    it("Dodanie poprawnego produktu", () => {
        const keyboard: unknown = {
            id: 1,
            name: "Klawiatura",
            price: 150,
            stock: 10
        };

        expect(() => {
            productService.addProduct(keyboard);
        }).not.toThrow();
    });

    it("Dodanie produktu z niepoprawną strukturą", () => {
        const keyboard: unknown = {
            id: 1,
            name: "Klawiatura",
            price: 150,
        };

        expect(() => {
            productService.addProduct(keyboard);
        }).toThrow("Invalid product type");
    });

    it("Dodanie produktu z zajętym ID", () => {
        const keyboard: unknown = {
            id: 2,
            name: "Klawiatura",
            price: 150,
            stock: 10
        };

        expect(() => {
            productService.addProduct(keyboard);
        }).toThrow("Duplicate product ID");
    });

    it("Dodanie produktu z pustą nazwą", () => {
        const keyboard: unknown = {
            id: 1,
            name: "",
            price: 150,
            stock: 10
        };

        expect(() => {
            productService.addProduct(keyboard);
        }).toThrow("Invalid product name");
    });

    it("Dodanie produktu z ujemną ceną", () => {
        const keyboard: unknown = {
            id: 1,
            name: "Klawiatura",
            price: -150,
            stock: 10
        };

        expect(() => {
            productService.addProduct(keyboard);
        }).toThrow("Invalid product price");
    });

    it("Dodanie produktu z ceną NaN", () => {
        const keyboard: unknown = {
            id: 1,
            name: "Klawiatura",
            price: NaN,
            stock: 10
        };

        expect(() => {
            productService.addProduct(keyboard);
        }).toThrow("Invalid product price");
    });

    it("Dodanie produktu z ujemnym stockiem", () => {
        const keyboard: unknown = {
            id: 1,
            name: "Klawiatura",
            price: 10,
            stock: -16
        };

        expect(() => {
            productService.addProduct(keyboard);
        }).toThrow("Invalid product stock");
    });

    it("Dodanie produktu z nieskończoną ceną", () => {
        const keyboard: unknown = {
            id: 1,
            name: "Klawiatura",
            price: Infinity,
            stock: 16
        };

        expect(() => {
            productService.addProduct(keyboard);
        }).toThrow("Invalid product price");
    });
});