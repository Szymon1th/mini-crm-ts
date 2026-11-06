
import { describe, it, expect, beforeEach } from "vitest";

import ProductService from "../../src/services/product-service";
import CustomerService from "../../src/services/customer-service";
import OrderService from "../../src/services/order-service";

import type { Product } from "../../src/types/product";
import type { CustomerUser } from "../../src/types/user";
import type { OrderItemInput } from "../../src/types/order";

describe("Integration tests", () => {
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

        const product1: Product = {
            id: 1,
            name: "Keyboard",
            price: 150,
            stock: 10
        };

        const product2: Product = {
            id: 2,
            name: "Mouse",
            price: 80,
            stock: 5
        };

        const customer1: CustomerUser = {
            id: 1,
            name: "John Smith",
            email: "john@example.com",
            phone: "500600700",
            address: "Warsaw"
        };

        productService.addProduct(product1);
        productService.addProduct(product2);
        customerService.addCustomer(customer1);
    });

    it("creates an order and decreases product stock", () => {
        const items: OrderItemInput[] = [
            { productId: 1, orderedQuantity: 2 },
            { productId: 2, orderedQuantity: 1 }
        ];

        const createdOrder = orderService.createOrder(1, items);

        expect(createdOrder).toBeDefined();
        expect(createdOrder.id).toBe(1);
        expect(createdOrder.customerId).toBe(1);
        expect(createdOrder.status).toBe("pending");
        expect(createdOrder.products).toHaveLength(2);

        expect(createdOrder.products[0].originalPrice).toBe(150);
        expect(createdOrder.products[1].originalPrice).toBe(80);

        const updatedKeyboard = productService.getProduct(1);
        const updatedMouse = productService.getProduct(2);

        expect(updatedKeyboard?.stock).toBe(8);
        expect(updatedMouse?.stock).toBe(4);

        const savedOrder = orderService.getOrder(1);

        expect(savedOrder).toBeDefined();
        expect(savedOrder?.id).toBe(createdOrder.id);
    });

    
    it("cancels an order and restores product stock", () => {
        const items: OrderItemInput[] = [
            { productId: 1, orderedQuantity: 2 },
            { productId: 2, orderedQuantity: 1 }
        ];

        const createdOrder = orderService.createOrder(1, items);

        expect(createdOrder.products[0].orderedQuantity).toBe(2);
        expect(createdOrder.products[1].orderedQuantity).toBe(1);

        expect(productService.getProduct(1)?.stock).toBe(8);
        expect(productService.getProduct(2)?.stock).toBe(4);

        const canceledOrder = orderService.cancelOrder(1);

        expect(canceledOrder.status).toBe("cancelled");

        expect(canceledOrder.products[0].orderedQuantity).toBe(2);
        expect(canceledOrder.products[1].orderedQuantity).toBe(1);

        expect(productService.getProduct(1)?.stock).toBe(10);
        expect(productService.getProduct(2)?.stock).toBe(5);
    });

    it("does not change product stock when order creation fails", () => {
        const items: OrderItemInput[] = [
            { productId: 1, orderedQuantity: 2 },
            { productId: 2, orderedQuantity: 100 }
        ];

        expect(() => {
            orderService.createOrder(1, items);
        }).toThrow("Insufficient product stock");

        expect(productService.getProduct(1)?.stock).toBe(10);
        expect(productService.getProduct(2)?.stock).toBe(5);

        expect(orderService.getOrder(1)).toBeUndefined();

        const validItems: OrderItemInput[] = [
            { productId: 1, orderedQuantity: 1 }
        ];

        const validOrder = orderService.createOrder(1, validItems);

        expect(validOrder.id).toBe(1);
    });


});
