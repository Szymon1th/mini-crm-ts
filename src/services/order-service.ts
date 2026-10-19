
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

        // ZMIANA 1: najpierw sprawdzamy klienta i niepustą listę produktów.
        if (this.myCustomerService.findCustomer(customerIdGet) !== true) {
            return false;
        }

        if (order_item.length === 0) {
            return false;
        }

        // ZMIANA 2: zbieramy dane o produktach i łączną ilość każdego produktu.
        // Na tym etapie NIE zmieniamy stanu magazynowego.
        const productsToOrder: {
            input: OrderItemInput;
            product: Product;
        }[] = [];

        const quantityByProduct = new Map<number, number>();

        for (const item of order_item) {
            // ZMIANA 3: jawna walidacja danych wejściowych.
            if (
                !Number.isInteger(item.productId) ||
                item.productId <= 0 ||
                !Number.isInteger(item.orderedQuantity) ||
                item.orderedQuantity <= 0
            ) {
                return false;
            }

            const product = this.myProductService.getProduct(item.productId);

            // Nie używamy findProduct() i getProduct() do dwóch osobnych
            // odczytów — getProduct() wystarczy, aby sprawdzić istnienie
            // produktu i uzyskać jego dane.
            if (product === undefined) {
                return false;
            }

            productsToOrder.push({ input: item, product });

            // ZMIANA 4: sumujemy ilości, gdy ten sam produkt występuje
            // w zamówieniu więcej niż raz.
            const currentQuantity = quantityByProduct.get(item.productId) ?? 0;

            quantityByProduct.set(
                item.productId,
                currentQuantity + item.orderedQuantity
            );
        }

        // ZMIANA 5: sprawdzamy dostępność wszystkich produktów
        // przed jakąkolwiek zmianą magazynu.
        for (const [productId, totalQuantity] of quantityByProduct) {
            const product = this.myProductService.getProduct(productId);

            if (product === undefined || product.stock < totalQuantity) {
                return false;
            }
        }

        // ZMIANA 6: tworzymy pozycję zamówienia dla KAŻDEGO elementu wejściowego.
        // Cena jest pobierana z produktu i zapisywana w chwili składania zamówienia.
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

        // ZMIANA 7: magazyn aktualizujemy dopiero po pomyślnej walidacji
        // wszystkich danych. Nie ma już warunku tempSum > 2.
        for (const [productId, totalQuantity] of quantityByProduct) {
            const product = this.myProductService.getProduct(productId);

            // Produkt był już zweryfikowany wyżej; zabezpieczenie typów.
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
