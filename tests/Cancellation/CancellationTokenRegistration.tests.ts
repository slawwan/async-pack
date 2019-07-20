import CancellationTokenRegistration from "../../src/Cancellation/CancellationTokenRegistration";

describe("CancellationTokenRegistration", () => {
    it("single callback", () => {
        const fn = jest.fn();
        const fns = [fn];

        const registration = new CancellationTokenRegistration(fns, fn);
        expect(fns).toStrictEqual([fn]);

        registration.dispose();
        expect(fns).toStrictEqual([]);
    });
    it("several callbacks", () => {
        const fn1 = jest.fn();
        const fn2 = jest.fn();
        const fn3 = jest.fn();
        const fns = [fn1, fn2, fn3];

        const registration = new CancellationTokenRegistration(fns, fn2);
        registration.dispose();
        expect(fns).toStrictEqual([fn1, fn3]);
    });
    it("ignore missing callback", () => {
        const fn = jest.fn();
        const fns = [];

        const registration = new CancellationTokenRegistration(fns, fn);
        registration.dispose();
        expect(fns).toStrictEqual([]);
    });
    it("dispose disposed registration", () => {
        const fn = jest.fn();
        const fns = [fn];

        const registration = new CancellationTokenRegistration(fns, fn);
        registration.dispose();
        registration.dispose();
        expect(fns).toStrictEqual([]);
    });
    it("dispose empty", () => {
        const registration = new CancellationTokenRegistration();
        expect(() => registration.dispose()).not.toThrow();
    });
});