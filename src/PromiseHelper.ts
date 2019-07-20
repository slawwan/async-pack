import CancellationToken from "./Cancellation/CancellationToken";
import CancellationTokenSource from "./Cancellation/CancellationTokenSource";

export const delay = (timeout: number, token?: Nullable<CancellationToken>): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
        const timer = !token || !token.isCancellationRequested
            ? setTimeout(() => resolve(), timeout)
            : 0;
        if (token) {
            token.register(() => {
                clearTimeout(timer);
                try {
                    token.throwIfCancellationRequested();
                } catch (error) {
                    reject(error);
                }
            });
        }
    });
};

export const fromToken = <T = void>(token: Nullable<CancellationToken>): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
        if (token) {
            token.register(() => {
                try {
                    token.throwIfCancellationRequested();
                } catch (error) {
                    reject(error);
                }
            });
        }
    });
};

export const withCancellation = <T>(promise: Promise<T>, token: Nullable<CancellationToken>): Promise<T> => {
    return Promise.race([fromToken<T>(token), promise]);
};

export const run = <T>(func: () => Promise<T>): Promise<T> => {
    return func();
};

export const resolveAfter = <T>(promise: Promise<T>, timeout: number, token?: Nullable<CancellationToken>): Promise<T> => {
    return Promise.all([withCancellation(promise, token), delay(timeout, token)]).then(x => x[0]);
};

export const rejectAfter = <T>(promise: Promise<T>, timeout: number, token?: Nullable<CancellationToken>): Promise<T> => {
    const timeoutToken = new CancellationTokenSource(timeout).token;
    const linkedToken = CancellationTokenSource.createLinkedTokenSource(timeoutToken, token).token;
    return withCancellation(promise, linkedToken);
};

export const continueAfter = <T>(promise: Promise<T>, timeout: number, token?: Nullable<CancellationToken>): Promise<T> => {
    return delay(timeout, token).then(() => withCancellation(promise, token));
};
