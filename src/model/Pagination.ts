enum Direction {
    ASC = "ASC",
    DESC = "DESC",
}

export interface OrderBy {
    label: string,
    value: string,
}

export interface Sort {
    orderBy?: string,
    direction?: Direction,
}

export interface Pagination extends Sort{
    page: number,
    size: number,
}

export default interface PaginationResponse<T> {
    content: T[],
    pageable: {
        pageNumber: number,
        pageSize: number,
        sort: {
            empty: boolean,
            sorted: boolean,
            unsorted: boolean,
        },
        offset: number,
        unpaged: boolean,
        paged: boolean
    },
    last: boolean,
    totalPages: number,
    totalElements: number,
    size: number,
    number: number,
    sort: {
        empty: boolean,
        sorted: boolean,
        unsorted: boolean
    },
    first: boolean,
    numberOfElements: number,
    empty: boolean
}

export { Direction };