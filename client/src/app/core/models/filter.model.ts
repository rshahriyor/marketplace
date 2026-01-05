export interface IFilter {
    id?: number,
    name?: string
}

export interface IFilterRequest {
    category_ids: number[],
    tag_ids: number[]
}