import type {CustomerUser} from "../types/user"
import { isCustomerUser } from "../guards/customer-guard"
import { Repository } from "../repositories/repository"

class CustomerService{
    private customerRepository = new Repository<CustomerUser>()

  public addCustomer(customer: unknown): void {
    if (!isCustomerUser(customer)) {
        throw new Error("Invalid customer type");
    }

    if (customer.name.trim().length === 0) {
        throw new Error("Invalid customer name");
    }

    if (customer.email.trim().length === 0) {
        throw new Error("Invalid customer email");
    }

    if (customer.phone.trim().length === 0) {
        throw new Error("Invalid customer phone");
    }

    if (customer.address.trim().length === 0) {
        throw new Error("Invalid customer address");
    }

    if (!Number.isInteger(customer.id) || !Number.isFinite(customer.id) || customer.id <= 0) {
        throw new Error("Invalid customer ID");
    }

    this.customerRepository.addItem(customer);

}
    public getCustomer(id:number) : CustomerUser | undefined{
        return this.customerRepository.getById(id)
    }

    public updateCustomer(id:number,changes:Partial<Omit<CustomerUser,"id">>):CustomerUser | undefined {
        if(!this.getCustomer(id)) return undefined

        if(changes.name!==undefined){
            if (changes.name.trim().length === 0) {
                throw new Error("Invalid customer name");
            }
        }
        if(changes.email!== undefined){
             if (changes.email.trim().length === 0) {
                throw new Error("Invalid customer email");
            }
        }
        if(changes.phone !== undefined){
            if (changes.phone.trim().length === 0) {
                throw new Error("Invalid customer phone");
            }
        }
        if(changes.address!== undefined){
            if (changes.address.trim().length === 0) {
                throw new Error("Invalid customer address");
            }
        }

        if(Object.keys(changes).length ===0) throw new Error("No fields provided for update");

        return this.customerRepository.update(id,changes)

    }

}

export = CustomerService;