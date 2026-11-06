
import ProductService = require("./services/product-service");
import CustomerService = require("./services/customer-service");
import OrderService = require("./services/order-service");

import type { Product } from "./types/product";
import type { CustomerUser } from "./types/user";
import type { OrderItemInput } from "./types/order";

const productService = new ProductService();
const customerService = new CustomerService();

const orderService = new OrderService(
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

console.log("\n========== MINI CRM ==========\n");

console.log("PRODUCT MANAGEMENT");

productService.addProduct(product1);
productService.addProduct(product2);

console.table(productService.getProduct(1));
console.table(productService.getProduct(2));


console.log("\nCUSTOMER MANAGEMENT");

customerService.addCustomer(customer1);

console.table([customerService.getCustomer(1)]);

console.log("\nORDER CREATION");

const items: OrderItemInput[] = [
    { productId: 1, orderedQuantity: 2 },
    { productId: 2, orderedQuantity: 1 }
];

const createdOrder = orderService.createOrder(1, items);

console.log("Created order:");
console.dir(createdOrder, { depth: null });

console.log("\nSTOCK AFTER ORDER CREATION");

console.table([
    productService.getProduct(1),
    productService.getProduct(2)
]);

console.log("\nORDER STATUS UPDATE");

const paidOrder = orderService.updateOrderStatus(
    createdOrder.id,
    "paid"
);

console.dir(paidOrder, { depth: null });

console.log("\nORDER CANCELLATION");

const cancelledOrder = orderService.cancelOrder(
    createdOrder.id
);

console.dir(cancelledOrder, { depth: null });

console.log("\nSTOCK AFTER ORDER CANCELLATION");

console.table([
    productService.getProduct(1),
    productService.getProduct(2)
]);

console.log("\n========== END OF DEMO ==========\n");
