import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IResponse } from "../models/response.model";
import { IUser } from "../models/user.model";

const API_URL = `${environment.apiUrl}/users`;

@Injectable({
    providedIn: 'root'
})

export class UserService {
    private http = inject(HttpClient);

    getProfile(): Observable<IResponse<IUser>> {
        return this.http.get<IResponse<IUser>>(`${API_URL}/own`);
    }
    
}