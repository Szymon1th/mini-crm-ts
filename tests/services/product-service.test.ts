
import { beforeEach, describe, expect, it } from "vitest";
import ProductService from "../../src/services/product-service";
import type { Product } from "../../src/types/product";

describe("ProductService", () => {
    let productService: ProductService;

    const keyboard: Product = {
        id: 1,
        name: "Klawiatura",
        price: 150,
        stock: 10
    };

    beforeEach(() => {
        productService = new ProductService();
        productService.addProduct(keyboard);
    });

    describe("addProduct()", () => {
        it("dodaje poprawny produkt", () => {
            const mouse: Product = {
                id: 2,
                name: "Mysz",
                price: 80,
                stock: 5
            };

            expect(() => productService.addProduct(mouse)).not.toThrow();
            expect(productService.getProduct(2)).toEqual(mouse);
        });

        it("odrzuca produkt z niepoprawną strukturą", () => {
            const invalidProduct: unknown = {
                id: 2,
                name: "Mysz",
                price: 80
            };

            expect(() => productService.addProduct(invalidProduct))
                .toThrow("Invalid product type");
        });

        // NOWY TEST: null nie jest poprawnym produktem.
        it("odrzuca null", () => {
            expect(() => productService.addProduct(null))
                .toThrow("Invalid product type");
        });

        // NOWY TEST: tablica nie jest produktem.
        it("odrzuca tablicę zamiast obiektu", () => {
            expect(() => productService.addProduct([keyboard]))
                .toThrow("Invalid product type");
        });

        it("odrzuca produkt z pustą nazwą", () => {
            expect(() => productService.addProduct({
                ...keyboard,
                id: 2,
                name: "   "
            })).toThrow("Invalid product name");
        });

        it("odrzuca nazwę dłuższą niż 16 znaków", () => {
            expect(() => productService.addProduct({
                ...keyboard,
                id: 2,
                name: "VeryLongProductName"
            })).toThrow("Invalid product name");
        });

        it("odrzuca ujemną cenę", () => {
            expect(() => productService.addProduct({
                ...keyboard,
                id: 2,
                price: -150
            })).toThrow("Invalid product price");
        });

        it("odrzuca cenę NaN", () => {
            expect(() => productService.addProduct({
                ...keyboard,
                id: 2,
                price: NaN
            })).toThrow("Invalid product price");
        });

        it("odrzuca nieskończoną cenę", () => {
            expect(() => productService.addProduct({
                ...keyboard,
                id: 2,
                price: Infinity
            })).toThrow("Invalid product price");
        });

        // NOWY TEST: cena zero jest dozwolona w obecnej implementacji.
        it("akceptuje cenę równą zero", () => {
            expect(() => productService.addProduct({
                ...keyboard,
                id: 2,
                price: 0
            })).not.toThrow();
        });

        it("odrzuca ujemny stock", () => {
            expect(() => productService.addProduct({
                ...keyboard,
                id: 2,
                stock: -1
            })).toThrow("Invalid product stock");
        });

        it("odrzuca niecałkowity stock", () => {
            expect(() => productService.addProduct({
                ...keyboard,
                id: 2,
                stock: 1.5
            })).toThrow("Invalid product stock");
        });

        it("odrzuca produkt z duplikatem ID", () => {
            expect(() => productService.addProduct(keyboard)).toThrow();
        });
    });

    describe("getProduct()", () => {
        it("zwraca produkt o podanym ID", () => {
            expect(productService.getProduct(1)).toEqual(keyboard);
        });

        it("zwraca undefined dla nieistniejącego produktu", () => {
            expect(productService.getProduct(999)).toBeUndefined();
        });

        // NOWY TEST: modyfikacja kopii nie zmienia danych w Repository.
        it("nie pozwala zmienić produktu przez modyfikację zwróconej kopii", () => {
            const product = productService.getProduct(1);

            if (!product) throw new Error("Product not found");

            product.stock = 0;

            expect(productService.getProduct(1)?.stock).toBe(10);
        });
    });

    describe("updateProduct()", () => {
        it("aktualizuje nazwę produktu", () => {
            const result = productService.updateProduct(1, {
                name: "Mysz"
            });

            expect(result?.name).toBe("Mysz");
        });

        it("aktualizuje cenę produktu", () => {
            const result = productService.updateProduct(1, {
                price: 200
            });

            expect(result?.price).toBe(200);
        });

        it("aktualizuje stock produktu", () => {
            const result = productService.updateProduct(1, {
                stock: 20
            });

            expect(result?.stock).toBe(20);
        });

        it("aktualizuje kilka pól jednocześnie", () => {
            const result = productService.updateProduct(1, {
                name: "Mysz",
                price: 80,
                stock: 5
            });

            expect(result).toEqual({
                id: 1,
                name: "Mysz",
                price: 80,
                stock: 5
            });
        });

        it("zachowuje niezmienione pola produktu", () => {
            const result = productService.updateProduct(1, {
                name: "Mysz"
            });

            expect(result).toEqual({
                id: 1,
                name: "Mysz",
                price: 150,
                stock: 10
            });
        });

        it("zwraca undefined dla nieistniejącego produktu", () => {
            expect(productService.updateProduct(999, {
                name: "Mysz"
            })).toBeUndefined();
        });

        it("odrzuca pustą nazwę", () => {
            expect(() => productService.updateProduct(1, {
                name: "   "
            })).toThrow("Invalid product name");
        });

        it("odrzuca zbyt długą nazwę", () => {
            expect(() => productService.updateProduct(1, {
                name: "VeryLongProductName"
            })).toThrow("Invalid product name");
        });

        it("odrzuca ujemną cenę", () => {
            expect(() => productService.updateProduct(1, {
                price: -10
            })).toThrow("Invalid product price");
        });

        it("odrzuca niepoprawny stock", () => {
            expect(() => productService.updateProduct(1, {
                stock: 1.5
            })).toThrow("Invalid product stock");
        });

        it("odrzuca aktualizację bez podanych pól", () => {
            expect(() => productService.updateProduct(1, {}))
                .toThrow("No fields provided for update");
        });
    });

    describe("decreaseStock()", () => {
        it("zmniejsza stan magazynowy", () => {
            const result = productService.decreaseStock(1, 3);

            expect(result?.stock).toBe(7);
            expect(productService.getProduct(1)?.stock).toBe(7);
        });

        it("zwraca undefined dla nieistniejącego produktu", () => {
            expect(productService.decreaseStock(999, 2)).toBeUndefined();
        });

        it.each([0, -1, 1.5, NaN, Infinity])(
            "odrzuca nieprawidłową ilość: %s",
            quantity => {
                expect(() => productService.decreaseStock(1, quantity))
                    .toThrow("Invalid product quantity");

                expect(productService.getProduct(1)?.stock).toBe(10);
            }
        );

        it("odrzuca zmniejszenie stocku poniżej zera", () => {
            expect(() => productService.decreaseStock(1, 11))
                .toThrow("Insufficient product stock");

            expect(productService.getProduct(1)?.stock).toBe(10);
        });

        it("pozwala zmniejszyć stock dokładnie do zera", () => {
            const result = productService.decreaseStock(1, 10);

            expect(result?.stock).toBe(0);
        });
    });

    describe("increaseStock()", () => {
        it("zwiększa stan magazynowy", () => {
            const result = productService.increaseStock(1, 5);

            expect(result?.stock).toBe(15);
            expect(productService.getProduct(1)?.stock).toBe(15);
        });

        it("zwraca undefined dla nieistniejącego produktu", () => {
            expect(productService.increaseStock(999, 2)).toBeUndefined();
        });

        it.each([0, -1, 1.5, NaN, Infinity])(
            "odrzuca nieprawidłową ilość: %s",
            quantity => {
                expect(() => productService.increaseStock(1, quantity))
                    .toThrow("Invalid product quantity");

                expect(productService.getProduct(1)?.stock).toBe(10);
            }
        );

        it("odrzuca nieprawidłowe ID produktu", () => {
            expect(() => productService.increaseStock(-1, 2))
                .toThrow("ProductID should be greater than 0");
        });

        it("odrzuca ID przekraczające bezpieczny zakres", () => {
            expect(() => productService.increaseStock(
                Number.MAX_SAFE_INTEGER + 1,
                2
            )).toThrow("ProductID is not a safe integer");
        });

        // NOWY TEST: zabezpieczenie przed przepełnieniem stanu magazynowego.
        it("odrzuca stock przekraczający Number.MAX_SAFE_INTEGER", () => {
            productService.updateProduct(1, {
                stock: Number.MAX_SAFE_INTEGER
            });

            expect(() => productService.increaseStock(1, 1))
                .toThrow("Resulting stock exceeds safe integer limit");

            expect(productService.getProduct(1)?.stock)
                .toBe(Number.MAX_SAFE_INTEGER);
        });
    });
});
