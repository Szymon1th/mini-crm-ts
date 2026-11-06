
import type { Order, OrderItem, OrderItemInput, StatusOrder } from "../types/order";
import ProductService = require("./product-service");
import CustomerService = require("./customer-service");
import type { Product } from "../types/product";

class OrderService {
    private orderList: Order[] = [];
    private myProductService: ProductService;
    private myCustomerService: CustomerService;
    private orderNumber: number = 1;

    constructor(
        productService: ProductService,
        customerService: CustomerService
    ) {
        this.myProductService = productService;
        this.myCustomerService = customerService;
    }

    public getOrder(id: number): Order | undefined {
        if (!Number.isSafeInteger(id) || id <= 0) {
            return undefined;
        }

        const copyOfOrder = this.orderList.find(order => order.id === id);

        if (!copyOfOrder) return undefined;

        return {
            ...copyOfOrder,
            products: copyOfOrder.products.map(order => ({ ...order }))
        };
    }

    public findOrder(id: number): boolean | undefined {
        if (!Number.isSafeInteger(id) || id <= 0) {
            return undefined;
        }

        return this.orderList.some(order => order.id === id);
    }

    public getAllOrders(): Order[] {
        return this.orderList.map(order => ({
            ...order,
            products: order.products.map(orderProducts => ({ ...orderProducts }))
        }));
    }

    public createOrder(customerIdGet: number, order_item: OrderItemInput[]): Order {
        const customer = this.myCustomerService.getCustomer(customerIdGet);

        if (!customer) throw new Error("Customer not found");

        if (!Array.isArray(order_item) || order_item.length === 0) {
            throw new Error("Order cannot be empty");
        }

        const productsToOrder: { input: OrderItemInput; product: Product }[] = [];

        const quantityByProduct = new Map<number, number>();

        for (const item of order_item) {
            if (
                !Number.isSafeInteger(item.productId) ||
                item.productId <= 0 ||
                !Number.isSafeInteger(item.orderedQuantity) ||
                item.orderedQuantity <= 0
            ) {
                throw new Error("Invalid order item");
            }

            const product = this.myProductService.getProduct(item.productId);

            if (!product) throw new Error("Product doesn't exist");

            productsToOrder.push({ input: item, product });

            const currentQuantity = quantityByProduct.get(item.productId) ?? 0;

            const newQuantity = currentQuantity + item.orderedQuantity;

            if (!Number.isSafeInteger(newQuantity)) {
                throw new Error("Invalid total product quantity");
            }

            quantityByProduct.set(item.productId, newQuantity);
        }

        for (const [productId, totalQuantity] of quantityByProduct) {
            const product = this.myProductService.getProduct(productId);

            if (!product) {
                throw new Error("Product doesn't exist");
            }

            if (product.stock < totalQuantity) {
                throw new Error("Insufficient product stock");
            }
        }

        const actualOrder: OrderItem[] = productsToOrder.map(({ input, product }) => ({
            productId: product.id,
            originalPrice: product.price,
            orderedQuantity: input.orderedQuantity
        }));

        const orderProduct: Order = {
            id: this.orderNumber,
            customerId: customerIdGet,
            products: actualOrder,
            status: "pending"
        };

        for (const [productId, totalQuantity] of quantityByProduct) {
            const updatedProduct = this.myProductService.decreaseStock(
                productId,
                totalQuantity
            );

            if (!updatedProduct) {
                throw new Error("Product not found");
            }
        }

        this.orderList.push(orderProduct);
        this.orderNumber += 1;

        return {
            ...orderProduct,
            products: orderProduct.products.map(product => ({ ...product }))
        };
    }

    public updateOrderStatus(orderId: number, status: StatusOrder): Order {
        if (!Number.isSafeInteger(orderId)) {
            throw new Error("OrderId is not a safe integer");
        }

        if (orderId <= 0) {
            throw new Error("OrderId should be greater than 0");
        }

        const actualOrder = this.orderList.find(order => order.id === orderId);

        if (!actualOrder) {
            throw new Error("Order doesn't exist");
        }

        const allowedTransitions: Record<StatusOrder, StatusOrder[]> = {
            pending: ["paid"],
            paid: ["shipped"],
            shipped: [],
            cancelled: []
        };

        const isStatusAvailable = allowedTransitions[actualOrder.status].includes(status);

        if (!isStatusAvailable) {
            throw new Error("Can't change status");
        }

        actualOrder.status = status;

        return {
            ...actualOrder,
            products: actualOrder.products.map(product => ({ ...product }))
        };
    }

    public cancelOrder(orderId: number): Order {
        if (!Number.isSafeInteger(orderId)) {
            throw new Error("OrderId is not a safe integer");
        }

        if (orderId <= 0) {
            throw new Error("OrderId should be greater than 0");
        }

        const actualOrder = this.orderList.find(order => order.id === orderId);

        if (!actualOrder) {
            throw new Error("Order doesn't exist");
        }

        const cancellableStatuses: StatusOrder[] = ["pending", "paid"];

        const isStatusAvailable = cancellableStatuses.includes(actualOrder.status);

        if (!isStatusAvailable) {
            throw new Error("Cannot cancel order in this status");
        }

        const quantityByProduct = new Map<number, number>();

        for (const product of actualOrder.products) {
            const currentQuantity = quantityByProduct.get(product.productId) ?? 0;
            const newQuantity = currentQuantity + product.orderedQuantity;

            if (!Number.isSafeInteger(newQuantity)) {
                throw new Error("Invalid total product quantity");
            }

            quantityByProduct.set(product.productId, newQuantity);
        }

        for (const [productId, totalQuantity] of quantityByProduct) {
            const product = this.myProductService.getProduct(productId);

            if (!product) {
                throw new Error("Product doesn't exist");
            }

            if (!Number.isSafeInteger(product.stock + totalQuantity)) {
                throw new Error("Resulting stock exceeds safe integer limit");
            }
        }

        for (const [productId, totalQuantity] of quantityByProduct) {
            const updatedProduct = this.myProductService.increaseStock(
                productId,
                totalQuantity
            );

            if (!updatedProduct) {
                throw new Error("Could not restore product stock");
            }
        }

        actualOrder.status = "cancelled";

        return {
            ...actualOrder,
            products: actualOrder.products.map(product => ({ ...product }))
        };
    }
}

export = OrderService;
