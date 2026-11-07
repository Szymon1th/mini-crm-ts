
import { beforeEach, describe, expect, it } from "vitest";
import CustomerService from "../../src/services/customer-service";
import type { CustomerUser } from "../../src/types/user";

describe("CustomerService", () => {
    let customerService: CustomerService;

    const customer: CustomerUser = {
        id: 1,
        name: "Simon",
        email: "simon@gmail.com",
        phone: "123456789",
        address: "Warsaw"
    };

    beforeEach(() => {
        customerService = new CustomerService();
        customerService.addCustomer(customer);
    });

    describe("addCustomer()", () => {
        it("adds a valid customer", () => {
            const newCustomer: CustomerUser = {
                ...customer,
                id: 2,
                name: "John",
                email: "john@gmail.com"
            };

            expect(() => customerService.addCustomer(newCustomer))
                .not.toThrow();

            expect(customerService.getCustomer(2)).toEqual(newCustomer);
        });

        it("rejects a customer with an invalid structure", () => {
            const invalidCustomer: unknown = {
                id: 2,
                name: "John",
                email: "john@gmail.com",
                phone: 123456789,
                address: "London"
            };

            expect(() => customerService.addCustomer(invalidCustomer))
                .toThrow("Invalid customer type");
        });

        it("rejects null", () => {
            expect(() => customerService.addCustomer(null))
                .toThrow("Invalid customer type");
        });

        it("rejects an array instead of an object", () => {
            expect(() => customerService.addCustomer([customer]))
                .toThrow("Invalid customer type");
        });

        it("rejects a customer with an empty name", () => {
            expect(() => customerService.addCustomer({
                ...customer,
                id: 2,
                name: "   "
            })).toThrow("Invalid customer name");
        });

        it("rejects a customer with an empty email", () => {
            expect(() => customerService.addCustomer({
                ...customer,
                id: 2,
                email: "   "
            })).toThrow("Invalid customer email");
        });

        it("rejects a customer with an empty phone number", () => {
            expect(() => customerService.addCustomer({
                ...customer,
                id: 2,
                phone: "   "
            })).toThrow("Invalid customer phone");
        });

        it("rejects a customer with an empty address", () => {
            expect(() => customerService.addCustomer({
                ...customer,
                id: 2,
                address: "   "
            })).toThrow("Invalid customer address");
        });

        it("rejects a customer with an invalid ID", () => {
            expect(() => customerService.addCustomer({
                ...customer,
                id: -1
            })).toThrow("Invalid customer ID");
        });

        it("rejects a customer with a non-integer ID", () => {
            expect(() => customerService.addCustomer({
                ...customer,
                id: 1.5
            })).toThrow("Invalid customer ID");
        });

        it("rejects a customer with a duplicate ID", () => {
            expect(() => customerService.addCustomer(customer)).toThrow();
        });

        it("does not add a customer after failed validation", () => {
            expect(() => customerService.addCustomer({
                ...customer,
                id: 2,
                name: "   "
            })).toThrow("Invalid customer name");

            expect(customerService.getCustomer(2)).toBeUndefined();
        });
    });

    describe("getCustomer()", () => {
        it("returns a customer if the ID exists", () => {
            expect(customerService.getCustomer(1)).toEqual(customer);
        });

        it("returns undefined if the customer does not exist", () => {
            expect(customerService.getCustomer(999)).toBeUndefined();
        });

        it("rejects a non-integer ID", () => {
            expect(() => customerService.getCustomer(1.5))
                .toThrow("Id should be ineteger");
        });

        it("rejects an ID equal to zero", () => {
            expect(() => customerService.getCustomer(0))
                .toThrow("Id should be grater than 0");
        });

        it("rejects a negative ID", () => {
            expect(() => customerService.getCustomer(-1))
                .toThrow("Id should be grater than 0");
        });

        it("prevents modifying the customer by changing the returned copy", () => {
            const result = customerService.getCustomer(1);

            if (!result) throw new Error("Customer not found");

            result.name = "Changed name";

            expect(customerService.getCustomer(1)?.name).toBe("Simon");
        });
    });

    describe("updateCustomer()", () => {
        it("updates the customer's name", () => {
            const result = customerService.updateCustomer(1, {
                name: "John"
            });

            expect(result?.name).toBe("John");
        });

        it("updates the customer's email", () => {
            const result = customerService.updateCustomer(1, {
                email: "john@gmail.com"
            });

            expect(result?.email).toBe("john@gmail.com");
        });

        it("updates the customer's phone number", () => {
            const result = customerService.updateCustomer(1, {
                phone: "987654321"
            });

            expect(result?.phone).toBe("987654321");
        });

        it("updates the customer's address", () => {
            const result = customerService.updateCustomer(1, {
                address: "Berlin"
            });

            expect(result?.address).toBe("Berlin");
        });

        it("updates all fields simultaneously", () => {
            const result = customerService.updateCustomer(1, {
                name: "John",
                email: "john@gmail.com",
                phone: "987654321",
                address: "Berlin"
            });

            expect(result).toEqual({
                id: 1,
                name: "John",
                email: "john@gmail.com",
                phone: "987654321",
                address: "Berlin"
            });
        });

        it("preserves unchanged fields", () => {
            const result = customerService.updateCustomer(1, {
                name: "John"
            });

            expect(result).toEqual({
                id: 1,
                name: "John",
                email: "simon@gmail.com",
                phone: "123456789",
                address: "Warsaw"
            });
        });

        it("rejects an empty name", () => {
            expect(() => customerService.updateCustomer(1, {
                name: "   "
            })).toThrow("Invalid customer name");
        });

        it("rejects an empty email", () => {
            expect(() => customerService.updateCustomer(1, {
                email: "   "
            })).toThrow("Invalid customer email");
        });

        it("rejects an empty phone number", () => {
            expect(() => customerService.updateCustomer(1, {
                phone: "   "
            })).toThrow("Invalid customer phone");
        });

        it("rejects an empty address", () => {
            expect(() => customerService.updateCustomer(1, {
                address: "   "
            })).toThrow("Invalid customer address");
        });

        it("rejects an update with no fields provided", () => {
            expect(() => customerService.updateCustomer(1, {}))
                .toThrow("No fields provided for update");
        });

        it("returns undefined if the customer does not exist", () => {
            expect(customerService.updateCustomer(999, {
                name: "John"
            })).toBeUndefined();
        });

        it("does not modify customer data after a failed update", () => {
            expect(() => customerService.updateCustomer(1, {
                name: "   "
            })).toThrow("Invalid customer name");

            expect(customerService.getCustomer(1)).toEqual(customer);
        });
    });
});
