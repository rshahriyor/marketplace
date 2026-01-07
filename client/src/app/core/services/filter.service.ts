import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { IFilter, IFilterRequest } from "../models/filter.model";

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

    getCategories(): Observable<IFilter[]> {
        return this.http.get<IFilter[]>(`${API_URL}/categories`);
    }

    getTags(): Observable<IFilter[]> {
        return this.http.get<IFilter[]>(`${API_URL}/tags`);
    }

    getRegions(): Observable<IFilter[]> {
        return this.http.get<IFilter[]>(`${API_URL}/regions`);
    }

    getCities(): Observable<IFilter[]> {
        return this.http.get<IFilter[]>(`${API_URL}/cities`);
    }
}