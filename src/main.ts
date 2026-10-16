
import ProductService = require("./services/product-service");
import CustomerService = require("./services/customer-service");
import OrderService = require("./services/order-service");

import type { Product } from "./types/product";
import type { CustomerUser } from "./types/user";
import type { OrderItemInput } from "./types/order";

// 1. Tworzymy trzy instancje serwisów
const productService = new ProductService();
const customerService = new CustomerService();

// OrderService otrzymuje referencje do tych samych instancji
const orderService = new OrderService(
    productService,
    customerService
);

// 2. Dodajemy produkty do magazynu
const product1: Product = {
    id: 1,
    name: "Klawiatura",
    price: 150,
    stock: 10
};

const product2: Product = {
    id: 2,
    name: "Mysz",
    price: 80,
    stock: 5
};

console.log("Dodawanie produktów:");
console.log(productService.addProduct(product1));
console.log(productService.addProduct(product2));

// 3. Dodajemy klienta
const customer1: CustomerUser = {
    id: 1,
    name: "Jan Kowalski",
    email: "jan@example.com",
    phone: "500600700",
    address: "Warszawa"
};

console.log("\nDodawanie klienta:");
console.log(customerService.addCustomer(customer1));

// 4. Sprawdzamy, czy serwisy przechowują dane
console.log("\nKlient:");
console.log(customerService.getCustomer(1));

console.log("\nProdukt 1:");
console.log(productService.getProduct(1));


// 5. Tworzymy dane wejściowe zamówienia
const items: OrderItemInput[] = [
    { productId: 1, orderedQuantity: 2 },
    { productId: 2, orderedQuantity: 1 }
];

// 6. Przekazujemy dane do OrderService
// console.log("\nTworzenie zamówienia:");
// const result = orderService.createOrder(1, items);
// console.log(result);

// 7. Sprawdzamy zapisane zamówienie
// console.log("\nZamówienie o ID 1:");
// console.log(orderService.getOrder(1));

// // 8. Sprawdzamy stan magazynowy po zamówieniu
// console.log("\nStan magazynowy po zamówieniu:");
// console.log("Klawiatura:", productService.getProduct(1));
// console.log("Mysz:", productService.getProduct(2));
