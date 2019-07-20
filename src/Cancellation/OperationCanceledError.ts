import CancellationToken from "./CancellationToken";

export default class OperationCanceledError extends Error {
    private readonly token: CancellationToken;

    public constructor(message: string, token: CancellationToken) {
        super(message);
        this.token = token;
        Object.setPrototypeOf(this, OperationCanceledError.prototype);
    }

    public get cancellationToken(): CancellationToken {
        return this.token;
    }
}