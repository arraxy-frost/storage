export interface PaginatedResponse<T> {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    items: T[];
}