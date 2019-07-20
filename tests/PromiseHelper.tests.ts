import {delay, fromToken, run, withCancellation} from "../src/PromiseHelper";
import CancellationTokenSource from "../src/Cancellation/CancellationTokenSource";
import CancellationToken from "../src/Cancellation/CancellationToken";
import OperationCanceledError from "../src/Cancellation/OperationCanceledError";

describe("PromiseHelper", () => {
    describe("delay", () => {
        it("works", async () => {
            const time1 = Date.now();
            await delay(100);
            const time2 = Date.now();
            const delta = time2 - time1;
            expect(delta).toBeGreaterThan(90);
            expect(delta).toBeLessThan(2000);
        });
        it("no delay when cancelled", async (done) => {
            const token = new CancellationToken(true);
            const time1 = Date.now();
            delay(1000, token).catch(e => {
                expect(e).toBeInstanceOf(OperationCanceledError);
                const time2 = Date.now();
                const delta = time2 - time1;
                expect(delta).toBeLessThan(100);
                done();
            });
        });
        it("cancel", async (done) => {
            const cancellation = new CancellationTokenSource();
            delay(10000000, cancellation.token).catch(e => {
                expect(e).toBeInstanceOf(OperationCanceledError);
                done();
            });
            cancellation.cancel();
        });
    });
    describe("fromToken", () => {
        it("null", (done) => {
            const continuation = jest.fn();
            fromToken(null).then(continuation);
            delay(100).then(() => {
                expect(continuation).toBeCalledTimes(0);
                done();
            })
        });
        it("none", (done) => {
            const continuation = jest.fn();
            fromToken(CancellationToken.none).then(continuation);
            delay(100).then(() => {
                expect(continuation).toBeCalledTimes(0);
                done();
            })
        });
        it("cancel", (done) => {
            const source = new CancellationTokenSource();
            fromToken(source.token).catch(e => {
                expect(e).toBeInstanceOf(OperationCanceledError);
                done();
            });
            source.cancel();
        });
        it("cancelled", (done) => {
            const token = new CancellationToken(true);
            fromToken(token).catch(e => {
                expect(e).toBeInstanceOf(OperationCanceledError);
                done();
            });
        });
    });
    describe("withCancellation", () => {
        it("null", async () => {
            const promise = Promise.resolve("xxx");
            const actual = await withCancellation(promise, null);
            expect(actual).toBe("xxx");
        });
        it("cancelled", (done) => {
            const promise = new Promise(() => undefined);
            const token = new CancellationToken(true);
            withCancellation(promise, token).catch(e => {
                expect(e).toBeInstanceOf(OperationCanceledError);
                done();
            });
        });
        it("cancel before resolve", (done) => {
            const promise = new Promise(() => undefined);
            const source = new CancellationTokenSource();
            withCancellation(promise, source.token).catch(e => {
                expect(e).toBeInstanceOf(OperationCanceledError);
                done();
            });
            source.cancel();
        });
        it("cancel after resolve", async () => {
            const source = new CancellationTokenSource();
            const promise = delay(10).then(() => "xxx");
            const wrapped = withCancellation(promise, source.token);
            await promise;
            source.cancel();
            const actual = await wrapped;
            expect(actual).toBe("xxx");
        });
        it("canceled & resolved", (done) => {
            const promise = Promise.resolve("xxx");
            const token = new CancellationToken(true);
            withCancellation(promise, token).catch(e => {
                expect(e).toBeInstanceOf(OperationCanceledError);
                done();
            });
        });
    });
    describe("run", () => {
        it("test", async () => {
            const actual = await run(async () => "xxx");
            expect(actual).toBe("xxx");
        });
    });
});
