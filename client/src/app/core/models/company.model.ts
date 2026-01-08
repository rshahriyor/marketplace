export interface ICompany {
    id?: number,
    name?: string,
    image?: string,
    tags?: {
        tag_id: number,
        tag_name: string
    }[],
    is_favorited?: boolean,
    favorites_count?: number,
    categories?: string[],
    desc?: string,
    phone_number?: number,
    address?: string,
    latitude?: number,
    longitude?: number,
    region_id?: number,
    region_name?: string,
    city_id?: number,
    city_name?: string
}

export interface ICompaniesResponseForMainPage {
    companies: ICompany[],
    category_id: number,
    category_name: string
}