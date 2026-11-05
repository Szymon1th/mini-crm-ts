import type {CustomerUser} from "../types/user"
import { isCustomerUser } from "../guards/customer-guard"

class CustomerService{
    private customerList : CustomerUser[] = []

    public addCustomer(customer : unknown) : boolean{
        if(!isCustomerUser(customer)) return false
        const isTaken = this.customerList.some(c=>c.id===customer.id)

        if(isTaken) return false
        if(customer.name!== undefined && customer.name.trim().length === 0) return false
        if(customer.email!== undefined && customer.email.trim().length === 0) return false
        if(customer.phone!== undefined && customer.phone.trim().length === 0) return false
        if(customer.address!== undefined && customer.address.trim().length === 0) return false

        if(customer.id !== undefined && Number.isInteger(customer.id) && Number.isFinite(customer.id) && customer.id > 0) {
            this.customerList.push({...customer});
            return true
        }       
        return false
    }
    public getCustomer(id:number) : CustomerUser | undefined{
        return this.customerList.find(customer => customer.id === id)
    }

    public findCustomer(id:number):boolean{
        return this.customerList.some(customer => customer.id === id)
    }
    public updateCustomer(
        idOrigin:number,
        newName?:string,
        newEmail?:string,
        newPhone?:string,
        newAddress?:string
    ):CustomerUser | undefined | boolean{
        if(newName!== undefined && newName.trim().length === 0) return false 
        if(newEmail!== undefined && newEmail.trim().length === 0) return false 
        if(newPhone!== undefined && newPhone.trim().length === 0) return false 
        if(newAddress!== undefined && newAddress.trim().length === 0) return false 

        const foundCustomer = this.customerList.find(customer=> customer.id === idOrigin)

        if(!foundCustomer) return undefined

        if(newName!== undefined && newName.trim().length > 0) foundCustomer.name = newName
        if(newEmail!== undefined && newEmail.trim().length > 0) foundCustomer.email = newEmail
        if(newPhone!== undefined && newPhone.trim().length > 0) foundCustomer.phone = newPhone
        if(newAddress!== undefined && newAddress.trim().length > 0) foundCustomer.address = newAddress

        return {...foundCustomer};

    }

}

export = CustomerService;