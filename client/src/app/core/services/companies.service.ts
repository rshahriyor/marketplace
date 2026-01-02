import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

const API_URL = `${environment.apiUrl}/companies`;

@Injectable({
    providedIn: 'root'
})

export class CompaniesService {
    private http = inject(HttpClient);

    getCompaniesForMainPage(): Observable<any[]> {
        return this.http.get<any[]>(`${API_URL}/for_main_page`);
    }
}