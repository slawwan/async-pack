import CancellationToken from "../../src/Cancellation/CancellationToken";
import OperationCanceledError from "../../src/Cancellation/OperationCanceledError";
import CancellationTokenSource from "../../src/Cancellation/CancellationTokenSource";

describe("CancellationToken", () => {
    describe("none", () => {
        it("canBeCanceled", () => {
            const token = CancellationToken.none;
            expect(token.canBeCanceled).toBe(false);
        });
        it("isCancellationRequested", () => {
            const token = CancellationToken.none;
            expect(token.isCancellationRequested).toBe(false);
        });
        it("throwIfCancellationRequested", () => {
            const token = CancellationToken.none;
            expect(() => token.throwIfCancellationRequested()).not.toThrow();
        });
        it("register", () => {
            const token = CancellationToken.none;
            const fn = jest.fn();
            token.register(fn);
            expect(fn).toBeCalledTimes(0);
        });
    });
    describe("new empty", () => {
        it("canBeCanceled", () => {
            const token = new CancellationToken();
            expect(token.canBeCanceled).toBe(false);
        });
        it("isCancellationRequested", () => {
            const token = new CancellationToken();
            expect(token.isCancellationRequested).toBe(false);
        });
        it("throwIfCancellationRequested", () => {
            const token = new CancellationToken();
            expect(() => token.throwIfCancellationRequested()).not.toThrow();
        });
        it("register", () => {
            const token = new CancellationToken();
            const fn = jest.fn();
            token.register(fn);
            expect(fn).toBeCalledTimes(0);
        });
    });
    describe("new from null", () => {
        it("canBeCanceled", () => {
            const token = new CancellationToken(null);
            expect(token.canBeCanceled).toBe(false);
        });
        it("isCancellationRequested", () => {
            const token = new CancellationToken(null);
            expect(token.isCancellationRequested).toBe(false);
        });
        it("throwIfCancellationRequested", () => {
            const token = new CancellationToken(null);
            expect(() => token.throwIfCancellationRequested()).not.toThrow();
        });
        it("register", () => {
            const token = new CancellationToken(null);
            const fn = jest.fn();
            token.register(fn);
            expect(fn).toBeCalledTimes(0);
        });
    });
    describe("new not cancellable", () => {
        it("canBeCanceled", () => {
            const token = new CancellationToken(false);
            expect(token.canBeCanceled).toBe(false);
        });
        it("isCancellationRequested", () => {
            const token = new CancellationToken(false);
            expect(token.isCancellationRequested).toBe(false);
        });
        it("throwIfCancellationRequested", () => {
            const token = new CancellationToken(false);
            expect(() => token.throwIfCancellationRequested()).not.toThrow();
        });
        it("register", () => {
            const token = new CancellationToken(false);
            const fn = jest.fn();
            token.register(fn);
            expect(fn).toBeCalledTimes(0);
        });
    });
    describe("new cancelled", () => {
        it("canBeCanceled", () => {
            const token = new CancellationToken(true);
            expect(token.canBeCanceled).toBe(true);
        });
        it("isCancellationRequested", () => {
            const token = new CancellationToken(true);
            expect(token.isCancellationRequested).toBe(true);
        });
        it("throwIfCancellationRequested", () => {
            const token = new CancellationToken(true);
            expect(() => token.throwIfCancellationRequested()).toThrow(OperationCanceledError);
        });
        it("register", () => {
            const token = new CancellationToken(true);
            const fn = jest.fn();
            token.register(fn);
            expect(fn).toBeCalledTimes(1);
        });
    });
    describe("new from not cancelled source", () => {
        it("canBeCanceled", () => {
            const source = new CancellationTokenSource();
            const token = new CancellationToken(source);
            expect(token.canBeCanceled).toBe(true);
        });
        it("isCancellationRequested", () => {
            const source = new CancellationTokenSource();
            const token = new CancellationToken(source);
            expect(token.isCancellationRequested).toBe(false);
        });
        it("throwIfCancellationRequested", () => {
            const source = new CancellationTokenSource();
            const token = new CancellationToken(source);
            expect(() => token.throwIfCancellationRequested()).not.toThrow();
        });
        it("register", () => {
            const source = new CancellationTokenSource();
            const token = new CancellationToken(source);
            const fn = jest.fn();
            token.register(fn);
            expect(fn).toBeCalledTimes(0);
        });
    });
    describe("new from cancelled source", () => {
        it("canBeCanceled", () => {
            const source = new CancellationTokenSource(true);
            const token = new CancellationToken(source);
            expect(token.canBeCanceled).toBe(true);
        });
        it("isCancellationRequested", () => {
            const source = new CancellationTokenSource(true);
            const token = new CancellationToken(source);
            expect(token.isCancellationRequested).toBe(true);
        });
        it("throwIfCancellationRequested", () => {
            const source = new CancellationTokenSource(true);
            const token = new CancellationToken(source);
            expect(() => token.throwIfCancellationRequested()).toThrow(OperationCanceledError);
        });
        it("register", () => {
            const source = new CancellationTokenSource(true);
            const token = new CancellationToken(source);
            const fn = jest.fn();
            token.register(fn);
            expect(fn).toBeCalledTimes(1);
        });
    });
});