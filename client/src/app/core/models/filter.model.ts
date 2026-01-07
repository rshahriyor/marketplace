export interface IFilter {
    id?: number,
    name?: string,
    icon?: string
}

export interface IFilterRequest {
    category_ids: number[],
    tag_ids: number[],
    region_ids: number[],
    city_ids: number[]
}