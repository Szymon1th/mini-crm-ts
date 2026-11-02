
import type { Order, OrderItem, OrderItemInput } from "../types/order";
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
        if (!Number.isInteger(id) || !Number.isFinite(id) || id <= 0) {
            return undefined;
        }

        return this.orderList.find(order => order.id === id);
    }

    public findOrder(id: number): boolean | undefined {
        if (!Number.isInteger(id) || !Number.isFinite(id) || id <= 0) {
            return undefined;
        }

        return this.orderList.some(order => order.id === id);
    }

    public createOrder(
        customerIdGet: number,
        order_item: OrderItemInput[]
    ): Order | boolean {

        if (this.myCustomerService.findCustomer(customerIdGet) !== true) {
            return false;
        }

        if (order_item.length === 0) {
            return false;
        }

        const productsToOrder: {
            input: OrderItemInput;
            product: Product;
        }[] = [];

        const quantityByProduct = new Map<number, number>();

        for (const item of order_item) {
            if (
                !Number.isInteger(item.productId) ||
                item.productId <= 0 ||
                !Number.isInteger(item.orderedQuantity) ||
                item.orderedQuantity <= 0
            ) {
                return false;
            }

            const product = this.myProductService.getProduct(item.productId);

  
            if (product === undefined) {
                return false;
            }

            productsToOrder.push({ input: item, product });

        
            const currentQuantity = quantityByProduct.get(item.productId) ?? 0;

            quantityByProduct.set(
                item.productId,
                currentQuantity + item.orderedQuantity
            );
        }

      
        for (const [productId, totalQuantity] of quantityByProduct) {
            const product = this.myProductService.getProduct(productId);

            if (product === undefined || product.stock < totalQuantity) {
                return false;
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
            const product = this.myProductService.getProduct(productId);

            if (product === undefined) {
                return false;
            }

            product.stock -= totalQuantity;
        }

        this.orderList.push(orderProduct);
        this.orderNumber += 1;

        return orderProduct;
    }
}

export = OrderService;
