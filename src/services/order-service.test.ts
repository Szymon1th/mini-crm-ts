import { describe, it, expect, beforeEach } from "vitest";

import ProductService from "./product-service";
import CustomerService from "./customer-service";
import OrderService from "./order-service";

import type { Product } from "../types/product";
import type { CustomerUser } from "../types/user";
import type { OrderItemInput } from "../types/order";

describe("OrderService", () => {
    let productService: ProductService;
    let customerService: CustomerService;
    let orderService: OrderService;

    beforeEach(() => {
        productService = new ProductService();
        customerService = new CustomerService();

        orderService = new OrderService(
            productService,
            customerService
        );

        const keyboard: Product = {
            id: 1,
            name: "Klawiatura",
            price: 150,
            stock: 10
        };

        const mouse: Product = {
            id: 2,
            name: "Mysz",
            price: 80,
            stock: 5
        };

        const customer: CustomerUser = {
            id: 1,
            name: "Jan Kowalski",
            email: "jan@example.com",
            phone: "500600700",
            address: "Warszawa"
        };

        productService.addProduct(keyboard);
        productService.addProduct(mouse);
        customerService.addCustomer(customer);
    });

    it("odrzuca zamówienie dla nieistniejącego klienta", () => {
        const items: OrderItemInput[] = [
            { productId: 1, orderedQuantity: 2 }
        ];

        const result = orderService.createOrder(999, items);

        expect(result).toBe(false);
        expect(orderService.getOrder(1)).toBeUndefined();
        expect(productService.getProduct(1)?.stock).toBe(10);
    });

    it("odrzuca zamówienie z nieistniejącym produktem", () => {
        const items: OrderItemInput[] = [
            { productId: 999, orderedQuantity: 1 }
        ];

        const result = orderService.createOrder(1, items);

        expect(result).toBe(false);
        expect(orderService.getOrder(1)).toBeUndefined();
        expect(productService.getProduct(1)?.stock).toBe(10);
    });

    it.each([0, -1, 1.5])(
        "odrzuca nieprawidłową ilość: %s",
        (quantity) => {
            const items: OrderItemInput[] = [
                { productId: 1, orderedQuantity: quantity }
            ];

            const result = orderService.createOrder(1, items);

            expect(result).toBe(false);
            expect(productService.getProduct(1)?.stock).toBe(10);
            expect(orderService.getOrder(1)).toBeUndefined();
        }
    );

    it("odrzuca zamówienie przekraczające stan magazynowy", () => {
        const items: OrderItemInput[] = [
            { productId: 2, orderedQuantity: 6 }
        ];

        const result = orderService.createOrder(1, items);

        expect(result).toBe(false);
        expect(productService.getProduct(2)?.stock).toBe(5);
        expect(orderService.getOrder(1)).toBeUndefined();
    });

    it("nie zmienia magazynu częściowo, gdy druga pozycja jest nieprawidłowa", () => {
        const items: OrderItemInput[] = [
            { productId: 1, orderedQuantity: 2 },
            { productId: 2, orderedQuantity: 6 }
        ];

        const result = orderService.createOrder(1, items);

        expect(result).toBe(false);

        expect(productService.getProduct(1)?.stock).toBe(10);
        expect(productService.getProduct(2)?.stock).toBe(5);
        expect(orderService.getOrder(1)).toBeUndefined();
    });

    it("sumuje ilości powtórzonego produktu", () => {
        const items: OrderItemInput[] = [
            { productId: 1, orderedQuantity: 6 },
            { productId: 1, orderedQuantity: 6 }
        ];

        const result = orderService.createOrder(1, items);

        // 12 sztuk zamówionych, 10 dostępnych.
        expect(result).toBe(false);
        expect(productService.getProduct(1)?.stock).toBe(10);
        expect(orderService.getOrder(1)).toBeUndefined();
    });

    it("tworzy poprawne zamówienie i aktualizuje magazyn", () => {
        const items: OrderItemInput[] = [
            { productId: 1, orderedQuantity: 2 },
            { productId: 2, orderedQuantity: 1 }
        ];

        const result = orderService.createOrder(1, items);

        if (typeof result === "boolean") {
            throw new Error("Oczekiwano obiektu zamówienia");
        }

        expect(result.id).toBe(1);
        expect(result.customerId).toBe(1);
        expect(result.status).toBe("pending");

        expect(result.products).toHaveLength(2);

        expect(result.products[0]).toEqual({
            productId: 1,
            originalPrice: 150,
            orderedQuantity: 2
        });

        expect(result.products[1]).toEqual({
            productId: 2,
            originalPrice: 80,
            orderedQuantity: 1
        });

        expect(productService.getProduct(1)?.stock).toBe(8);
        expect(productService.getProduct(2)?.stock).toBe(4);

        expect(orderService.getOrder(1)).toEqual(result);
    });
});
