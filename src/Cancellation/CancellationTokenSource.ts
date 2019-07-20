import CancellationToken from "./CancellationToken";
import CancellationTokenRegistration from "./CancellationTokenRegistration";

enum State {
    CannotBeCanceled = 0,
    NotCanceled = 1,
    Notifying = 2,
    NotifyingComplete = 3
}

export default class CancellationTokenSource {
    private readonly callbacks: Array<() => void> = [];
    private state: State;
    private timer: number = 0;

    public constructor();
    public constructor(timeout: number);
    public constructor(canceled: boolean);
    public constructor(arg?: boolean | number) {
        if (arg == null) {
            this.state = State.NotCanceled;
        } else if (typeof arg === "number") {
            this.state = State.NotCanceled;
            this.createTimer(arg);
        } else {
            this.state = arg ? State.NotifyingComplete : State.CannotBeCanceled;
        }
    }

    public get token(): CancellationToken {
        return new CancellationToken(this);
    }

    public get canBeCanceled(): boolean {
        return this.state !== State.CannotBeCanceled;
    }

    public get isCancellationRequested(): boolean {
        return this.state > State.NotCanceled;
    }

    public cancel = () => {
        clearTimeout(this.timer);
        if (!this.isCancellationRequested) {
            this.state = State.Notifying;
            try {
                for (const action of this.callbacks) {
                    action();
                }
            } finally {
                this.state = State.NotifyingComplete;
            }
        }
    };

    public cancelAfter = (timeout: number) => {
        if (!this.isCancellationRequested) {
            this.createTimer(timeout);
        }
    };

    public internalRegister(action: () => void): CancellationTokenRegistration {
        if (this.isCancellationRequested) {
            action();
            return new CancellationTokenRegistration();
        }

        this.callbacks.push(action);
        return new CancellationTokenRegistration(this.callbacks, action);
    }

    private createTimer = (timeout: number) => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.cancel(), timeout);
    };

    public static createLinkedTokenSource(...tokens: Array<Nullable<CancellationToken>>): CancellationTokenSource {
        const source = new CancellationTokenSource();
        for (const token of tokens) {
            if (token) {
                token.register(source.cancel);
            }
        }
        return source;
    }

    public static cancel(token: Nullable<CancellationTokenSource>): void {
        if (token) {
            token.cancel();
        }
    }

    public static renew(token: Nullable<CancellationTokenSource>): CancellationTokenSource {
        if (token) {
            token.cancel();
        }
        return new CancellationTokenSource();
    }
}