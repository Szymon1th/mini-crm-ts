import { isProduct } from "./product-guard";
import { describe, it, expect } from "vitest";

describe("ProductGuard", () => {

    it("rejects an object with a missing stock property", () => {
        const keyboard: unknown = {
            id: 1,
            name: "Keyboard",
            price: 150,
        };

        const result = isProduct(keyboard);
        expect(result).toBe(false);
    });

    it("rejects an array instead of an object", () => {
        const mouse: unknown = [{
            id: 2,
            price: 80,
            stock: 5
        }];

        const result = isProduct(mouse);
        expect(result).toBe(false);
    });

    it("accepts a valid Product object", () => {
        const mouse: unknown = {
            id: 2,
            name: "Mouse",
            price: 80,
            stock: 5
        };

        const result = isProduct(mouse);
        expect(result).toBe(true);
    });

    it("rejects an empty object", () => {
        const headphones: unknown = {};

        const result = isProduct(headphones);
        expect(result).toBe(false);
    });

    it("rejects null", () => {
        const phones: unknown = null;

        const result = isProduct(phones);
        expect(result).toBe(false);
    });

    it("rejects an invalid price type", () => {
        const mouse: unknown = {
            id: 2,
            name: "Mouse",
            price: "80",
            stock: 5
        };

        const result = isProduct(mouse);
        expect(result).toBe(false);
    });

    it("accepts an object with an additional property", () => {
        const product: unknown = {
            id: 1,
            name: "Keyboard",
            price: 150,
            stock: 10,
            category: "Electronics"
        };

        const result = isProduct(product);
        expect(result).toBe(true);
    });

});