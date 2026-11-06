
import { describe, it, expect, beforeEach } from "vitest";
import { Repository } from "../../src/repositories/repository";

interface TestItem {
    id: number;
    name: string;
    price: number;
    metadata?: {
        category: string;
    };
}

describe("Repository", () => {
    let repository: Repository<TestItem>;

    beforeEach(() => {
        repository = new Repository<TestItem>();
    });

    describe("addItem()", () => {
        it("adds a new item", () => {
            const item: TestItem = {
                id: 1,
                name: "Keyboard",
                price: 150
            };

            repository.addItem(item);

            expect(repository.getById(1)).toEqual(item);
        });

        it("rejects duplicate IDs", () => {
            repository.addItem({
                id: 1,
                name: "Keyboard",
                price: 150
            });

            expect(() => repository.addItem({
                id: 1,
                name: "Mouse",
                price: 80
            })).toThrow("Cant add item, id is already taken");
        });

        it("does not share top-level properties with the input object", () => {
            const item: TestItem = {
                id: 1,
                name: "Keyboard",
                price: 150
            };

            repository.addItem(item);

            item.name = "Changed";

            expect(repository.getById(1)?.name).toBe("Keyboard");
        });
    });

    describe("getById()", () => {
        it("returns an existing item", () => {
            repository.addItem({
                id: 1,
                name: "Keyboard",
                price: 150
            });

            expect(repository.getById(1)).toEqual({
                id: 1,
                name: "Keyboard",
                price: 150
            });
        });

        it("returns undefined for a missing item", () => {
            expect(repository.getById(999)).toBeUndefined();
        });

        it("returns a copy instead of the original object", () => {
            repository.addItem({
                id: 1,
                name: "Keyboard",
                price: 150
            });

            const item = repository.getById(1)!;
            item.name = "Changed";

            expect(repository.getById(1)?.name).toBe("Keyboard");
        });
    });

    describe("exists()", () => {
        it("returns true for an existing item", () => {
            repository.addItem({
                id: 1,
                name: "Keyboard",
                price: 150
            });

            expect(repository.exists(1)).toBe(true);
        });

        it("returns false for a missing item", () => {
            expect(repository.exists(999)).toBe(false);
        });
    });

    describe("getAll()", () => {
        it("returns an empty array when repository is empty", () => {
            expect(repository.getAll()).toEqual([]);
        });

        it("returns all stored items", () => {
            repository.addItem({
                id: 1,
                name: "Keyboard",
                price: 150
            });

            repository.addItem({
                id: 2,
                name: "Mouse",
                price: 80
            });

            expect(repository.getAll()).toHaveLength(2);
        });

        it("returns copies of stored items", () => {
            repository.addItem({
                id: 1,
                name: "Keyboard",
                price: 150
            });

            const items = repository.getAll();
            items[0].name = "Changed";

            expect(repository.getById(1)?.name).toBe("Keyboard");
        });
    });

    describe("update()", () => {
        beforeEach(() => {
            repository.addItem({
                id: 1,
                name: "Keyboard",
                price: 150
            });
        });

        it("updates an existing item", () => {
            const result = repository.update(1, {
                name: "Gaming Keyboard",
                price: 250
            });

            expect(result).toEqual({
                id: 1,
                name: "Gaming Keyboard",
                price: 250
            });
        });

        it("returns undefined for a missing item", () => {
            expect(repository.update(999, {
                name: "Mouse"
            })).toBeUndefined();
        });

        it("updates only the provided fields", () => {
            repository.update(1, {
                name: "Gaming Keyboard"
            });

            expect(repository.getById(1)).toEqual({
                id: 1,
                name: "Gaming Keyboard",
                price: 150
            });
        });

        it("preserves the original ID", () => {
            repository.update(1, {
                name: "Gaming Keyboard"
            });

            expect(repository.getById(1)?.id).toBe(1);
        });

        it("allows an empty update without changing the item", () => {
            const result = repository.update(1, {});

            expect(result).toEqual({
                id: 1,
                name: "Keyboard",
                price: 150
            });
        });

        it("returns a copy of the updated item", () => {
            const result = repository.update(1, {
                name: "Gaming Keyboard"
            });

            result!.name = "Changed";

            expect(repository.getById(1)?.name).toBe("Gaming Keyboard");
        });
    });
});
