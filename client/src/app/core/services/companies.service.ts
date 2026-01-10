import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { ICompaniesResponseForMainPage, ICompany } from "../models/company.model";
import { IFilterRequest } from "../models/filter.model";

const API_URL = `${environment.apiUrl}/companies`;

@Injectable({
    providedIn: 'root'
})

export class CompaniesService {
    private http = inject(HttpClient);

    getCompaniesForMainPage(): Observable<ICompaniesResponseForMainPage[]> {
        return this.http.get<ICompaniesResponseForMainPage[]>(`${API_URL}/for_main_page`);
    }

    getCompaniesByFilter(filter: IFilterRequest): Observable<ICompany[]> {
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
        return this.http.get<ICompany[]>(`${API_URL}/by_filter`, { params });
    }

    getCompanyDetail(company_id: number): Observable<ICompany> {
        return this.http.get<ICompany>(`${API_URL}/${company_id}`);
    }

    getOwnCompanies(): Observable<ICompany[]> {
        return this.http.get<ICompany[]>(`${API_URL}/own`);
    }

    addCompany(companyData: ICompany): Observable<ICompany> {
        return this.http.post<ICompany>(`${API_URL}`, companyData);
    }
}