export interface ICompany {
    id?: number,
    name?: string,
    image?: string,
    tags?: string[],
    is_favorited?: boolean,
    favorites_count?: number,
    categories?: string[],
}

export interface ICompaniesResponseForMainPage {
    companies: ICompany[],
    category_id: number,
    category_name: string
}