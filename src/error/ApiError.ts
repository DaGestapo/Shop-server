export default class ApiError extends Error {
    status: number;
    message: string;

    constructor(status: number, message: string) {
        super();
        this.status = status;
        this.message = message;
    }

    static badRequest(message: string): Error {
        return new ApiError(400, message);
    }

    static unauthorized(message: string): Error {
        return new ApiError(401, message);
    }

    static forbidden (message: string): Error {
        return new ApiError(403, message);
    }

    static notFound(message: string): Error {
        return new ApiError(404, message);
    }

    static requestTimeout(message: string): Error {
        return new ApiError(408, message);
    }

    static internalServer(message: string): Error {
        return new ApiError(500, message);
    }

    static badGateway(message: string): Error {
        return new ApiError(502, message);
    }

    static insufficientStorage(message: string): Error {
        return new ApiError(507, message);
    }

} 