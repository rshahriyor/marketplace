import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IResponse } from "../models/response.model";

const API_URL = `${environment.apiUrl}/login`;

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private http = inject(HttpClient);

    login(username: string, password: string): Observable<IResponse<{ code: number, token: string, message: string }>> {
        return this.http.post<IResponse<{ code: number, token: string, message: string }>>(API_URL, { username, password });
    }

    clearTokens(): void {
        localStorage.clear();
    }

    get accessToken(): string {
        return localStorage.getItem('token');
    }
}