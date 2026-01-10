import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { IFilter, IFilterRequest } from "../models/filter.model";
import { IResponse } from "../models/response.model";

const API_URL = `${environment.apiUrl}`;

@Injectable({
    providedIn: 'root'
})

export class FilterService {
    filter = new BehaviorSubject<IFilterRequest>({
        category_ids: [],
        tag_ids: [],
        region_ids: [],
        city_ids: []
    });
    private http = inject(HttpClient);

    getCategories(): Observable<IResponse<IFilter[]>> {
        return this.http.get<IResponse<IFilter[]>>(`${API_URL}/categories`);
    }

    getTags(): Observable<IResponse<IFilter[]>> {
        return this.http.get<IResponse<IFilter[]>>(`${API_URL}/tags`);
    }

    getRegions(): Observable<IResponse<IFilter[]>> {
        return this.http.get<IResponse<IFilter[]>>(`${API_URL}/regions`);
    }

    getCities(): Observable<IResponse<IFilter[]>> {
        return this.http.get<IResponse<IFilter[]>>(`${API_URL}/cities`);
    }
}