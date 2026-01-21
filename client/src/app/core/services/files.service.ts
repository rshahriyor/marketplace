import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { IResponse } from "../models/response.model";

const API_URL = `${environment.apiUrl}/files`;

@Injectable({
    providedIn: 'root'
})

export class FilesService {
    private http = inject(HttpClient);

    uploadFile(formData: FormData): Observable<IResponse<any>> {
        return this.http.post<IResponse<any>>(`${API_URL}/upload`, formData);
    }

}