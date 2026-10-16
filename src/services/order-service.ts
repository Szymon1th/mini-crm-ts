import type {Order,OrderItem,OrderItemInput} from "../types/order";
import ProductService = require("./product-service");
import CustomerService = require("./customer-service");
class OrderService{
    private orderList : Order[] = []
    private myProductService : ProductService
    private myCustomerService : CustomerService
    private orderNumber : number = 1

    constructor(productService : ProductService,customerService:CustomerService){
        this.myProductService = productService
        this.myCustomerService = customerService
    }

    public getOrder(id:number) : Order | undefined{
        if (!Number.isInteger(id) || !Number.isFinite(id) || id <= 0) {
            return undefined;
        }
        return this.orderList.find(order => order.id === id);
    }

    public findOrder(id:number):boolean | undefined{
        if (!Number.isInteger(id) || !Number.isFinite(id) || id <= 0) {
            return undefined;
        }
        return this.orderList.some(order=>order.id === id)
    }
    
    //do poprawy 
    // public createOrder(customerIdGet : number,order_item : OrderItemInput[]): Order | boolean{

    //     let actualOrder : OrderItem[] = []
    //     let product 
    //     let actualProduct : OrderItemInput

    //     //spraedzanie czy klient istnieje
    //     if(this.myCustomerService.findCustomer(customerIdGet) === false){
    //         return false
    //     }
    //     //sprawdzenie czy tablica posiada elementy
    //     if(order_item.length === 0) return false

    //     // jesli posiada to sprawdza czy myProductService posiada id == order_item[index]?.productId (czy istnieje) potem czy ilosc jest l calkowita dodatnia            
    //         for (let index = 0; index < order_item.length; index++) {
    //             if(this.myProductService.findProduct(order_item[index]?.productId) === false || !Number.isInteger(order_item[index]?.orderedQuantity) || order_item[index]?.orderedQuantity <= 0){
    //                 return false
    //             }   

    //         //sprawdzenie stanu magazynowego

    //         product = this.myProductService.getProduct(order_item[index]?.productId)
    //         actualProduct = order_item[index]
    //         if(product === undefined) return false
    

    //         const baseItem = order_item[index]

    //         if(baseItem){
    //             let tempSum = baseItem.orderedQuantity

    //             for(let i = index + 1;i<order_item.length;i++){
    //                 if(order_item[i]?.productId === baseItem.productId){
    //                     tempSum+=order_item[i]?.orderedQuantity || 0
    //                 }
    //             }

    //             if(product.stock < tempSum) return false

    //             if (tempSum>2) {
    //                 product.stock-=tempSum   
    //             }
    //         }
            
    //         }

    //          // utorzenie zamowienia

    //         const newProduct : OrderItem = {
    //             productId :actualProduct.productId,
    //             originalPrice: product?.price,
    //             orderedQuantity: actualProduct.orderedQuantity,
    //         }

    //         actualOrder.push(newProduct);

    

    //     const orderProduct : Order ={
    //             id:this.orderNumber,
    //             customerId:customerIdGet,
    //             products: actualOrder,
    //             status:"pending"

    //         }

    //     this.orderList.push(orderProduct)
    //     this.orderNumber +=1
    //     product?.stock-=newProduct.orderedQuantity
    //     return orderProduct

  
    // }
}

export = OrderService