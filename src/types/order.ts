type StatusOrder = "pending" | "paid" | "shipped" | "cancelled"

export interface Order{
    id:number,
    customerId:number,
    products: OrderItem[]
    status: StatusOrder
}


export interface OrderItem {
    productId: number;
    originalPrice:number
    orderedQuantity: number;
}


export interface OrderItemInput {
    productId : number,
    orderedQuantity: number
}

