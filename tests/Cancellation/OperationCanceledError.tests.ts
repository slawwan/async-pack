import OperationCanceledError from "../../src/Cancellation/OperationCanceledError";
import CancellationToken from "../../src/Cancellation/CancellationToken";

describe("OperationCanceledError", () => {
    it("test", () => {
        const token = new CancellationToken();
        const error = new OperationCanceledError("Operation canceled", token);

        expect(error.message).toBe("Operation canceled");
        expect(error.cancellationToken).toBe(token);
        expect(error).toBeInstanceOf(OperationCanceledError);
        expect(error).toBeInstanceOf(Error);
    });
});