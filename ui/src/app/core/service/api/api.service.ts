import { ShortLink } from './../../model/ShortLink';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  linkIdRegex: RegExp = /{id}/gi;

  getAll(): Observable<ShortLink[]> {
    const path = API_CONFIG.getAll;
    return this.http.get<ShortLink[]>(path);
  }

  getById(id: number): Observable<ShortLink> {
    const path = API_CONFIG.getById.replace(this.linkIdRegex, id.toString());
    return this.http.get<ShortLink>(path);
  }

  add(shortLink: ShortLink): Observable<ShortLink> {
    const path = API_CONFIG.add;
    return this.http.post<ShortLink>(path, shortLink);
  }

  update(id: number, shortLink: ShortLink): Observable<ShortLink> {
    const path = API_CONFIG.update.replace(this.linkIdRegex, id.toString());
    return this.http.put<ShortLink>(path, shortLink);
  }

  delete(id: number): Observable<ShortLink> {
    const path = API_CONFIG.delete.replace(this.linkIdRegex, id.toString());
    return this.http.delete<any>(path);
  }
}
