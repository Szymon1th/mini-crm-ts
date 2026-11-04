
import { describe, expect, it } from "vitest";
import {isCustomerUser,isAdminUser,isUser} from "../../src/guards/customer-guard";

describe("User Guard", () => {
    it("should accept a valid user", () => {
        const user = {
            id: 1,
            name: "Simon",
            email: "simon@gmail.com"
        };

        expect(isUser(user)).toBe(true);
    });

    it("should reject null instead of an object", () => {
        const user = null;

        expect(isUser(user)).toBe(false);
    });

    it("should reject an array instead of an object", () => {
        const user = [{
            id: 1,
            name: "Simon",
            email: "simon@gmail.com"
        }];

        expect(isUser(user)).toBe(false);
    });

    it("should reject a user without an email property", () => {
        const user = {
            id: 1,
            name: "Simon"
        };

        expect(isUser(user)).toBe(false);
    });

    it("should reject a user with an invalid ID type", () => {
        const user = {
            id: "2",
            name: "Simon",
            email: "simon@gmail.com"
        };

        expect(isUser(user)).toBe(false);
    });
});

describe("Customer User Guard", () => {
    it("should accept a valid customer", () => {
        const customer = {
            id: 1,
            name: "Simon",
            email: "simon@gmail.com",
            phone: "123456789",
            address: "Warsaw"
        };

        expect(isCustomerUser(customer)).toBe(true);
    });

    it("should reject a customer without a phone number", () => {
        const customer = {
            id: 1,
            name: "Simon",
            email: "simon@gmail.com",
            address: "Warsaw"
        };

        expect(isCustomerUser(customer)).toBe(false);
    });

    it("should reject a customer without an address", () => {
        const customer = {
            id: 1,
            name: "Simon",
            email: "simon@gmail.com",
            phone: "123456789"
        };

        expect(isCustomerUser(customer)).toBe(false);
    });

    it("should reject a customer with an invalid phone type", () => {
        const customer = {
            id: 1,
            name: "Simon",
            email: "simon@gmail.com",
            phone: 123456789,
            address: "Warsaw"
        };

        expect(isCustomerUser(customer)).toBe(false);
    });

    it("should reject a customer without valid base user properties", () => {
        const customer = {
            name: "Simon",
            email: "simon@gmail.com",
            phone: "123456789",
            address: "Warsaw"
        };

        expect(isCustomerUser(customer)).toBe(false);
    });
});

describe("Admin User Guard", () => {
    it("should accept a valid administrator", () => {
        const admin = {
            id: 1,
            name: "Simon",
            email: "simon@gmail.com",
            permissions: ["read", "write"]
        };

        expect(isAdminUser(admin)).toBe(true);
    });

    it("should reject an administrator without permissions", () => {
        const admin = {
            id: 1,
            name: "Simon",
            email: "simon@gmail.com"
        };

        expect(isAdminUser(admin)).toBe(false);
    });

    it("should reject permissions provided as a string instead of an array", () => {
        const admin = {
            id: 1,
            name: "Simon",
            email: "simon@gmail.com",
            permissions: "read"
        };

        expect(isAdminUser(admin)).toBe(false);
    });

    it("should reject permissions containing non-string values", () => {
        const admin = {
            id: 1,
            name: "Simon",
            email: "simon@gmail.com",
            permissions: ["read", 123]
        };

        expect(isAdminUser(admin)).toBe(false);
    });

    it("should accept an empty permissions array", () => {
        const admin = {
            id: 1,
            name: "Simon",
            email: "simon@gmail.com",
            permissions: []
        };

        expect(isAdminUser(admin)).toBe(true);
    });

    it("should reject an administrator without valid base user properties", () => {
        const admin = {
            name: "Simon",
            email: "simon@gmail.com",
            permissions: ["read", "write"]
        };

        expect(isAdminUser(admin)).toBe(false);
    });
});
