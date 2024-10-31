export interface IResponseBody {
    data?: any;
}
export function responseBody(
    data?: any,

): IResponseBody {
    return {
        data: data,
    };
}
