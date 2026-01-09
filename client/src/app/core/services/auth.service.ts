import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

const API_URL = `${environment.apiUrl}/login`;

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    private http = inject(HttpClient);

    login(username: string, password: string): Observable<{ code: number, token: string, message: string }> {
        return this.http.post<{ code: number, token: string, message: string }>(API_URL, { username, password });
    }
}