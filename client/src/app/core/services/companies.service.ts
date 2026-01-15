import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ICompaniesResponseForMainPage, ICompany } from "../models/company.model";
import { IFilterRequest } from "../models/filter.model";
import { IResponse } from "../models/response.model";

const API_URL = `${environment.apiUrl}/companies`;

@Injectable({
    providedIn: 'root'
})

export class CompaniesService {
    private http = inject(HttpClient);

    getCompaniesForMainPage(): Observable<IResponse<ICompaniesResponseForMainPage[]>> {
        return this.http.get<IResponse<ICompaniesResponseForMainPage[]>>(`${API_URL}/for_main_page`);
    }

    getCompaniesByFilter(filter: IFilterRequest): Observable<IResponse<ICompany[]>> {
        let params = new HttpParams();

        if (filter.category_ids.length > 0) {
            params = params.set(
                'category_ids',
                filter.category_ids.join(',')
            );
        }

        if (filter.tag_ids.length > 0) {
            params = params.set(
                'tag_ids',
                filter.tag_ids.join(',')
            );
        }

        if (filter.region_ids.length > 0) {
            params = params.set(
                'region_ids',
                filter.region_ids.join(',')
            );
        }

        if (filter.city_ids.length > 0) {
            params = params.set(
                'city_ids',
                filter.city_ids.join(',')
            );
        }

        if (filter.is_favorite) {
            params = params.set('is_favorite', true);
        }

        return this.http.get<IResponse<ICompany[]>>(`${API_URL}/by_filter`, { params });
    }

    getCompanyDetail(company_id: number): Observable<IResponse<ICompany>> {
        return this.http.get<IResponse<ICompany>>(`${API_URL}/${company_id}`);
    }

    getOwnCompanies(): Observable<IResponse<ICompany[]>> {
        return this.http.get<IResponse<ICompany[]>>(`${API_URL}/own`);
    }

    addCompany(companyData: ICompany): Observable<IResponse<ICompany>> {
        return this.http.post<IResponse<ICompany>>(`${API_URL}`, companyData);
    }

    updateCompany(company_id: number, companyData: ICompany): Observable<IResponse<ICompany>> {
        return this.http.put<IResponse<ICompany>>(`${API_URL}/${company_id}`, companyData);
    }

    toggleFavoriteCompany(company_id: number): Observable<IResponse<null>> {
        return this.http.post<IResponse<null>>(`${API_URL}/toggle_favorite/${company_id}`, {});
    }

    searchCompanies(query: string): Observable<IResponse<ICompany[]>> {
        const params = new HttpParams().set('q', query);
        return this.http.get<IResponse<ICompany[]>>(`${API_URL}/search`, { params });
    }
}