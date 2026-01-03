import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { ICompaniesResponseForMainPage, ICompany } from "../../pages/home/home";

const API_URL = `${environment.apiUrl}/companies`;

@Injectable({
    providedIn: 'root'
})

export class CompaniesService {
    private http = inject(HttpClient);

    getCompaniesForMainPage(): Observable<ICompaniesResponseForMainPage[]> {
        return this.http.get<ICompaniesResponseForMainPage[]>(`${API_URL}/for_main_page`);
    }

    getCompaniesByCategory(): Observable<ICompany[]> {
        return this.http.get<ICompany[]>(`${API_URL}/by_category`);
    }
}