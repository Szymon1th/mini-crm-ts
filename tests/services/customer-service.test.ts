
import { beforeEach, describe, expect, it } from "vitest";
import CustomerService from "../../src/services/customer-service";

describe("CustomerService", () => {
    let customerService: CustomerService;

    const customer = {
        id: 1,
        name: "Simon",
        email: "simon@gmail.com",
        phone: "123456789",
        address: "Warsaw",
    };

    beforeEach(() => {
        customerService = new CustomerService();
    });

    describe("addCustomer()", () => {
        it("should add a valid customer and return true", () => {
            expect(customerService.addCustomer(customer)).toBe(true);
        });

        it("should reject an object with an invalid structure", () => {
            expect(customerService.addCustomer({
                id: 2,
                name: "John",
                email: "john@gmail.com",
                phone: 123456789,
                address: "London",
            })).toBe(false);
        });

        it("should reject a customer with a duplicate ID", () => {
            customerService.addCustomer(customer);

            expect(customerService.addCustomer({
                ...customer,
                name: "John",
                email: "john@gmail.com",
            })).toBe(false);
        });

        it("should reject a customer with an empty name", () => {
            expect(customerService.addCustomer({
                ...customer,
                name: "   ",
            })).toBe(false);
        });

        it("should reject a customer with an empty email", () => {
            expect(customerService.addCustomer({
                ...customer,
                email: "   ",
            })).toBe(false);
        });

        it("should reject a customer with an empty phone number", () => {
            expect(customerService.addCustomer({
                ...customer,
                phone: "   ",
            })).toBe(false);
        });

        it("should reject a customer with an invalid ID", () => {
            expect(customerService.addCustomer({
                ...customer,
                id: -1,
            })).toBe(false);
        });
    });

    describe("getCustomer()", () => {
        it("should return the customer when the ID exists", () => {
            customerService.addCustomer(customer);

            expect(customerService.getCustomer(1)).toEqual(customer);
        });

        it("should return undefined when the customer does not exist", () => {
            expect(customerService.getCustomer(999)).toBeUndefined();
        });
    });

    describe("findCustomer()", () => {
        it("should return true when the customer exists", () => {
            customerService.addCustomer(customer);

            expect(customerService.findCustomer(1)).toBe(true);
        });

        it("should return false when the customer does not exist", () => {
            expect(customerService.findCustomer(999)).toBe(false);
        });
    });

    describe("updateCustomer()", () => {
        beforeEach(() => {
            customerService.addCustomer(customer);
        });

        it("should update the customer's name", () => {
            const result = customerService.updateCustomer(1, "John");

            expect(result).toMatchObject({ name: "John" });
        });

        it("should update the customer's email", () => {
            const result = customerService.updateCustomer(
                1,
                undefined,
                "john@gmail.com",
            );

            expect(result).toMatchObject({ email: "john@gmail.com" });
        });

        it("should update the customer's phone number", () => {
            const result = customerService.updateCustomer(
                1,
                undefined,
                undefined,
                "987654321",
            );

            expect(result).toMatchObject({ phone: "987654321" });
        });

        it("should update the customer's address", () => {
            const result = customerService.updateCustomer(
                1,
                undefined,
                undefined,
                undefined,
                "Berlin",
            );

            expect(result).toMatchObject({ address: "Berlin" });
        });

        it("should update all customer fields at once", () => {
            const result = customerService.updateCustomer(
                1,
                "John",
                "john@gmail.com",
                "987654321",
                "Berlin",
            );

            expect(result).toEqual({
                id: 1,
                name: "John",
                email: "john@gmail.com",
                phone: "987654321",
                address: "Berlin",
            });
        });

        it("should reject an update containing an empty value", () => {
            expect(customerService.updateCustomer(1, "   ")).toBe(false);
        });

        it("should return undefined when the customer does not exist", () => {
            expect(customerService.updateCustomer(999, "John")).toBeUndefined();
        });
    });

    describe("additional behavior", () => {
        it("should not modify the customer list when adding an invalid customer", () => {
            customerService.addCustomer(customer);

            customerService.addCustomer({
                ...customer,
                id: 2,
                name: "   ",
            });

            expect(customerService.getCustomer(2)).toBeUndefined();
            expect(customerService.findCustomer(1)).toBe(true);
        });

        it("should preserve unchanged fields when updating only one field", () => {
            customerService.addCustomer(customer);

            const result = customerService.updateCustomer(1, "John");

            expect(result).toEqual({
                id: 1,
                name: "John",
                email: "simon@gmail.com",
                phone: "123456789",
                address: "Warsaw",
            });
        });
    });
});
