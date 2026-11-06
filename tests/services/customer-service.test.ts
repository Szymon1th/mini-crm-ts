
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
        it("dodaje poprawnego klienta", () => {
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

        it("odrzuca klienta z niepoprawną strukturą", () => {
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

        // NOWY TEST
        it("odrzuca null", () => {
            expect(() => customerService.addCustomer(null))
                .toThrow("Invalid customer type");
        });

        // NOWY TEST
        it("odrzuca tablicę zamiast obiektu", () => {
            expect(() => customerService.addCustomer([customer]))
                .toThrow("Invalid customer type");
        });

        it("odrzuca klienta z pustym imieniem", () => {
            expect(() => customerService.addCustomer({
                ...customer,
                id: 2,
                name: "   "
            })).toThrow("Invalid customer name");
        });

        it("odrzuca klienta z pustym emailem", () => {
            expect(() => customerService.addCustomer({
                ...customer,
                id: 2,
                email: "   "
            })).toThrow("Invalid customer email");
        });

        it("odrzuca klienta z pustym numerem telefonu", () => {
            expect(() => customerService.addCustomer({
                ...customer,
                id: 2,
                phone: "   "
            })).toThrow("Invalid customer phone");
        });

        it("odrzuca klienta z pustym adresem", () => {
            expect(() => customerService.addCustomer({
                ...customer,
                id: 2,
                address: "   "
            })).toThrow("Invalid customer address");
        });

        it("odrzuca klienta z niepoprawnym ID", () => {
            expect(() => customerService.addCustomer({
                ...customer,
                id: -1
            })).toThrow("Invalid customer ID");
        });

        // NOWY TEST
        it("odrzuca klienta z niecałkowitym ID", () => {
            expect(() => customerService.addCustomer({
                ...customer,
                id: 1.5
            })).toThrow("Invalid customer ID");
        });

        it("odrzuca klienta z duplikatem ID", () => {
            expect(() => customerService.addCustomer(customer)).toThrow();
        });

        // NOWY TEST: błędne dane nie powinny dodawać klienta.
        it("nie dodaje klienta po nieudanej walidacji", () => {
            expect(() => customerService.addCustomer({
                ...customer,
                id: 2,
                name: "   "
            })).toThrow("Invalid customer name");

            expect(customerService.getCustomer(2)).toBeUndefined();
        });
    });

    describe("getCustomer()", () => {
        it("zwraca klienta, jeśli ID istnieje", () => {
            expect(customerService.getCustomer(1)).toEqual(customer);
        });

        it("zwraca undefined, jeśli klient nie istnieje", () => {
            expect(customerService.getCustomer(999)).toBeUndefined();
        });

        it("odrzuca niecałkowite ID", () => {
            expect(() => customerService.getCustomer(1.5))
                .toThrow("Id should be ineteger");
        });

        it("odrzuca ID równe zero", () => {
            expect(() => customerService.getCustomer(0))
                .toThrow("Id should be grater than 0");
        });

        it("odrzuca ujemne ID", () => {
            expect(() => customerService.getCustomer(-1))
                .toThrow("Id should be grater than 0");
        });

        // NOWY TEST
        it("nie pozwala zmienić klienta przez modyfikację zwróconej kopii", () => {
            const result = customerService.getCustomer(1);

            if (!result) throw new Error("Customer not found");

            result.name = "Changed name";

            expect(customerService.getCustomer(1)?.name).toBe("Simon");
        });
    });

    describe("updateCustomer()", () => {
        it("aktualizuje imię klienta", () => {
            const result = customerService.updateCustomer(1, {
                name: "John"
            });

            expect(result?.name).toBe("John");
        });

        it("aktualizuje email klienta", () => {
            const result = customerService.updateCustomer(1, {
                email: "john@gmail.com"
            });

            expect(result?.email).toBe("john@gmail.com");
        });

        it("aktualizuje numer telefonu klienta", () => {
            const result = customerService.updateCustomer(1, {
                phone: "987654321"
            });

            expect(result?.phone).toBe("987654321");
        });

        it("aktualizuje adres klienta", () => {
            const result = customerService.updateCustomer(1, {
                address: "Berlin"
            });

            expect(result?.address).toBe("Berlin");
        });

        it("aktualizuje wszystkie pola jednocześnie", () => {
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

        it("zachowuje niezmienione pola", () => {
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

        it("odrzuca pustą nazwę", () => {
            expect(() => customerService.updateCustomer(1, {
                name: "   "
            })).toThrow("Invalid customer name");
        });

        it("odrzuca pusty email", () => {
            expect(() => customerService.updateCustomer(1, {
                email: "   "
            })).toThrow("Invalid customer email");
        });

        it("odrzuca pusty numer telefonu", () => {
            expect(() => customerService.updateCustomer(1, {
                phone: "   "
            })).toThrow("Invalid customer phone");
        });

        it("odrzuca pusty adres", () => {
            expect(() => customerService.updateCustomer(1, {
                address: "   "
            })).toThrow("Invalid customer address");
        });

        it("odrzuca aktualizację bez przekazanych pól", () => {
            expect(() => customerService.updateCustomer(1, {}))
                .toThrow("No fields provided for update");
        });

        it("zwraca undefined dla nieistniejącego klienta", () => {
            expect(customerService.updateCustomer(999, {
                name: "John"
            })).toBeUndefined();
        });

        // NOWY TEST
        it("nie zmienia danych klienta po nieudanej aktualizacji", () => {
            expect(() => customerService.updateCustomer(1, {
                name: "   "
            })).toThrow("Invalid customer name");

            expect(customerService.getCustomer(1)).toEqual(customer);
        });
    });
});
