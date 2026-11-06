
import { describe, it, expect, beforeEach } from "vitest";

import ProductService from "../../src/services/product-service";
import CustomerService from "../../src/services/customer-service";
import OrderService from "../../src/services/order-service";

import type { Product } from "../../src/types/product";
import type { CustomerUser } from "../../src/types/user";
import type { OrderItemInput, StatusOrder } from "../../src/types/order";

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
            name: "Keyboard",
            price: 150,
            stock: 10
        };

        const mouse: Product = {
            id: 2,
            name: "Mouse",
            price: 80,
            stock: 5
        };

        const customer: CustomerUser = {
            id: 1,
            name: "John Smith",
            email: "john@example.com",
            phone: "500600700",
            address: "Warsaw"
        };

        productService.addProduct(keyboard);
        productService.addProduct(mouse);
        customerService.addCustomer(customer);
    });


    describe("createOrder()", () => {
        it("rejects an order for a non-existing customer", () => {
            const items: OrderItemInput[] = [
                { productId: 1, orderedQuantity: 2 }
            ];

            expect(() => orderService.createOrder(999, items))
                .toThrow("Customer not found");

            expect(orderService.getOrder(1)).toBeUndefined();
            expect(productService.getProduct(1)?.stock).toBe(10);
        });

        it("rejects an order containing a non-existing product", () => {
            const items: OrderItemInput[] = [
                { productId: 999, orderedQuantity: 1 }
            ];

            expect(() => orderService.createOrder(1, items))
                .toThrow("Product doesn't exist");

            expect(productService.getProduct(1)?.stock).toBe(10);
            expect(orderService.getOrder(1)).toBeUndefined();
        });

        it.each([0, -1, 1.5, NaN, Infinity])(
            "rejects an invalid quantity: %s",
            (quantity) => {
                const items: OrderItemInput[] = [
                    { productId: 1, orderedQuantity: quantity }
                ];

                expect(() => orderService.createOrder(1, items))
                    .toThrow("Invalid order item");

                expect(productService.getProduct(1)?.stock).toBe(10);
                expect(orderService.getOrder(1)).toBeUndefined();
            }
        );

        it.each([0, -1, 1.5, NaN, Infinity])(
            "rejects an invalid product ID: %s",
            (productId) => {
                const items = [
                    { productId, orderedQuantity: 1 }
                ];

                expect(() => orderService.createOrder(1, items))
                    .toThrow("Invalid order item");
            }
        );

        it("rejects an order exceeding available stock", () => {
            const items: OrderItemInput[] = [
                { productId: 2, orderedQuantity: 6 }
            ];

            expect(() => orderService.createOrder(1, items))
                .toThrow("Insufficient product stock");

            expect(productService.getProduct(2)?.stock).toBe(5);
            expect(orderService.getOrder(1)).toBeUndefined();
        });

        it("does not partially decrease stock when another item is invalid", () => {
            const items: OrderItemInput[] = [
                { productId: 1, orderedQuantity: 2 },
                { productId: 2, orderedQuantity: 6 }
            ];

            expect(() => orderService.createOrder(1, items))
                .toThrow("Insufficient product stock");

            expect(productService.getProduct(1)?.stock).toBe(10);
            expect(productService.getProduct(2)?.stock).toBe(5);
            expect(orderService.getOrder(1)).toBeUndefined();
        });

        it("rejects an order with repeated products exceeding stock", () => {
            const items: OrderItemInput[] = [
                { productId: 1, orderedQuantity: 6 },
                { productId: 1, orderedQuantity: 6 }
            ];

            expect(() => orderService.createOrder(1, items))
                .toThrow("Insufficient product stock");

            expect(productService.getProduct(1)?.stock).toBe(10);
            expect(orderService.getOrder(1)).toBeUndefined();
        });

        it("correctly aggregates quantities of repeated products", () => {
            const items: OrderItemInput[] = [
                { productId: 1, orderedQuantity: 4 },
                { productId: 1, orderedQuantity: 3 }
            ];

            const result = orderService.createOrder(1, items);

            expect(result.products).toHaveLength(2);
            expect(result.products[0].orderedQuantity).toBe(4);
            expect(result.products[1].orderedQuantity).toBe(3);

            expect(productService.getProduct(1)?.stock).toBe(3);
        });

        it("rejects an empty order", () => {
            expect(() => orderService.createOrder(1, []))
                .toThrow("Order cannot be empty");

            expect(productService.getProduct(1)?.stock).toBe(10);
            expect(orderService.getOrder(1)).toBeUndefined();
        });

        it("rejects an order with an overflowing total quantity", () => {
            const items: OrderItemInput[] = [
                { productId: 1, orderedQuantity: Number.MAX_SAFE_INTEGER },
                { productId: 1, orderedQuantity: 1 }
            ];

            expect(() => orderService.createOrder(1, items))
                .toThrow("Invalid total product quantity");

            expect(productService.getProduct(1)?.stock).toBe(10);
            expect(orderService.getOrder(1)).toBeUndefined();
        });

        it("creates a valid order and updates stock", () => {
            const items: OrderItemInput[] = [
                { productId: 1, orderedQuantity: 2 },
                { productId: 2, orderedQuantity: 1 }
            ];

            const result = orderService.createOrder(1, items);

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

        it("assigns sequential IDs to orders", () => {
            const items: OrderItemInput[] = [
                { productId: 1, orderedQuantity: 1 }
            ];

            const firstOrder = orderService.createOrder(1, items);
            const secondOrder = orderService.createOrder(1, items);

            expect(firstOrder.id).toBe(1);
            expect(secondOrder.id).toBe(2);
        });

        it("preserves the original product price in an order", () => {
            const order = orderService.createOrder(1, [
                { productId: 1, orderedQuantity: 2 }
            ]);

            productService.updateProduct(1, { price: 300 });

            expect(order.products[0].originalPrice).toBe(150);
            expect(orderService.getOrder(order.id)?.products[0].originalPrice)
                .toBe(150);
        });

        it("returns a defensive copy of the created order", () => {
            const order = orderService.createOrder(1, [
                { productId: 1, orderedQuantity: 2 }
            ]);

            order.products[0].orderedQuantity = 999;

            expect(orderService.getOrder(1)?.products[0].orderedQuantity)
                .toBe(2);
        });
    });


    describe("getOrder()", () => {
        it("returns an existing order", () => {
            const order = orderService.createOrder(1, [
                { productId: 1, orderedQuantity: 2 }
            ]);

            expect(orderService.getOrder(order.id)).toEqual(order);
        });

        it("returns undefined for a non-existing order", () => {
            expect(orderService.getOrder(999)).toBeUndefined();
        });

        it.each([0, -1, 1.5, NaN, Infinity])(
            "returns undefined for an invalid ID: %s",
            (id) => {
                expect(orderService.getOrder(id)).toBeUndefined();
            }
        );

        it("returns a defensive copy of the order", () => {
            orderService.createOrder(1, [
                { productId: 1, orderedQuantity: 2 }
            ]);

            const order = orderService.getOrder(1)!;
            order.products[0].orderedQuantity = 999;

            expect(orderService.getOrder(1)?.products[0].orderedQuantity)
                .toBe(2);
        });
    });


    describe("findOrder()", () => {
        it("returns true when an order exists", () => {
            orderService.createOrder(1, [
                { productId: 1, orderedQuantity: 1 }
            ]);

            expect(orderService.findOrder(1)).toBe(true);
        });

        it("returns false when an order does not exist", () => {
            expect(orderService.findOrder(999)).toBe(false);
        });

        it.each([0, -1, 1.5, NaN, Infinity])(
            "returns undefined for an invalid ID: %s",
            (id) => {
                expect(orderService.findOrder(id)).toBeUndefined();
            }
        );
    });


    describe("getAllOrders()", () => {
        it("returns an empty array when no orders exist", () => {
            expect(orderService.getAllOrders()).toEqual([]);
        });

        it("returns all existing orders", () => {
            orderService.createOrder(1, [
                { productId: 1, orderedQuantity: 1 }
            ]);

            orderService.createOrder(1, [
                { productId: 2, orderedQuantity: 2 }
            ]);

            expect(orderService.getAllOrders()).toHaveLength(2);
        });

        it("returns defensive copies of orders and products", () => {
            orderService.createOrder(1, [
                { productId: 1, orderedQuantity: 2 }
            ]);

            const orders = orderService.getAllOrders();

            orders[0].status = "cancelled";
            orders[0].products[0].orderedQuantity = 999;

            const storedOrder = orderService.getOrder(1)!;

            expect(storedOrder.status).toBe("pending");
            expect(storedOrder.products[0].orderedQuantity).toBe(2);
        });
    });


    describe("updateOrderStatus()", () => {
        it("changes pending status to paid", () => {
            orderService.createOrder(1, [
                { productId: 1, orderedQuantity: 1 }
            ]);

            const result = orderService.updateOrderStatus(1, "paid");

            expect(result.status).toBe("paid");
            expect(orderService.getOrder(1)?.status).toBe("paid");
        });

        it("changes paid status to shipped", () => {
            orderService.createOrder(1, [
                { productId: 1, orderedQuantity: 1 }
            ]);

            orderService.updateOrderStatus(1, "paid");
            const result = orderService.updateOrderStatus(1, "shipped");

            expect(result.status).toBe("shipped");
        });

        it.each([
            ["pending", "shipped"],
            ["pending", "cancelled"],
            ["paid", "pending"],
            ["shipped", "paid"],
            ["cancelled", "paid"]
        ] as const)(
            "rejects transition from %s to %s",
            (initialStatus, nextStatus) => {
                orderService.createOrder(1, [
                    { productId: 1, orderedQuantity: 1 }
                ]);

                if (initialStatus === "paid") {
                    orderService.updateOrderStatus(1, "paid");
                }

                if (initialStatus === "shipped") {
                    orderService.updateOrderStatus(1, "paid");
                    orderService.updateOrderStatus(1, "shipped");
                }

                if (initialStatus === "cancelled") {
                    orderService.cancelOrder(1);
                }

                expect(() =>
                    orderService.updateOrderStatus(1, nextStatus)
                ).toThrow("Can't change status");

                expect(orderService.getOrder(1)?.status).toBe(initialStatus);
            }
        );

        it("rejects an unsafe order ID", () => {
            expect(() =>
                orderService.updateOrderStatus(Number.MAX_SAFE_INTEGER + 1, "paid")
            ).toThrow("OrderId is not a safe integer");
        });

        it("rejects an order ID less than or equal to zero", () => {
            expect(() =>
                orderService.updateOrderStatus(0, "paid")
            ).toThrow("OrderId should be greater than 0");
        });

        it("rejects a non-existing order", () => {
            expect(() =>
                orderService.updateOrderStatus(999, "paid")
            ).toThrow("Order doesn't exist");
        });

        it("rejects an invalid status", () => {
            orderService.createOrder(1, [
                { productId: 1, orderedQuantity: 1 }
            ]);

            expect(() =>
                orderService.updateOrderStatus(1, "invalid" as StatusOrder)
            ).toThrow("Can't change status");
        });

        it("returns a defensive copy after updating status", () => {
            orderService.createOrder(1, [
                { productId: 1, orderedQuantity: 1 }
            ]);

            const result = orderService.updateOrderStatus(1, "paid");
            result.products[0].orderedQuantity = 999;

            expect(orderService.getOrder(1)?.products[0].orderedQuantity)
                .toBe(1);
        });
    });


    describe("cancelOrder()", () => {
        it("cancels a pending order and restores stock", () => {
            orderService.createOrder(1, [
                { productId: 1, orderedQuantity: 3 }
            ]);

            const result = orderService.cancelOrder(1);

            expect(result.status).toBe("cancelled");
            expect(productService.getProduct(1)?.stock).toBe(10);
            expect(orderService.getOrder(1)?.status).toBe("cancelled");
        });

        it("cancels a paid order", () => {
            orderService.createOrder(1, [
                { productId: 1, orderedQuantity: 2 }
            ]);

            orderService.updateOrderStatus(1, "paid");

            const result = orderService.cancelOrder(1);

            expect(result.status).toBe("cancelled");
            expect(productService.getProduct(1)?.stock).toBe(10);
        });

        it("restores stock correctly for repeated products", () => {
            orderService.createOrder(1, [
                { productId: 1, orderedQuantity: 2 },
                { productId: 1, orderedQuantity: 3 }
            ]);

            expect(productService.getProduct(1)?.stock).toBe(5);

            orderService.cancelOrder(1);

            expect(productService.getProduct(1)?.stock).toBe(10);
        });

        it("rejects cancellation of a shipped order", () => {
            orderService.createOrder(1, [
                { productId: 1, orderedQuantity: 2 }
            ]);

            orderService.updateOrderStatus(1, "paid");
            orderService.updateOrderStatus(1, "shipped");

            expect(() => orderService.cancelOrder(1))
                .toThrow("Cannot cancel order in this status");

            expect(productService.getProduct(1)?.stock).toBe(8);
        });

        it("rejects cancellation of an already cancelled order", () => {
            orderService.createOrder(1, [
                { productId: 1, orderedQuantity: 2 }
            ]);

            orderService.cancelOrder(1);

            expect(() => orderService.cancelOrder(1))
                .toThrow("Cannot cancel order in this status");

            expect(productService.getProduct(1)?.stock).toBe(10);
        });

        it("rejects cancellation of a non-existing order", () => {
            expect(() => orderService.cancelOrder(999))
                .toThrow("Order doesn't exist");
        });

        it("rejects an unsafe order ID", () => {
            expect(() => orderService.cancelOrder(Number.MAX_SAFE_INTEGER + 1))
                .toThrow("OrderId is not a safe integer");
        });

        it("rejects an order ID less than or equal to zero", () => {
            expect(() => orderService.cancelOrder(0))
                .toThrow("OrderId should be greater than 0");
        });

        it("rejects cancellation when restoring stock exceeds the safe integer limit", () => {
            orderService.createOrder(1, [
                { productId: 1, orderedQuantity: 1 }
            ]);

            productService.updateProduct(1, {
                stock: Number.MAX_SAFE_INTEGER
            });

            expect(() => orderService.cancelOrder(1))
                .toThrow("Resulting stock exceeds safe integer limit");

            expect(orderService.getOrder(1)?.status).toBe("pending");
            expect(productService.getProduct(1)?.stock)
                .toBe(Number.MAX_SAFE_INTEGER);
        });

        it("returns a defensive copy of the cancelled order", () => {
            orderService.createOrder(1, [
                { productId: 1, orderedQuantity: 2 }
            ]);

            const result = orderService.cancelOrder(1);
            result.products[0].orderedQuantity = 999;

            expect(orderService.getOrder(1)?.products[0].orderedQuantity)
                .toBe(2);
        });
    });
});
