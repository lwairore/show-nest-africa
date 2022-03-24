export type PaginatedItemHttpResponse<T> = {
    count?: number;
    next?: number;
    results?: ReadonlyArray<T>;
}
