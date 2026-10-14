type StatusOrder = "pending" | "paid" | "shipped" | "cancelled"

export interface Order{
    id:number,
    customerId:number,
    products: OrderItem[]
    status: StatusOrder
}


export interface OrderItem {
    productId: number;
    orderedQuantity: number;
}

