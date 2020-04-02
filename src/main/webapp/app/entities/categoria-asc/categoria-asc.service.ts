import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ICategoriaAsc } from 'app/shared/model/categoria-asc.model';

type EntityResponseType = HttpResponse<ICategoriaAsc>;
type EntityArrayResponseType = HttpResponse<ICategoriaAsc[]>;

@Injectable({ providedIn: 'root' })
export class CategoriaAscService {
  public resourceUrl = SERVER_API_URL + 'api/categoria-ascs';

  constructor(protected http: HttpClient) {}

  create(categoriaAsc: ICategoriaAsc): Observable<EntityResponseType> {
    return this.http.post<ICategoriaAsc>(this.resourceUrl, categoriaAsc, { observe: 'response' });
  }

  update(categoriaAsc: ICategoriaAsc): Observable<EntityResponseType> {
    return this.http.put<ICategoriaAsc>(this.resourceUrl, categoriaAsc, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICategoriaAsc>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICategoriaAsc[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
