export interface ICompany {
    id?: number,
    name?: string,
    image?: string,
    tags?: {
        tag_id: number,
        tag_name: string
    }[],
    is_favorite?: boolean,
    favorites_count?: number,
    category_id?: number,
    desc?: string,
    phone_number?: number,
    address?: string,
    latitude?: number,
    longitude?: number,
    region_id?: number,
    region_name?: string,
    city_id?: number,
    city_name?: string,
    schedules?: {
        day_of_week?: number,
        start_at?: string,
        end_at?: string,
        lunch_start_at?: string,
        lunch_end_at?: string,
        is_working_day?: boolean,
        is_day_and_night?: boolean,
        without_breaks?: boolean
    }[],
    social_media?: {
        social_media_id?: number,
        social_media_name?: string,
        account_url?: string,
        icon?: string
    }[]
}

export interface ICompaniesResponseForMainPage {
    companies: ICompany[],
    category_id: number,
    category_name: string
}